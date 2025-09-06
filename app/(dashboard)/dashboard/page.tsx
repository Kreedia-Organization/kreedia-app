"use client";

import MissionCard from "@/components/MissionCard";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import WalletConnectPrompt from "@/components/WalletConnectPrompt";
import { useApiAuth } from "@/hooks/useApiAuth";
import { useAvailableMissions, useUserMissions } from "@/hooks/useApiMissions";
import { useWallet } from "@/hooks/useWallet";
import { useWalletBalances } from "@/hooks/useWalletBalances";
import { UserService } from "@/lib/api/services/user";
import {
  ArrowUp,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Coins,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const { user, setUser, forceRefreshUserData } = useApiAuth();

  // Load user missions
  const { missions: userMissions, loading: userMissionsLoading } =
    useUserMissions({ per_page: 10 });

  // Load available missions
  const { missions: availableMissions, loading: availableMissionsLoading } =
    useAvailableMissions({ per_page: 6 });

  // Load wallet balances
  const {
    USDC,
    USDT,
    DAI,
    NFT,
    loading: balancesLoading,
  } = useWalletBalances();

  // Update user profile with wallet address when wallet connects
  useEffect(() => {
    const updateUserWallet = async () => {
      if (address && user && user.wallet_address !== address) {
        try {
          console.log("Updating user wallet address:", address);
          const updatedUser = await UserService.updateProfile({
            wallet_address: address,
          });
          setUser(updatedUser);
          console.log("✅ User wallet address updated:", updatedUser);
        } catch (error) {
          console.error("❌ Error updating wallet address:", error);
        }
      }
    };

    updateUserWallet();
  }, [address, user, setUser]);

  const handleStartMission = (missionId: string) => {
    console.log("Starting mission:", missionId);
    // TODO: Implement mission start logic
  };

  const handleViewMission = (missionId: string) => {
    router.push(`/missions/${missionId}`);
  };

  // Calculate statistics
  const pendingMissions = (userMissions || []).filter(
    (m) => m.status === "pending"
  ).length;
  const acceptedMissions = (userMissions || []).filter(
    (m) => m.status === "accepted"
  ).length;
  const ongoingMissions = (userMissions || []).filter(
    (m) => m.status === "ongoing"
  ).length;
  const completedMissions = (userMissions || []).filter(
    (m) => m.status === "completed"
  ).length;
  const rewardedMissions = (userMissions || []).filter(
    (m) => m.status === "rewarded"
  ).length;
  const rejectedMissions = (userMissions || []).filter(
    (m) => m.status === "rejected"
  ).length;
  const cancelledMissions = (userMissions || []).filter(
    (m) => m.status === "cancelled"
  ).length;
  const totalEarnings = (userMissions || [])
    .filter((m) => m.status === "rewarded" && m.reward_amount)
    .reduce((sum, m) => sum + (m.reward_amount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome{user?.name ? `, ${user.name}` : ""}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ready to make a positive impact today?
          </p>
        </div>
        <Button
          onClick={() => router.push("/missions/create")}
          className="flex items-center space-x-2"
        >
          <Award className="h-4 w-4" />
          <span>Propose a Mission</span>
        </Button>
      </div>

      {/* Wallet Balances */}
      {!isConnected ? (
        <WalletConnectPrompt />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* USDC Balance */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Coins className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    USDC Balance
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {balancesLoading ? "..." : USDC?.balance || "0.00"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* USDT Balance */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Coins className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    USDT Balance
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {balancesLoading ? "..." : USDT?.balance || "0.00"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DAI Balance */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <Coins className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    DAI Balance
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {balancesLoading ? "..." : DAI?.balance || "0.00"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NFT Count */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    NFT Count
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {balancesLoading ? "..." : NFT?.count || "0"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Missions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>My Missions</span>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/missions/my-missions")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {userMissionsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (userMissions?.length || 0) > 0 ? (
              <div className="space-y-4">
                {(userMissions || []).slice(0, 3).map((mission) => (
                  <div
                    key={mission.id}
                    className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <Award className="h-4 w-4 text-gray-500 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {mission.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {mission.address}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge
                          variant={
                            mission.status === "pending"
                              ? "secondary"
                              : mission.status === "accepted"
                              ? "default"
                              : mission.status === "ongoing"
                              ? "default"
                              : mission.status === "completed"
                              ? "default"
                              : mission.status === "rewarded"
                              ? "default"
                              : mission.status === "rejected"
                              ? "destructive"
                              : mission.status === "cancelled"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {mission.status === "pending" && "Pending"}
                          {mission.status === "accepted" && "Accepted"}
                          {mission.status === "ongoing" && "Ongoing"}
                          {mission.status === "completed" && "To Reward"}
                          {mission.status === "rewarded" && "Completed"}
                          {mission.status === "rejected" && "Rejected"}
                          {mission.status === "cancelled" && "Cancelled"}
                        </Badge>
                        {mission.reward_amount && (
                          <span className="text-xs text-green-600">
                            ${mission.reward_amount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500 mb-4">
                  You haven't proposed any missions yet
                </p>
                <Button onClick={() => router.push("/missions/create")}>
                  Propose a Mission
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Missions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Available Missions</span>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/missions")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {availableMissionsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (availableMissions?.length || 0) > 0 ? (
              <div className="space-y-4">
                {(availableMissions || []).slice(0, 3).map((mission) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    variant="compact"
                    showProposer={true}
                    onClick={() => handleViewMission(mission.uid)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500">
                  No missions available at the moment
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {(userMissions?.length || 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(userMissions || []).slice(0, 5).map((mission) => (
                <div
                  key={mission.id}
                  className="flex items-center space-x-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <div className="flex-shrink-0">
                    {mission.status === "pending" && (
                      <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-yellow-600" />
                      </div>
                    )}
                    {mission.status === "accepted" && (
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <ArrowUp className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    {mission.status === "ongoing" && (
                      <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-indigo-600" />
                      </div>
                    )}
                    {(mission.status === "completed" ||
                      mission.status === "rewarded") && (
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                    )}
                    {(mission.status === "rejected" ||
                      mission.status === "cancelled") && (
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-red-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {mission.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {mission.status === "pending" && "Mission proposed"}
                      {mission.status === "accepted" &&
                        "Mission accepted by an NGO"}
                      {mission.status === "ongoing" && "Mission in progress"}
                      {mission.status === "completed" &&
                        "Mission completed, awaiting reward"}
                      {mission.status === "rewarded" && "Mission rewarded"}
                      {mission.status === "rejected" && "Mission rejected"}
                      {mission.status === "cancelled" && "Mission cancelled"}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(mission.updated_at).toLocaleDateString("en-US")}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;
