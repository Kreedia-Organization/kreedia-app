"use client";

import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useApiAuth } from "@/hooks/useApiAuth";
import { useAvailableMissions, useUserMissions } from "@/hooks/useApiMissions";
import { useApiNotifications } from "@/hooks/useApiNotifications";
import { AuthService } from "@/lib/api/services/auth";
import { MissionService } from "@/lib/api/services/missions";
import { NotificationService } from "@/lib/api/services/notifications";
import {
  AlertCircle,
  ArrowUp,
  Award,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface TestResult {
  name: string;
  status: "success" | "error" | "loading";
  message: string;
  data?: any;
}

const TestApiPage: React.FC = () => {
  const { user, isAuthenticated } = useApiAuth();
  const {
    missions: userMissions,
    loading: userMissionsLoading,
    error: userMissionsError,
  } = useUserMissions({ per_page: 5 });
  const {
    missions: availableMissions,
    loading: availableMissionsLoading,
    error: availableMissionsError,
  } = useAvailableMissions({ per_page: 5 });
  const {
    notifications,
    unreadCount,
    loading: notificationsLoading,
    error: notificationsError,
  } = useApiNotifications({ per_page: 5 });

  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addTestResult = (result: TestResult) => {
    setTestResults((prev) => [...prev, result]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Configuration API
    addTestResult({
      name: "Configuration API",
      status: "loading",
      message: "Vérification de la configuration...",
    });

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      addTestResult({
        name: "Configuration API",
        status: "success",
        message: `API URL: ${apiUrl}`,
        data: { apiUrl },
      });
    } catch (error) {
      addTestResult({
        name: "Configuration API",
        status: "error",
        message: "Configuration API manquante",
      });
    }

    // Test 2: Authentification
    addTestResult({
      name: "Authentification",
      status: "loading",
      message: "Test de l'authentification...",
    });

    try {
      if (isAuthenticated && user) {
        addTestResult({
          name: "Authentification",
          status: "success",
          message: `Utilisateur connecté: ${user.name} (${user.roles.join(
            ", "
          )})`,
          data: { user },
        });
      } else {
        addTestResult({
          name: "Authentification",
          status: "error",
          message: "Utilisateur non connecté",
        });
      }
    } catch (error) {
      addTestResult({
        name: "Authentification",
        status: "error",
        message: `Erreur d'authentification: ${error}`,
      });
    }

    // Test 3: Service Utilisateur
    addTestResult({
      name: "Service Utilisateur",
      status: "loading",
      message: "Test du service utilisateur...",
    });

    try {
      const currentUser = await AuthService.getCurrentUser();
      addTestResult({
        name: "Service Utilisateur",
        status: "success",
        message: `Données utilisateur récupérées: ${currentUser.name}`,
        data: { currentUser },
      });
    } catch (error: any) {
      addTestResult({
        name: "Service Utilisateur",
        status: "error",
        message: `Erreur service utilisateur: ${error.message}`,
      });
    }

    // Test 4: Service Missions
    addTestResult({
      name: "Service Missions",
      status: "loading",
      message: "Test du service missions...",
    });

    try {
      const missions = await MissionService.getAllMissions({ per_page: 5 });
      addTestResult({
        name: "Service Missions",
        status: "success",
        message: `${missions.data.length} missions récupérées (total: ${missions.total})`,
        data: { missions: missions.data },
      });
    } catch (error: any) {
      addTestResult({
        name: "Service Missions",
        status: "error",
        message: `Erreur service missions: ${error.message}`,
      });
    }

    // Test 5: Service Notifications
    addTestResult({
      name: "Service Notifications",
      status: "loading",
      message: "Test du service notifications...",
    });

    try {
      const [notificationsResult, unreadCountResult] = await Promise.all([
        NotificationService.getNotifications({ per_page: 5 }),
        NotificationService.getUnreadCount(),
      ]);

      addTestResult({
        name: "Service Notifications",
        status: "success",
        message: `${notificationsResult.data.length} notifications, ${unreadCountResult.unread_count} non lues`,
        data: {
          notifications: notificationsResult.data,
          unreadCount: unreadCountResult.unread_count,
        },
      });
    } catch (error: any) {
      addTestResult({
        name: "Service Notifications",
        status: "error",
        message: `Erreur service notifications: ${error.message}`,
      });
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "loading":
        return (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        );
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "loading":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
    }
  };

  // Auto-run tests on component mount
  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Test de l'Intégration API
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vérification du bon fonctionnement de l'API Laravel
          </p>
        </div>
        <Button
          onClick={runTests}
          disabled={isRunning}
          className="flex items-center space-x-2"
        >
          <ArrowUp className="h-4 w-4" />
          <span>{isRunning ? "Tests en cours..." : "Relancer les tests"}</span>
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Status API
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {testResults.filter((t) => t.status === "success").length}/
                  {testResults.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mes Missions
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {userMissionsLoading ? "..." : userMissions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Missions Disponibles
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {availableMissionsLoading ? "..." : availableMissions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Bell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Notifications
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {notificationsLoading
                    ? "..."
                    : `${unreadCount}/${notifications.length}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Résultats des Tests</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun test exécuté</p>
            </div>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getStatusColor(
                    result.status
                  )}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(result.status)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">
                        {result.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {result.message}
                      </p>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                            Voir les données
                          </summary>
                          <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hook Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Missions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Hook: useUserMissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <Badge
                  variant={
                    userMissionsLoading
                      ? "secondary"
                      : userMissionsError
                      ? "destructive"
                      : "default"
                  }
                >
                  {userMissionsLoading
                    ? "Loading"
                    : userMissionsError
                    ? "Error"
                    : "Success"}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Missions:</span>
                <span>{userMissions.length}</span>
              </div>
              {userMissionsError && (
                <p className="text-xs text-red-600">{userMissionsError}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Available Missions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Hook: useAvailableMissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <Badge
                  variant={
                    availableMissionsLoading
                      ? "secondary"
                      : availableMissionsError
                      ? "destructive"
                      : "default"
                  }
                >
                  {availableMissionsLoading
                    ? "Loading"
                    : availableMissionsError
                    ? "Error"
                    : "Success"}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Missions:</span>
                <span>{availableMissions.length}</span>
              </div>
              {availableMissionsError && (
                <p className="text-xs text-red-600">{availableMissionsError}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Hook: useApiNotifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <Badge
                  variant={
                    notificationsLoading
                      ? "secondary"
                      : notificationsError
                      ? "destructive"
                      : "default"
                  }
                >
                  {notificationsLoading
                    ? "Loading"
                    : notificationsError
                    ? "Error"
                    : "Success"}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Notifications:</span>
                <span>{notifications.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Non lues:</span>
                <span>{unreadCount}</span>
              </div>
              {notificationsError && (
                <p className="text-xs text-red-600">{notificationsError}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestApiPage;
