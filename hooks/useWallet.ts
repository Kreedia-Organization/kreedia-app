"use client";

import { UserService } from '@/lib/firebase/services/users';
import { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useAuth } from './useAuth';

export const useWallet = () => {
    const { address, isConnected, isConnecting } = useAccount();
    const { disconnect } = useDisconnect();
    const { user, userData, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Synchroniser l'adresse wallet avec Firestore quand elle change
    useEffect(() => {
        const updateWalletAddress = async () => {
            if (!user || !address || authLoading) return;

            // Si l'adresse wallet a changé
            if (userData?.walletAddress !== address) {
                setLoading(true);
                setError(null);

                try {
                    console.log('🔗 Updating wallet address in Firestore:', address);

                    await UserService.updateUser(user.uid, {
                        walletAddress: address,
                        updatedAt: new Date(),
                    });

                    console.log('✅ Wallet address updated successfully');
                } catch (err) {
                    console.error('❌ Error updating wallet address:', err);
                    setError('Failed to update wallet address');
                } finally {
                    setLoading(false);
                }
            }
        };

        updateWalletAddress();
    }, [address, user, userData?.walletAddress, authLoading]);

    const disconnectWallet = async () => {
        try {
            setLoading(true);
            setError(null);

            // Déconnecter le wallet
            disconnect();

            // Supprimer l'adresse wallet de Firestore
            if (user) {
                await UserService.updateUser(user.uid, {
                    walletAddress: null,
                    updatedAt: new Date(),
                });

                console.log('✅ Wallet disconnected and removed from Firestore');
            }
        } catch (err) {
            console.error('❌ Error disconnecting wallet:', err);
            setError('Failed to disconnect wallet');
        } finally {
            setLoading(false);
        }
    };

    return {
        // État du wallet
        address,
        isConnected,
        isConnecting,

        // État de synchronisation
        loading: loading || authLoading,
        error,

        // Données utilisateur
        userData,
        hasWalletInFirestore: !!userData?.walletAddress,

        // Actions
        disconnectWallet,
    };
};
