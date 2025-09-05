"use client";

import { MissionService } from '@/lib/firebase/services/missions';
import { COLLECTIONS, Mission, MissionLevel, MissionStatus } from '@/types/firebase';
import { limit, orderBy, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useFirestore } from './useFirestore';

interface UseMissionsOptions {
    status?: MissionStatus;
    level?: MissionLevel;
    proposerId?: string;
    isVisible?: boolean;
    limit?: number;
    enabled?: boolean;
}

interface UseMissionsReturn {
    missions: Mission[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
    loadMore: () => Promise<void>;
    hasMore: boolean;
}

export const useMissions = (options: UseMissionsOptions = {}): UseMissionsReturn => {
    const {
        status,
        level,
        proposerId,
        isVisible,
        limit: limitCount = 20,
        enabled = true
    } = options;

    const [hasMore, setHasMore] = useState(true);
    const [lastDoc, setLastDoc] = useState<any>(null);

    // Build Firestore query constraints
    const constraints = [];

    if (status) constraints.push(where('status', '==', status));
    if (level) constraints.push(where('level', '==', level));
    if (proposerId) constraints.push(where('proposerId', '==', proposerId));
    if (isVisible !== undefined) constraints.push(where('isVisible', '==', isVisible));

    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(limit(limitCount));

    const { data: missions, loading, error, refetch } = useFirestore<Mission>(
        COLLECTIONS.MISSIONS,
        { constraints, enabled }
    );

    const loadMore = async () => {
        if (!hasMore || loading) return;

        try {
            const { missions: newMissions, lastDoc: newLastDoc } = await MissionService.getMissions({
                status,
                level,
                proposerId,
                isVisible,
                limit: limitCount,
                lastDoc
            });

            if (newMissions.length < limitCount) {
                setHasMore(false);
            }

            setLastDoc(newLastDoc);
        } catch (err) {
            console.error('Error loading more missions:', err);
        }
    };

    return {
        missions,
        loading,
        error,
        refetch,
        loadMore,
        hasMore
    };
};

export const useAvailableMissions = (limitCount = 20) => {
    return useMissions({
        status: MissionStatus.ACTIVE,
        isVisible: true,
        limit: limitCount
    });
};

export const useUserMissions = (userId: string, limitCount = 20) => {
    return useMissions({
        proposerId: userId,
        limit: limitCount,
        enabled: !!userId
    });
};

export const useMissionById = (missionId: string | null) => {
    const [mission, setMission] = useState<Mission | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!missionId) {
            setMission(null);
            setLoading(false);
            return;
        }

        const fetchMission = async () => {
            try {
                setLoading(true);
                setError(null);
                const missionData = await MissionService.getMissionById(missionId);
                setMission(missionData);
            } catch (err: any) {
                console.error('Error fetching mission:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMission();
    }, [missionId]);

    return { mission, loading, error };
};
