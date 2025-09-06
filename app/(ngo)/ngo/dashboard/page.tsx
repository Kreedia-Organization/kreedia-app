"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { useApiAuth } from "@/hooks/useApiAuth";
import { useNgoMissions } from "@/hooks/useApiMissions";
import { useApiNotifications } from "@/hooks/useApiNotifications";
import {
  Award,
  Bell,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Users,
} from "lucide-react";
import React from "react";

const NgoDashboardPage: React.FC = () => {
  const { user } = useApiAuth();
  const { missions, loading: missionsLoading } = useNgoMissions();
  const { unreadCount } = useApiNotifications();

  // Calculs des statistiques
  const pendingMissions = missions.filter((m) => m.status === "pending").length;
  const acceptedMissions = missions.filter(
    (m) => m.status === "accepted"
  ).length;
  const completedMissions = missions.filter(
    (m) => m.status === "completed"
  ).length;
  const rewardedMissions = missions.filter(
    (m) => m.status === "rewarded"
  ).length;

  const totalRewardsGiven = missions
    .filter((m) => m.status === "rewarded" && m.reward_amount)
    .reduce((sum, m) => sum + (m.reward_amount || 0), 0);

  const recentMissions = missions
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900";
      case "accepted":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900";
      case "completed":
        return "text-green-600 bg-green-100 dark:bg-green-900";
      case "rewarded":
        return "text-purple-600 bg-purple-100 dark:bg-purple-900";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "accepted":
        return "Acceptée";
      case "completed":
        return "Terminée";
      case "rewarded":
        return "Récompensée";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Tableau de bord NGO
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenue, {user?.name}. Gérez vos missions environnementales.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Missions en attente
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {pendingMissions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Missions acceptées
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {acceptedMissions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Missions terminées
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {completedMissions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Récompenses distribuées
                </p>
                <p className="text-2xl font-bold text-foreground">
                  ${totalRewardsGiven}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Missions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Actions rapides
            </h3>
            <div className="space-y-3">
              <a
                href="/ngo/missions?status=pending"
                className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors"
              >
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-yellow-700 dark:text-yellow-300">
                  Examiner les missions en attente ({pendingMissions})
                </span>
              </a>

              <a
                href="/ngo/missions?status=completed"
                className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
              >
                <Award className="h-5 w-5 text-green-600" />
                <span className="text-green-700 dark:text-green-300">
                  Récompenser les missions terminées ({completedMissions})
                </span>
              </a>

              <a
                href="/ngo/notifications"
                className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                <Bell className="h-5 w-5 text-blue-600" />
                <span className="text-blue-700 dark:text-blue-300">
                  Voir les notifications ({unreadCount})
                </span>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Recent Missions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Missions récentes
            </h3>

            {missionsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentMissions.length > 0 ? (
              <div className="space-y-4">
                {recentMissions.map((mission) => (
                  <div
                    key={mission.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {mission.title}
                      </p>
                      <p className="text-xs text-gray-500">{mission.address}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            mission.status
                          )}`}
                        >
                          {getStatusLabel(mission.status)}
                        </span>
                        {mission.reward_amount && (
                          <span className="text-xs text-gray-500">
                            ${mission.reward_amount} {mission.reward_currency}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Aucune mission récente
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Aperçu des performances
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {missions.length}
              </div>
              <div className="text-sm text-gray-500">Total missions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {rewardedMissions}
              </div>
              <div className="text-sm text-gray-500">Missions récompensées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${totalRewardsGiven}
              </div>
              <div className="text-sm text-gray-500">Total distribué</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {missions.length > 0
                  ? Math.round((rewardedMissions / missions.length) * 100)
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-500">Taux de completion</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NgoDashboardPage;
