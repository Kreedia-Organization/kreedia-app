"use client";

import CryptoBalanceCard from "@/components/CryptoBalanceCard";
import MissionCard from "@/components/MissionCard";
import ProgressChart from "@/components/ProgressChart";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import WeeklyStats from "@/components/WeeklyStats";
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
          <h1 className="text-3xl text-foreground">Welcome back!</h1>
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

      {/* Crypto Balances */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Your crypto & NFT wallet
        </h2>
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
          {/* Carte NFT ajoutée à la suite des cryptos */}
          {/* <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                NFT Collection
              </CardTitle>
              <Award className="h-4 w-4 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-lg">{mockUserStats.nftCount}</div>
              <p className="text-blue-100 text-sm mb-2">
                Unique environmental NFTs
              </p>
            </CardContent>
          </Card> */}
          <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] bg-blue-700">
            <CardContent className="p-3">
              <div className="flex items-center space-x-4">
                {/* Informations de la crypto */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h3 className="text-sm text-foreground">
                        NFT collection
                      </h3>
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="mt-2">
                    <p className="text-xl text-foreground font-semibold">6</p>
                  </div>
                  <p className="text-xs">Your environnement NFT collection</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
