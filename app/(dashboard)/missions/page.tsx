"use client";

import MissionCard from "@/components/MissionCard";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { useUserLocationSubmissions } from "@/hooks/useLocationSubmissions";
import { useMissions } from "@/hooks/useMissions";
import { MissionLevel, MissionStatus } from "@/types/firebase";
import {
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  MapPin,
  Plus,
  Search,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const MissionsPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "available" | "in-progress" | "completed" | "my-submissions"
  >("available");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    MissionLevel | "all"
  >("all");

  // Get missions from Firebase
  const { missions: availableMissions, loading: missionsLoading } = useMissions(
    {
      status: activeTab === "available" ? MissionStatus.ACTIVE : undefined,
      level: selectedDifficulty !== "all" ? selectedDifficulty : undefined,
      enabled: activeTab !== "my-submissions",
    }
  );

  // Get user's location submissions
  const {
    submissions: userSubmissions,
    loading: submissionsLoading,
    stats: submissionStats,
  } = useUserLocationSubmissions(user?.uid || "");

  // Filter missions by search term
  const filteredMissions = availableMissions.filter((mission) => {
    if (!searchTerm) return true;

    return (
      mission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Utility functions for location status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs">
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs">
            Under Review
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 text-xs">
            Unknown
          </Badge>
        );
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const tabs = [
    {
      key: "available",
      label: "Available",
      count: filteredMissions.length,
    },
    {
      key: "in-progress",
      label: "In Progress",
      count: 0, // Will be implemented with mission_users collection
    },
    {
      key: "completed",
      label: "Completed",
      count: 0, // Will be implemented with mission_users collection
    },
    {
      key: "my-submissions",
      label: "My Submissions",
      count: userSubmissions.length,
    },
  ];

  const handleStartMission = (missionId: string) => {
    console.log("Starting mission:", missionId);
    // Here you would typically update the mission status
  };

  const handleViewMission = (missionId: string) => {
    console.log("Viewing mission:", missionId);
    // Navigate to mission details
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Missions</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Contribuez au nettoyage environnemental et gagnez des récompenses
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => router.push("/missions/create")}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Créer une mission</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/add-location")}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Location</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Find Nearby</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <Award className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Missions
                </p>
                <p className="text-xl font-bold text-foreground">
                  {availableMissions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completed
                </p>
                <p className="text-xl font-bold text-foreground">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Locations
                </p>
                <p className="text-xl font-bold text-foreground">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Rewards
                </p>
                <p className="text-xl font-bold text-foreground">1.45 ETH</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search missions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedDifficulty}
                onChange={(e) =>
                  setSelectedDifficulty(e.target.value as MissionLevel | "all")
                }
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Difficulties</option>
                <option value={MissionLevel.EASY}>Easy</option>
                <option value={MissionLevel.MEDIUM}>Medium</option>
                <option value={MissionLevel.HIGH}>High</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mission Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <span>{tab.label}</span>
              <Badge variant="secondary" className="text-xs">
                {tab.count}
              </Badge>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      {activeTab === "my-submissions" ? (
        /* My Submissions Section */
        <div className="space-y-4">
          {/* Submissions Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                My Submitted Locations
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track the status of your location submissions
              </p>
            </div>
            <Button
              onClick={() => router.push("/my-locations")}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>View All Details</span>
            </Button>
          </div>

          {/* Submissions Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Submitted
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {submissionStats.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Approved
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {submissionStats.approved}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pending
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {submissionStats.pending}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loading State */}
          {submissionsLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">
                Loading submissions...
              </p>
            </div>
          )}

          {/* Submissions List */}
          {!submissionsLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {userSubmissions.map((location) => (
                <Card
                  key={location.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <img
                        src={location.image}
                        alt={location.neighborhood}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-foreground truncate">
                              {location.neighborhood}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {location.address.length > 35
                                ? `${location.address.substring(0, 35)}...`
                                : location.address}
                            </p>
                          </div>
                          {getStatusBadge(location.status)}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            {getStatusIcon(location.status)}
                            <span>
                              Submitted{" "}
                              {formatDate(location.submittedAt.toDate())}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/my-locations")}
                            className="h-6 px-2 text-xs"
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State for Submissions */}
          {userSubmissions.length === 0 && !submissionsLoading && (
            <Card>
              <CardContent className="p-12 text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No Locations Submitted
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start by adding your first location for environmental cleanup
                </p>
                <Button onClick={() => router.push("/add-location")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Location
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Mission Grid */
        <div>
          {/* Loading State for Missions */}
          {missionsLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading missions...</p>
            </div>
          )}

          {/* Mission Grid */}
          {!missionsLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMissions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onStart={
                    activeTab === "available" ? handleStartMission : undefined
                  }
                  onView={handleViewMission}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State for Missions */}
      {activeTab !== "my-submissions" &&
        filteredMissions.length === 0 &&
        !missionsLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No missions found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDifficulty("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
    </div>
  );
};

export default MissionsPage;
