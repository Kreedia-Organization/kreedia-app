"use client";

import { db } from '@/lib/firebase/config';
import { NotificationService } from '@/lib/firebase/services/notifications';
import { COLLECTIONS, Notification } from '@/types/firebase';
import {
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
    Unsubscribe,
    where
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface UseNotificationsReturn {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    refreshNotifications: () => void;
}

export const useNotifications = (
    userId: string | null,
    limitCount: number = 10,
    realTime: boolean = true
): UseNotificationsReturn => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Function to refresh notifications manually
    const refreshNotifications = async () => {
        if (!userId) return;

        try {
            setLoading(true);
            setError(null);

            const notifs = await NotificationService.getUserNotifications(userId, limitCount);
            const unread = await NotificationService.getUnreadCount(userId);

            setNotifications(notifs);
            setUnreadCount(unread);
        } catch (err) {
            console.error('Error refreshing notifications:', err);
            setError(err instanceof Error ? err.message : 'Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    // Real-time notifications listener
    useEffect(() => {
        if (!userId) {
            setNotifications([]);
            setUnreadCount(0);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        let unsubscribeNotifications: Unsubscribe;
        let unsubscribeUnreadCount: Unsubscribe;

        if (realTime) {
            // Real-time notifications query
            const notificationsQuery = query(
                collection(db, COLLECTIONS.NOTIFICATIONS),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );

            // Real-time unread count query
            const unreadQuery = query(
                collection(db, COLLECTIONS.NOTIFICATIONS),
                where('userId', '==', userId),
                where('isRead', '==', false)
            );

            try {
                // Listen to notifications
                unsubscribeNotifications = onSnapshot(
                    notificationsQuery,
                    (snapshot) => {
                        const notifs: Notification[] = [];
                        snapshot.forEach((doc) => {
                            notifs.push({ id: doc.id, ...doc.data() } as Notification);
                        });

                        setNotifications(notifs);
                        setLoading(false);
                        console.log(`📬 Real-time notifications updated: ${notifs.length} notifications`);
                    },
                    (err) => {
                        console.error('Error in notifications listener:', err);
                        setError(err.message);
                        setLoading(false);
                    }
                );

                // Listen to unread count
                unsubscribeUnreadCount = onSnapshot(
                    unreadQuery,
                    (snapshot) => {
                        setUnreadCount(snapshot.size);
                        console.log(`🔔 Unread count updated: ${snapshot.size}`);
                    },
                    (err) => {
                        console.error('Error in unread count listener:', err);
                    }
                );

            } catch (err) {
                console.error('Error setting up notifications listeners:', err);
                setError(err instanceof Error ? err.message : 'Failed to setup listeners');
                setLoading(false);
            }
        } else {
            // One-time fetch
            refreshNotifications();
        }

        // Cleanup function
        return () => {
            if (unsubscribeNotifications) {
                unsubscribeNotifications();
            }
            if (unsubscribeUnreadCount) {
                unsubscribeUnreadCount();
            }
        };
    }, [userId, limitCount, realTime]);

    // Mark notification as read
    const markAsRead = async (notificationId: string): Promise<void> => {
        try {
            await NotificationService.markAsRead(notificationId);

            // Update local state optimistically
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId
                        ? { ...notif, isRead: true }
                        : notif
                )
            );

            // Update unread count
            setUnreadCount(prev => Math.max(0, prev - 1));

            console.log('✅ Notification marked as read locally');
        } catch (err) {
            console.error('Error marking notification as read:', err);
            throw err;
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async (): Promise<void> => {
        if (!userId) return;

        try {
            await NotificationService.markAllAsRead(userId);

            // Update local state optimistically
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, isRead: true }))
            );
            setUnreadCount(0);

            console.log('✅ All notifications marked as read locally');
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
            throw err;
        }
    };

    return {
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
    };
};
