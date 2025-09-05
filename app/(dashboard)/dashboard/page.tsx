"use client";

import CryptoBalanceCard from "@/components/CryptoBalanceCard";
import MissionCard from "@/components/MissionCard";
import ProgressChart from "@/components/ProgressChart";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import WalletConnectPrompt from "@/components/WalletConnectPrompt";
import WeeklyStats from "@/components/WeeklyStats";
import { useWallet } from "@/hooks/useWallet";
import {
  availableMissions,
  cryptoBalances,
  inProgressMissions,
  mockUserStats,
} from "@/lib/data";
import { Award, Plus, Target, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const {
    hasWalletInFirestore,
    loading: walletLoading,
    address,
    userData,
  } = useWallet();

  const handleStartMission = (missionId: string) => {
    console.log("Starting mission:", missionId);
    // Here you would typically update the mission status
  };

  const handleViewMission = (missionId: string) => {
    router.push(`/missions/${missionId}`);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl text-foreground">Welcome back!</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ready to make a positive impact today?
          </p>
        </div>
        <Button
          onClick={() => router.push("/missions")}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Mission</span>
        </Button>
      </div>

      {/* Crypto Balances & Wallet Connection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Your crypto & NFT wallet
          </h2>

          {/* Wallet Status Indicator */}
          {address && (
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Wallet connected: {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
          )}
        </div>

        {/* Affichage conditionnel selon l'état du wallet */}
        {!hasWalletInFirestore ? (
          // Affichage flouté avec prompt de connexion wallet
          <WalletConnectPrompt />
        ) : (
          // Affichage normal des balances crypto
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {cryptoBalances.map((crypto, index) => (
              <CryptoBalanceCard
                key={index}
                symbol={crypto.symbol}
                name={crypto.name}
                balance={crypto.balance}
                logo={crypto.logo}
                change={crypto.change}
              />
            ))}

            {/* Carte NFT */}
            <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] bg-blue-700">
              <CardContent className="p-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <h3 className="text-sm text-foreground">
                          NFT collection
                        </h3>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xl text-foreground font-semibold">
                        {userData?.totalMissionsCompleted || 0}
                      </p>
                    </div>
                    <p className="text-xs">Your environment NFT collection</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading state */}
        {walletLoading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Synchronizing wallet...</span>
            </div>
          </div>
        )}
      </div>

      {/* Weekly Stats */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          This Week's Impact
        </h2>
        <WeeklyStats
          missionsCompleted={mockUserStats.missionsCompleted}
          areasImpacted={mockUserStats.areasImpacted}
          photosSubmitted={mockUserStats.photosSubmitted}
        />
      </div>

      {/* Progress Chart */}
      <ProgressChart />

      {/* Missions in Progress */}
      {inProgressMissions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Missions in Progress
            </h2>
            <Badge
              variant="outline"
              className="text-orange-600 border-orange-600"
            >
              {inProgressMissions.length} Active
            </Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {inProgressMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onView={handleViewMission}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available Missions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Available Missions
          </h2>
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="text-primary-600 border-primary-600"
            >
              {availableMissions.length} Available
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/missions")}
            >
              View All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {availableMissions.slice(0, 4).map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onStart={handleStartMission}
              onView={handleViewMission}
            />
          ))}
        </div>

        {availableMissions.length > 4 && (
          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={() => router.push("/missions")}
              className="flex items-center space-x-2"
            >
              <Target className="h-4 w-4" />
              <span>View {availableMissions.length - 4} More Missions</span>
            </Button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary-500" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => router.push("/missions")}
            >
              <Target className="h-6 w-6" />
              <span>Browse Missions</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => router.push("/nft")}
            >
              <Award className="h-6 w-6" />
              <span>View NFTs</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => router.push("/profile")}
            >
              <TrendingUp className="h-6 w-6" />
              <span>View Progress</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => router.push("/add-location")}
            >
              <Plus className="h-6 w-6" />
              <span>Add Location</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
