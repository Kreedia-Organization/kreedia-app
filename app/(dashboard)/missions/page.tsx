"use client";

import MissionCard from "@/components/MissionCard";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { completedMissions, mockMissions } from "@/lib/data";
import { Award, Calendar, Filter, MapPin, Search } from "lucide-react";
import React, { useState } from "react";

const MissionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "available" | "in-progress" | "completed"
  >("available");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const filterMissions = (missions: typeof mockMissions) => {
    return missions.filter((mission) => {
      const matchesSearch =
        mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDifficulty =
        selectedDifficulty === "all" ||
        mission.difficulty === selectedDifficulty;

      return matchesSearch && matchesDifficulty;
    });
  };

  const getFilteredMissions = () => {
    const statusFilter =
      activeTab === "available"
        ? "Available"
        : activeTab === "in-progress"
        ? "In Progress"
        : "Completed";

    const filteredByStatus = mockMissions.filter(
      (mission) => mission.status === statusFilter
    );
    return filterMissions(filteredByStatus);
  };

  const filteredMissions = getFilteredMissions();

  const tabs = [
    {
      key: "available",
      label: "Available",
      count: mockMissions.filter((m) => m.status === "Available").length,
    },
    {
      key: "in-progress",
      label: "In Progress",
      count: mockMissions.filter((m) => m.status === "In Progress").length,
    },
    { key: "completed", label: "Completed", count: completedMissions.length },
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
            Make a positive environmental impact and earn rewards
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <MapPin className="h-4 w-4" />
          <span>Find Nearby</span>
        </Button>
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
                  {mockMissions.length}
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
                <p className="text-xl font-bold text-foreground">
                  {completedMissions.length}
                </p>
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
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
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

      {/* Mission Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMissions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onStart={activeTab === "available" ? handleStartMission : undefined}
            onView={handleViewMission}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredMissions.length === 0 && (
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
