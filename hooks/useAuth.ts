"use client";

// Déclarer les types pour Google Identity Services
declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: any) => void;
                    prompt: (callback: (notification: any) => void) => void;
                };
            };
        };
    }
}

import { AuthService } from '@/lib/api/services/auth';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface User {
    id: number;
    uid: string;
    name: string;
    email: string;
    phone?: string | null;
    gender?: 'male' | 'female' | 'other' | null;
    wallet_address?: string | null;
    ens_name?: string | null;
    role: 'contributor' | 'ngo';
    created_at: string;
    updated_at: string;
}

interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
        token_type: string;
    };
}

interface ApiResponseType {
    user: User;
    token: string;
    token_type: string;
}

interface UseAuthReturn {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    loading: boolean; // Alias pour compatibilité
    error: string | null;
    signInWithGoogle: () => Promise<void>;
    signOut: () => void;
    refreshUserData: () => Promise<void>;
    clearError: () => void;
    isGoogleLoaded: boolean;
}

export const useAuth = (): UseAuthReturn => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
    const router = useRouter();

    // Charger les données depuis localStorage au montage
    useEffect(() => {
        const loadStoredData = () => {
            try {
                const storedUser = localStorage.getItem('user');
                const storedToken = localStorage.getItem('token');

                if (storedUser && storedToken) {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    setToken(storedToken);
                    console.log('✅ User data loaded from localStorage:', userData);
                    console.log('✅ Token loaded from localStorage:', storedToken);
                    console.log('✅ isAuthenticated will be:', !!(userData && storedToken));
                }
            } catch (err) {
                console.error('❌ Error loading stored data:', err);
                clearStoredData();
            }
        };

        loadStoredData();
    }, []);

    // Charger Google Identity Services
    useEffect(() => {
        const loadGoogleScript = () => {
            if (window.google) {
                setIsGoogleLoaded(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                setIsGoogleLoaded(true);
                console.log('✅ Google Identity Services loaded');
            };
            script.onerror = () => {
                setError('Failed to load Google Identity Services');
                console.error('❌ Failed to load Google Identity Services');
            };
            document.head.appendChild(script);
        };

        loadGoogleScript();
    }, []);

    const clearStoredData = useCallback(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    }, []);

    const clearError = useCallback((): void => {
        setError(null);
    }, []);

    const refreshUserData = useCallback(async (): Promise<void> => {
        if (!token) return;

        try {
            setIsLoading(true);
            const response = await AuthService.getCurrentUser();

            if (response.success) {
                const userData = response.data;
                setUser(userData as User);
                localStorage.setItem('user', JSON.stringify(userData));
                console.log('✅ User data refreshed:', userData);
            }
        } catch (err: any) {
            console.error('❌ Error refreshing user data:', err);
            if (err.status === 401) {
                // Token expiré, déconnecter l'utilisateur
                signOut();
            }
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const signInWithGoogle = useCallback(async (): Promise<void> => {
        if (!isGoogleLoaded) {
            setError('Google Identity Services not loaded yet');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // Utiliser Google Identity Services pour l'authentification
            const response = await new Promise<any>((resolve, reject) => {
                window.google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id',
                    callback: (response: any) => {
                        try {
                            // Décoder le JWT token
                            const payload = JSON.parse(atob(response.credential.split('.')[1]));
                            resolve(payload);
                        } catch (err) {
                            reject(new Error('Failed to decode Google token'));
                        }
                    }
                });

                window.google.accounts.id.prompt((notification: any) => {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        reject(new Error('Google sign-in was cancelled or blocked'));
                    }
                });
            });

            console.log('✅ Google Auth successful:', response);

            // Envoyer les données à l'API Laravel
            const contributorData = {
                name: response.name,
                email: response.email,
            };

            console.log('📤 Sending contributor data to API:', contributorData);
            const apiResponse = await AuthService.loginContributor(contributorData) as unknown as ApiResponseType;
            console.log('📥 API Response:', apiResponse);

            // Le client API retourne seulement data si success=true, sinon data complet
            // Donc apiResponse contient directement { user, token, token_type }
            if (apiResponse && apiResponse.user && apiResponse.token) {
                const { user: userData, token: userToken } = apiResponse;

                // Stocker les données
                setUser(userData as User);
                setToken(userToken);
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('token', userToken);

                console.log('✅ User authenticated:', userData);
                console.log('✅ Token stored:', userToken);
                console.log('✅ localStorage user:', localStorage.getItem('user'));
                console.log('✅ localStorage token:', localStorage.getItem('token'));
                console.log('✅ isAuthenticated will be:', !!(userData && userToken));

                // Rediriger selon le rôle
                if (userData.role === 'contributor') {
                    router.push('/dashboard');
                } else if (userData.role === 'ngo') {
                    router.push('/ngo/dashboard');
                }
            } else {
                throw new Error('Authentication failed - invalid response format');
            }

        } catch (err: any) {
            console.error('❌ Google Auth error:', err);
            setError(err.message || 'Google authentication failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [isGoogleLoaded, router]);

    const signOut = useCallback(async (): Promise<void> => {
        try {
            setIsLoggingOut(true);
            setError(null);

            // Appeler l'API de déconnexion
            if (token) {
                console.log('🔄 Calling logout API...');
                await AuthService.logout();
                console.log('✅ Logout API successful');
            }
        } catch (err) {
            console.error('❌ Error during logout:', err);
            setError('Erreur lors de la déconnexion');
        } finally {
            // Nettoyer les données locales
            clearStoredData();
            setIsLoggingOut(false);

            // Rediriger vers la page de connexion
            router.push('/auth/signin');
        }
    }, [token, clearStoredData, router]);

    return {
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        loading: isLoading || isLoggingOut, // Alias pour compatibilité
        error,
        signInWithGoogle,
        signOut,
        refreshUserData,
        clearError,
        isGoogleLoaded,
    };
};