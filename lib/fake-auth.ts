'use client';

export interface FakeUser {
    id: string;
    name: string;
    email: string;
    image: string;
}

const FAKE_USER: FakeUser = {
    id: '1',
    name: 'Eco Warrior',
    email: 'ecowarrior@ecoflow.app',
    image: '/icon.png',
};

const AUTH_KEY = 'ecoflow_auth';

export const fakeAuth = {
    // Connecter l'utilisateur
    signIn: (): Promise<{ success: boolean; user?: FakeUser }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.setItem(AUTH_KEY, JSON.stringify(FAKE_USER));
                resolve({ success: true, user: FAKE_USER });
            }, 1000); // Simule un délai de connexion
        });
    },

    // Déconnecter l'utilisateur
    signOut: (): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.removeItem(AUTH_KEY);
                resolve();
            }, 500);
        });
    },

    // Obtenir l'utilisateur actuel
    getCurrentUser: (): FakeUser | null => {
        if (typeof window === 'undefined') return null;

        const stored = localStorage.getItem(AUTH_KEY);
        if (!stored) return null;

        try {
            return JSON.parse(stored) as FakeUser;
        } catch {
            return null;
        }
    },

    // Vérifier si l'utilisateur est connecté
    isAuthenticated: (): boolean => {
        return fakeAuth.getCurrentUser() !== null;
    },
};
