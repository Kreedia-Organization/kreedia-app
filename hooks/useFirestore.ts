"use client";

import { db } from '@/lib/firebase/config';
import {
    collection,
    DocumentData,
    onSnapshot,
    query,
    Query,
    QueryConstraint,
    Unsubscribe
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface UseFirestoreOptions {
    constraints?: QueryConstraint[];
    enabled?: boolean;
}

interface UseFirestoreReturn<T> {
    data: T[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

/**
 * Hook for real-time Firestore data fetching
 */
export const useFirestore = <T extends DocumentData>(
    collectionName: string,
    options: UseFirestoreOptions = {}
): UseFirestoreReturn<T> => {
    const { constraints = [], enabled = true } = options;

    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    useEffect(() => {
        if (!enabled) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        let unsubscribe: Unsubscribe;

        try {
            const collectionRef = collection(db, collectionName);
            const q: Query<DocumentData> = constraints.length > 0
                ? query(collectionRef, ...constraints)
                : collectionRef;

            unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const documents = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as unknown as T[];

                    setData(documents);
                    setLoading(false);
                },
                (err) => {
                    console.error(`Error fetching ${collectionName}:`, err);
                    setError(err.message);
                    setLoading(false);
                }
            );
        } catch (err: any) {
            console.error(`Error setting up ${collectionName} listener:`, err);
            setError(err.message);
            setLoading(false);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [collectionName, JSON.stringify(constraints), enabled, refetchTrigger]);

    const refetch = () => {
        setRefetchTrigger(prev => prev + 1);
    };

    return { data, loading, error, refetch };
};

/**
 * Hook for fetching Firestore document by ID
 */
export const useFirestoreDoc = <T extends DocumentData>(
    collectionName: string,
    docId: string | null,
    options: { enabled?: boolean } = {}
): UseFirestoreReturn<T> & { document: T | null } => {
    const { enabled = true } = options;

    const [document, setDocument] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    useEffect(() => {
        if (!enabled || !docId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        let unsubscribe: Unsubscribe;

        try {
            const docRef = collection(db, collectionName);
            const q = query(docRef);

            unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const doc = snapshot.docs.find(d => d.id === docId);
                    if (doc) {
                        setDocument({
                            id: doc.id,
                            ...doc.data()
                        } as unknown as T);
                    } else {
                        setDocument(null);
                    }
                    setLoading(false);
                },
                (err) => {
                    console.error(`Error fetching document ${docId}:`, err);
                    setError(err.message);
                    setLoading(false);
                }
            );
        } catch (err: any) {
            console.error(`Error setting up document listener:`, err);
            setError(err.message);
            setLoading(false);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [collectionName, docId, enabled, refetchTrigger]);

    const refetch = () => {
        setRefetchTrigger(prev => prev + 1);
    };

    return {
        data: document ? [document] : [],
        document,
        loading,
        error,
        refetch
    };
};
