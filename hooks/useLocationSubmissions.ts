"use client";

import { LocationSubmissionService } from '@/lib/firebase/services/locationSubmissions';
import { COLLECTIONS, LocationStatus, LocationSubmission } from '@/types/firebase';
import { limit, orderBy, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useFirestore } from './useFirestore';

interface UseLocationSubmissionsOptions {
    userId?: string;
    status?: LocationStatus;
    limit?: number;
    enabled?: boolean;
}

interface UseLocationSubmissionsReturn {
    submissions: LocationSubmission[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
    stats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    };
}

export const useLocationSubmissions = (
    options: UseLocationSubmissionsOptions = {}
): UseLocationSubmissionsReturn => {
    const {
        userId,
        status,
        limit: limitCount = 20,
        enabled = true
    } = options;

    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
    });

    // Build Firestore query constraints
    const constraints = [];

    if (userId) constraints.push(where('userId', '==', userId));
    if (status) constraints.push(where('status', '==', status));

    constraints.push(orderBy('submittedAt', 'desc'));
    constraints.push(limit(limitCount));

    const { data: submissions, loading, error, refetch } = useFirestore<LocationSubmission>(
        COLLECTIONS.LOCATION_SUBMISSIONS,
        { constraints, enabled }
    );

    // Calculate stats when submissions change
    useEffect(() => {
        if (submissions.length > 0) {
            const newStats = {
                total: submissions.length,
                pending: submissions.filter(s => s.status === LocationStatus.PENDING).length,
                approved: submissions.filter(s => s.status === LocationStatus.APPROVED).length,
                rejected: submissions.filter(s => s.status === LocationStatus.REJECTED).length,
            };
            setStats(newStats);
        }
    }, [submissions]);

    return {
        submissions,
        loading,
        error,
        refetch,
        stats
    };
};

export const useUserLocationSubmissions = (userId: string) => {
    return useLocationSubmissions({
        userId,
        enabled: !!userId
    });
};

export const usePendingLocationSubmissions = () => {
    return useLocationSubmissions({
        status: LocationStatus.PENDING
    });
};

export const useLocationSubmissionById = (submissionId: string | null) => {
    const [submission, setSubmission] = useState<LocationSubmission | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!submissionId) {
            setSubmission(null);
            setLoading(false);
            return;
        }

        const fetchSubmission = async () => {
            try {
                setLoading(true);
                setError(null);
                const submissionData = await LocationSubmissionService.getLocationSubmissionById(submissionId);
                setSubmission(submissionData);
            } catch (err: any) {
                console.error('Error fetching location submission:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmission();
    }, [submissionId]);

    return { submission, loading, error };
};

export const useLocationSubmissionStats = (userId?: string) => {
    const [stats, setStats] = useState({
        totalSubmissions: 0,
        pendingSubmissions: 0,
        approvedSubmissions: 0,
        rejectedSubmissions: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);

                const statsData = userId
                    ? await LocationSubmissionService.getUserLocationSubmissionStats(userId)
                    : await LocationSubmissionService.getLocationSubmissionStats();

                setStats(statsData);
            } catch (err: any) {
                console.error('Error fetching location submission stats:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [userId]);

    return { stats, loading, error };
};
