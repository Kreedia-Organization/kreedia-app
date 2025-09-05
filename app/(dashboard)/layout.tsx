"use client";

import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/hooks/useAuth";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userData, loading, error, isAuthenticated, signOut } =
    useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated && !isRedirecting) {
      console.log("User not authenticated, redirecting to sign-in");
      setIsRedirecting(true);
      router.push("/auth/signin");
    }
  }, [isAuthenticated, loading, router, isRedirecting]);

  // Main loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <img
            src="/logo_green.png"
            alt="Kreedia Logo"
            className="h-16 mx-auto mb-4"
          />
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-green-500" />
            <span className="text-gray-300">Loading your session...</span>
          </div>
          {/* Debug information in development */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs text-left text-gray-400">
              <p>Loading: {loading.toString()}</p>
              <p>User: {user ? "Present" : "None"}</p>
              <p>UserData: {userData ? "Present" : "None"}</p>
              <p>Authenticated: {isAuthenticated.toString()}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <h1 className="text-xl font-semibold text-gray-100">
            Authentication Error
          </h1>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={async () => {
              try {
                console.log("Signing out due to authentication error...");
                await signOut();
                // signOut already handles the redirection to /auth/signin
              } catch (err) {
                console.error("Error during sign out:", err);
                // Fallback: direct navigation if signOut fails
                router.push("/auth/signin");
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Sign Out & Return
          </button>
        </div>
      </div>
    );
  }

  // Redirection screen
  if (isRedirecting || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <img
            src="/logo_green.png"
            alt="Kreedia Logo"
            className="h-16 mx-auto mb-4"
          />
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-green-500" />
            <span className="text-gray-300">Redirecting...</span>
          </div>
        </div>
      </div>
    );
  }

  // Main layout for authenticated users
  return (
    <div className="min-h-screen bg-background max-w-5xl mx-auto">
      <Header />
      <NavBar />
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>

      {/* User status indicator (debug) */}
      {process.env.NODE_ENV === "development" && userData && (
        <div className="fixed bottom-4 left-4 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-80">
          <p>✅ {userData.name}</p>
          <p>📧 {userData.email}</p>
          <p>🆔 {userData.id?.slice(0, 8)}...</p>
        </div>
      )}
    </div>
  );
}
