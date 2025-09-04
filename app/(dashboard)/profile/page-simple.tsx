"use client";

import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { mockNFTs, mockUserStats } from "@/lib/data";
import { useFakeAuth } from "@/lib/use-fake-auth";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Award,
  Calendar,
  Download,
  LogOut,
  Mail,
  Settings,
  Share2,
  TrendingUp,
  User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const SimpleProfilePage: React.FC = () => {
  const { user, signOut } = useFakeAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/signin");
  };

  const achievements = [
    {
      name: "First Cleanup",
      description: "Completed your first environmental mission",
      earned: true,
    },
    { name: "Eco Warrior", description: "Completed 10 missions", earned: true },
    {
      name: "Beach Guardian",
      description: "Completed 5 beach cleanups",
      earned: true,
    },
    { name: "City Hero", description: "Cleaned 3 urban areas", earned: true },
    { name: "NFT Collector", description: "Earned 5 NFTs", earned: true },
    {
      name: "Master Cleaner",
      description: "Completed 25 missions",
      earned: false,
    },
    {
      name: "Legendary Contributor",
      description: "Earned a Legendary NFT",
      earned: true,
    },
    {
      name: "Community Leader",
      description: "Referred 10 friends",
      earned: false,
    },
  ];

  const recentActivity = [
    {
      date: new Date("2024-03-15"),
      action: "Completed Central Park cleanup",
      reward: "0.15 ETH",
    },
    {
      date: new Date("2024-03-12"),
      action: "Earned Beach Guardian NFT",
      reward: "NFT",
    },
    {
      date: new Date("2024-03-10"),
      action: "Started River cleanup mission",
      reward: "-",
    },
    {
      date: new Date("2024-03-08"),
      action: "Completed Urban Garden restoration",
      reward: "0.12 ETH",
    },
    {
      date: new Date("2024-03-05"),
      action: "Earned Legendary River Protector NFT",
      reward: "NFT",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your environmental impact and achievements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Profile
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-primary-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                )}
              </div>
              <CardTitle className="text-xl">
                {user?.name || "Eco Warrior"}
              </CardTitle>
              <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{user?.email}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Member since
                </span>
                <span className="font-medium">March 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Eco Level
                </span>
                <Badge className="bg-primary-500 text-white">Level 12</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Earnings
                </span>
                <span className="font-bold text-primary-600">
                  {formatCurrency(mockUserStats.totalBalance)}
                </span>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Impact Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary-500" />
                <span>Environmental Impact</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {mockUserStats.missionsCompleted}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Missions Completed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {mockUserStats.areasImpacted}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Areas Cleaned
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {mockUserStats.photosSubmitted}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Photos Submitted
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {mockNFTs.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    NFTs Earned
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg border ${
                      achievement.earned
                        ? "bg-primary-50 border-primary-200 dark:bg-primary-950 dark:border-primary-800"
                        : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        achievement.earned
                          ? "bg-primary-500 text-white"
                          : "bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                      }`}
                    >
                      <Award className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div
                        className={`font-medium ${
                          achievement.earned
                            ? "text-foreground"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {achievement.name}
                      </div>
                      <div
                        className={`text-xs ${
                          achievement.earned
                            ? "text-gray-600 dark:text-gray-400"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <div>
                        <div className="font-medium text-foreground">
                          {activity.action}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(activity.date)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-medium ${
                          activity.reward === "NFT"
                            ? "text-purple-600"
                            : activity.reward === "-"
                            ? "text-gray-500"
                            : "text-primary-600"
                        }`}
                      >
                        {activity.reward}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimpleProfilePage;
