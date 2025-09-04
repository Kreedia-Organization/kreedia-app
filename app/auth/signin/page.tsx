"use client";

import Button from "@/components/ui/Button";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SignInPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push("/dashboard");
      }
    });
  }, [router]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      // Simulate an automatic sign-in without backend
      const result = await signIn("credentials", {
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md w-full">
        {/* Logo */}
        <div className="mb-8">
          <img
            src="/logo_green.png"
            alt="Kreedia Logo"
            className="h-16 mx-auto mb-4"
          />
        </div>

        {/* Sign-in text */}
        <div className="space-y-4">
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Connect your Google account to access Kreedia
          </p>
        </div>

        {/* Google sign-in button */}
        <Button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full py-3 text-base bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <img
                src="/icon.png"
                alt="Kreedia Logo"
                className="h-6 animate-spin mx-auto"
                style={{ animationDuration: "1s" }}
              />
              <span>Signing in...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
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

        {/* Terms and Privacy */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 space-y-1">
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
      </div>
    </div>
  );
};

export default SignInPage;
