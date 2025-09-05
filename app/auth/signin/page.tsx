"use client";

import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SignInPage: React.FC = () => {
  const router = useRouter();
  const { signInWithGoogle, isAuthenticated, loading, error, clearError } =
    useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      console.log("User already authenticated, redirecting to dashboard");
      setIsSigningIn(false); // Reset signing in state
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Clear any previous errors when component mounts
    if (clearError) {
      clearError();
    }
  }, [clearError]);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      if (clearError) {
        clearError();
      }
      console.log("Attempting Google sign-in...");
      await signInWithGoogle();
      // Navigation will be handled by the useAuth hook
      console.log("Sign-in process completed");
    } catch (error) {
      console.error("Sign-in error:", error);
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md w-full">
        {/* Logo */}
        <div className="mb-8">
          <img
            src="/logo_green.png"
            alt="Kreedia Logo"
            className="h-20 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-100">
            Welcome to Kreedia
          </h1>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-lg text-gray-300">
            Connect your Google account to access Kreedia
          </p>
          <p className="text-sm text-gray-400">
            Participate in environmental cleanup missions and earn rewards
          </p>
        </div>

        {/* Status message */}
        {isSigningIn && (
          <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span className="text-blue-700 dark:text-blue-300">
              Signing in...
            </span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <span className="text-red-700 dark:text-red-300 text-sm">
              {error}
            </span>
          </div>
        )}

        {/* Success message */}
        {isAuthenticated && (
          <div className="flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-300 text-sm">
              Sign-in successful! Redirecting...
            </span>
          </div>
        )}

        {/* Sign-in button */}
        <Button
          onClick={handleSignIn}
          disabled={loading || isSigningIn || isAuthenticated}
          className="w-full py-4 text-base bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          {isSigningIn || loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Connected! Redirecting...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign in with Google</span>
            </div>
          )}
        </Button>

        {/* Legal information */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 space-y-2">
          <p>
            By signing in, you agree to our{" "}
            <a href="#" className="text-primary-600 hover:underline">
              Terms of Service
            </a>
          </p>
          <p>
            and our{" "}
            <a href="#" className="text-primary-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Debug information (development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Authentication State (Debug)
            </h3>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p>Loading: {loading.toString()}</p>
              <p>Signing In: {isSigningIn.toString()}</p>
              <p>Authenticated: {isAuthenticated.toString()}</p>
              <p>Error: {error || "None"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignInPage;
