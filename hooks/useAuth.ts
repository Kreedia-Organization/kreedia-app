"use client";

import { AuthService } from '@/lib/firebase/auth';
import { User } from '@/types/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UseAuthReturn {
    user: FirebaseUser | null;
    userData: User | null;
    loading: boolean;
    error: string | null;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    isAuthenticated: boolean;
    refreshUserData: () => Promise<void>;
    clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [authInitialized, setAuthInitialized] = useState(false);
    const router = useRouter();

    // Function to refresh user data
    const refreshUserData = async (): Promise<void> => {
        if (!user) return;

        try {
            const firestoreUserData = await AuthService.getCurrentUserData();
            setUserData(firestoreUserData);
            console.log('User data refreshed:', firestoreUserData);
        } catch (err) {
            console.error('Error refreshing user data:', err);
            setError('Error loading user data');
        }
    };

    // Function to clear errors
    const clearError = (): void => {
        setError(null);
    };

    useEffect(() => {
        let mounted = true;

        const unsubscribe = AuthService.onAuthStateChanged(async (firebaseUser) => {
            if (!mounted) return;

            console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
            setError(null);

            try {
                if (firebaseUser) {
                    console.log('User authenticated:', firebaseUser.uid);
                    setUser(firebaseUser);

                    // Get user data from Firestore
                    console.log('Fetching user data from Firestore...');
                    const firestoreUserData = await AuthService.getCurrentUserData();

                    if (mounted) {
                        setUserData(firestoreUserData);
                        console.log('Firestore data loaded:', firestoreUserData);

                        // Navigate to dashboard only if we're on sign-in page and auth is initialized
                        if (authInitialized && window.location.pathname === '/auth/signin') {
                            console.log('Redirecting to dashboard...');
                            router.push('/dashboard');
                        }
                    }
                } else {
                    console.log('User not authenticated');
                    setUser(null);
                    setUserData(null);

                    // Navigate to sign-in only if we're not already there and auth is initialized
                    if (authInitialized && window.location.pathname !== '/auth/signin') {
                        console.log('Redirecting to sign-in...');
                        router.push('/auth/signin');
                    }
                }
            } catch (err) {
                console.error('Error in auth state change:', err);
                if (mounted) {
                    setError('Error loading user data');
                    setUserData(null);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                    if (!authInitialized) {
                        setAuthInitialized(true);
                    }
                }
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, [authInitialized, router]);

    const signInWithGoogle = async (): Promise<void> => {
        try {
            setError(null);
            console.log('Starting Google sign-in...');

            // Check if we're on mobile for better UX
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            );

            if (isMobile) {
                await AuthService.signInWithGoogleRedirect();
            } else {
                await AuthService.signInWithGoogle();
                console.log('Google sign-in initiated');
                // Don't manually redirect here - let the auth state change handle it
            }
        } catch (err: any) {
            console.error('Sign-in error:', err);
            setError(err.message || 'Sign-in error');
            setLoading(false);
        }
    };

    const signOut = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            console.log('Starting sign-out...');
            await AuthService.signOut();
            console.log('Sign-out successful');

            // Clear local state immediately
            setUser(null);
            setUserData(null);

            // Redirect to sign-in page
            router.push('/auth/signin');
        } catch (err: any) {
            console.error('Sign-out error:', err);
            setError(err.message || 'Sign-out error');
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        userData,
        loading,
        error,
        signInWithGoogle,
        signOut,
        isAuthenticated: !!user,
        refreshUserData,
        clearError,
    };
};
