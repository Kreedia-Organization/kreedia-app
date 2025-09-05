"use client";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase/config";
import { UserService } from "@/lib/firebase/services/users";
import { AlertCircle, CheckCircle, Info, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface DebugInfo {
  firebaseConfig: any;
  authUser: any;
  firestoreConnection: boolean;
  userDocument: any;
  error: string | null;
}

const DebugPage: React.FC = () => {
  const { user, userData, loading, error, isAuthenticated } = useAuth();
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    firebaseConfig: null,
    authUser: null,
    firestoreConnection: false,
    userDocument: null,
    error: null,
  });
  const [testing, setTesting] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    try {
      console.log("🔍 Running Firebase diagnostics...");

      // Test Firebase config
      const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY
          ? "✅ Present"
          : "❌ Missing",
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
          ? "✅ Present"
          : "❌ Missing",
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
          ? "✅ Present"
          : "❌ Missing",
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
          ? "✅ Present"
          : "❌ Missing",
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
          ? "✅ Present"
          : "❌ Missing",
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
          ? "✅ Present"
          : "❌ Missing",
      };

      // Test Firestore connection
      let firestoreConnection = false;
      try {
        await db._delegate._databaseId;
        firestoreConnection = true;
        console.log("✅ Firestore connection successful");
      } catch (err) {
        console.error("❌ Firestore connection failed:", err);
      }

      // Test user document
      let userDocument = null;
      if (user) {
        try {
          userDocument = await UserService.getUserById(user.uid);
          console.log("✅ User document:", userDocument);
        } catch (err) {
          console.error("❌ Failed to fetch user document:", err);
        }
      }

      setDebugInfo({
        firebaseConfig: config,
        authUser: user
          ? {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              emailVerified: user.emailVerified,
              photoURL: user.photoURL,
            }
          : null,
        firestoreConnection,
        userDocument,
        error: null,
      });
    } catch (err) {
      console.error("❌ Diagnostics failed:", err);
      setDebugInfo((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Unknown error",
      }));
    } finally {
      setTesting(false);
    }
  };

  const testUserCreation = async () => {
    if (!user) return;

    setTesting(true);
    try {
      console.log("🧪 Testing user creation...");

      // Force user creation/update
      const newUserData = {
        name: user.displayName || "Test User",
        email: user.email || "",
        profileImage: user.photoURL || undefined,
        phone: null,
        gender: null,
        walletAddress: null,
        ensName: null,
        status: "ACTIVE" as const,
        totalMissionsCompleted: 0,
        totalRewardsEarned: 0,
        level: 1,
        badges: [],
      };

      await UserService.createUser(user.uid, newUserData);
      console.log("✅ User created/updated successfully");

      // Refresh diagnostics
      await runDiagnostics();
    } catch (err) {
      console.error("❌ User creation failed:", err);
      setDebugInfo((prev) => ({
        ...prev,
        error: `User creation failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      }));
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Firebase Debug</h1>
        <Button
          onClick={runDiagnostics}
          disabled={testing}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${testing ? "animate-spin" : ""}`} />
          <span>Refresh Diagnostics</span>
        </Button>
      </div>

      {/* Auth Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {isAuthenticated ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            <span>Authentication Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>Loading: {loading.toString()}</div>
            <div>Authenticated: {isAuthenticated.toString()}</div>
            <div>Has User: {(!!user).toString()}</div>
            <div>Has UserData: {(!!userData).toString()}</div>
          </div>
          {error && (
            <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Firebase Config */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>Firebase Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {debugInfo.firebaseConfig && (
            <div className="grid grid-cols-1 gap-2 text-sm font-mono">
              {Object.entries(debugInfo.firebaseConfig).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span>{key}:</span>
                  <span
                    className={
                      value === "✅ Present" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Firebase Auth User */}
      {debugInfo.authUser && (
        <Card>
          <CardHeader>
            <CardTitle>Firebase Auth User</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">
              {JSON.stringify(debugInfo.authUser, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Firestore Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {debugInfo.firestoreConnection ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            <span>Firestore Connection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Status:{" "}
            {debugInfo.firestoreConnection ? "✅ Connected" : "❌ Disconnected"}
          </p>
        </CardContent>
      </Card>

      {/* User Document */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {debugInfo.userDocument ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <span>Firestore User Document</span>
            </div>
            {user && (
              <Button size="sm" onClick={testUserCreation} disabled={testing}>
                {testing ? "Creating..." : "Create/Update User"}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {debugInfo.userDocument ? (
            <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">
              {JSON.stringify(debugInfo.userDocument, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No user document found in Firestore
            </p>
          )}
        </CardContent>
      </Card>

      {/* Error Details */}
      {debugInfo.error && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>Error Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 dark:text-red-400 font-mono">
              {debugInfo.error}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h4 className="font-medium">1. Check Firebase Configuration</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Ensure all environment variables are properly set in your
              .env.local file
            </p>
          </div>
          <div>
            <h4 className="font-medium">2. Verify Firestore Rules</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Make sure your Firestore security rules allow read/write access
              for authenticated users
            </p>
          </div>
          <div>
            <h4 className="font-medium">3. Check Console</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Open browser console (F12) to see detailed logs and error messages
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugPage;
