'use client';

import { useEffect, useState } from 'react';
import { fakeAuth, FakeUser } from './fake-auth';

export const useFakeAuth = () => {
    const [user, setUser] = useState<FakeUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Vérifier si l'utilisateur est déjà connecté au chargement
        const currentUser = fakeAuth.getCurrentUser();
        setUser(currentUser);
        setIsLoading(false);

        // Écouter les changements dans localStorage
        const handleStorageChange = () => {
            setUser(fakeAuth.getCurrentUser());
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('storage', handleStorageChange);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('storage', handleStorageChange);
            }
        };
    }, []);

    const signIn = async () => {
        setIsLoading(true);
        try {
            const result = await fakeAuth.signIn();
            if (result.success && result.user) {
                setUser(result.user);
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        setIsLoading(true);
        try {
            await fakeAuth.signOut();
            setUser(null);
        } catch (error) {
            console.error('Sign out error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signOut,
    };
};
