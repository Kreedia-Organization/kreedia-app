"use client";

import { useWallet } from "@/hooks/useWallet";
import { useEffect, useState } from "react";

interface TokenBalance {
    symbol: string;
    balance: string;
    decimals: number;
    contractAddress: string;
}

interface WalletBalances {
    USDC: TokenBalance | null;
    USDT: TokenBalance | null;
    DAI: TokenBalance | null;
    NFT: {
        count: number;
        collections: string[];
    } | null;
    loading: boolean;
    error: string | null;
}

// Token contract addresses (mainnet)
const TOKEN_CONTRACTS = {
    USDC: "0xA0b86a33E6441b8C4C8C0C4C8C0C4C8C0C4C8C0C", // Replace with actual USDC contract
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Replace with actual USDT contract
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // Replace with actual DAI contract
};

export const useWalletBalances = (): WalletBalances => {
    const { address, isConnected } = useWallet();
    const [balances, setBalances] = useState<WalletBalances>({
        USDC: null,
        USDT: null,
        DAI: null,
        NFT: null,
        loading: false,
        error: null,
    });

    useEffect(() => {
        const fetchBalances = async () => {
            if (!address || !isConnected) {
                setBalances({
                    USDC: null,
                    USDT: null,
                    DAI: null,
                    NFT: null,
                    loading: false,
                    error: null,
                });
                return;
            }

            setBalances(prev => ({ ...prev, loading: true, error: null }));

            try {
                // Mock balances for now - replace with actual blockchain calls
                const mockBalances: WalletBalances = {
                    USDC: {
                        symbol: "USDC",
                        balance: "1250.50",
                        decimals: 6,
                        contractAddress: TOKEN_CONTRACTS.USDC,
                    },
                    USDT: {
                        symbol: "USDT",
                        balance: "890.25",
                        decimals: 6,
                        contractAddress: TOKEN_CONTRACTS.USDT,
                    },
                    DAI: {
                        symbol: "DAI",
                        balance: "2100.75",
                        decimals: 18,
                        contractAddress: TOKEN_CONTRACTS.DAI,
                    },
                    NFT: {
                        count: 12,
                        collections: ["Kreedia Impact", "Eco Warriors", "Green Heroes"],
                    },
                    loading: false,
                    error: null,
                };

                setBalances(mockBalances);
                console.log("✅ Wallet balances loaded:", mockBalances);

            } catch (error: any) {
                console.error("❌ Error fetching wallet balances:", error);
                setBalances(prev => ({
                    ...prev,
                    loading: false,
                    error: error.message || "Failed to fetch balances",
                }));
            }
        };

        fetchBalances();
    }, [address, isConnected]);

    return balances;
};
