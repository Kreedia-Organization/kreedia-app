"use client";

import { AuthService } from '@/lib/api/services/auth';
import { auth } from '@/lib/firebase/config';
import { User } from '@/types/api';
import { signOut as firebaseSignOut, User as FirebaseUser, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UseApiAuthReturn {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    error: string | null;
    signInWithGoogle: () => Promise<void>;
    signInAsNgo: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    isAuthenticated: boolean;
    refreshUserData: () => Promise<void>;
    clearError: () => void;
    setUser: (user: User | null) => void;
    forceRefreshUserData: () => Promise<void>;
}

export const useApiAuth = (): UseApiAuthReturn => {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [authInitialized, setAuthInitialized] = useState(false);
    const router = useRouter();

    // Function to refresh user data from API
    const refreshUserData = async (): Promise<void> => {
        const token = AuthService.getStoredToken();
        if (!token) {
            console.log('⚠️ No token found, skipping user data refresh');
            return;
        }

        try {
            console.log('🔄 Refreshing user data from /auth/me...');
            const userData = await AuthService.getCurrentUser();
            setUser(userData);
            console.log('✅ User data refreshed successfully:', userData);
        } catch (err: any) {
            console.error('❌ Error refreshing user data:', err);
            if (err.status === 401) {
                // Token expiré, déconnecter l'utilisateur
                console.log('🔒 Token expired, signing out user');
                await signOut();
            } else {
                setError('Error loading user data');
            }
        }
    };

    // Function to clear error
    const clearError = (): void => {
        setError(null);
    };

    // Function to force refresh user data (useful for manual refresh)
    const forceRefreshUserData = async (): Promise<void> => {
        setLoading(true);
        try {
            await refreshUserData();
        } finally {
            setLoading(false);
        }
    };

    // Function to sign in with Google (Contributor) - Popup version
    const signInWithGoogle = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const provider = new GoogleAuthProvider();

            // Add scopes for better user experience
            provider.addScope('email');
            provider.addScope('profile');

            const result = await signInWithPopup(auth, provider);

            const contributorData = {
                name: result.user.displayName || '',
                email: result.user.email || '',
            };

            console.log('✅ Google Auth successful:', contributorData);

            // Send to API endpoint /auth/contributor/login
            const response = await AuthService.loginContributor(contributorData);

            // Store token and user data locally
            AuthService.setAuthToken(response.token);
            setUser(response.user);
            setFirebaseUser(result.user);

            console.log('✅ Contributor authenticated via API:', response.user);

            // Redirect to dashboard after successful authentication
            router.push('/dashboard');

        } catch (err: any) {
            console.error('❌ Google Auth error:', err);

            // Handle specific popup errors
            if (err.code === 'auth/popup-blocked') {
                setError('Popup blocked by browser. Please allow popups for this site and try again.');
            } else if (err.code === 'auth/popup-closed-by-user') {
                setError('Sign-in was cancelled. Please try again.');
            } else if (err.code === 'auth/network-request-failed') {
                setError('Network error. Please check your internet connection and try again.');
            } else {
                setError(err.message || 'Google authentication failed');
            }

            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to sign in as NGO
    const signInAsNgo = async (email: string, password: string): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔐 NGO login attempt:', { email });

            // Send to API endpoint /auth/ngo/login
            const response = await AuthService.loginNgo({ email, password });

            // Store token and user data locally
            AuthService.setAuthToken(response.token);
            setUser(response.user);

            console.log('✅ NGO authenticated via API:', response.user);

        } catch (err: any) {
            console.error('❌ NGO login error:', err);
            setError(err.message || 'NGO authentication failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Function to sign out
    const signOut = async (): Promise<void> => {
        try {
            setLoading(true);

            // Sign out from Firebase if user is signed in
            if (firebaseUser) {
                await firebaseSignOut(auth);
            }

            // Clear local storage and state
            AuthService.clearAuthToken();
            setUser(null);
            setFirebaseUser(null);

            console.log('✅ User signed out successfully');

        } catch (err: any) {
            console.error('❌ Sign out error:', err);
            setError('Error during sign out');
        } finally {
            setLoading(false);
        }
    };

    // Initialize authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setFirebaseUser(firebaseUser);

            if (firebaseUser) {
                // User is signed in to Firebase
                console.log('🔥 Firebase user signed in:', firebaseUser.uid);

                // Check if we have API user data
                const token = AuthService.getStoredToken();
                if (token) {
                    try {
                        const userData = await AuthService.getCurrentUser();
                        setUser(userData);
                        console.log('✅ API user data loaded:', userData);
                    } catch (err) {
                        console.error('❌ Error loading API user data:', err);
                        // If API token is invalid, sign out from Firebase
                        await firebaseSignOut(auth);
                    }
                }
            } else {
                // User is signed out from Firebase
                console.log('🔥 Firebase user signed out');
                setUser(null);
                AuthService.clearAuthToken();
            }

            setAuthInitialized(true);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Auto-refresh user data when component mounts or page reloads
    useEffect(() => {
        const initializeUserData = async () => {
            if (authInitialized) {
                const token = AuthService.getStoredToken();
                if (token) {
                    try {
                        // Always call /auth/me on page load to get fresh user data
                        const userData = await AuthService.getCurrentUser();
                        setUser(userData);
                        console.log('✅ User data refreshed on page load:', userData);
                    } catch (err: any) {
                        console.error('❌ Error refreshing user data on page load:', err);
                        if (err.status === 401) {
                            // Token expiré, déconnecter l'utilisateur
                            await signOut();
                        }
                    }
                } else {
                    setUser(null);
                }
            }
        };

        initializeUserData();
    }, [authInitialized]);

    return {
        user,
        firebaseUser,
        loading,
        error,
        signInWithGoogle,
        signInAsNgo,
        signOut,
        isAuthenticated: !!user,
        refreshUserData,
        clearError,
        setUser,
        forceRefreshUserData,
    };
};