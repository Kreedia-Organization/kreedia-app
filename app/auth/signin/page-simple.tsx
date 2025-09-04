"use client";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { fakeAuth } from "@/lib/fake-auth";
import { Award, Globe, Leaf, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SimpleSignInPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await fakeAuth.signIn();
      if (result.success) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Leaf,
      title: "Environmental Impact",
      description: "Turn your environmental actions into tangible rewards",
    },
    {
      icon: Shield,
      title: "Secure & Verified",
      description: "All actions are verified by NGO partners",
    },
    {
      icon: Award,
      title: "NFT Rewards",
      description:
        "Earn unique NFTs as proof of your environmental contribution",
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Join eco-warriors worldwide making a difference",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding and features */}
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-3xl font-bold text-foreground">
                Kreedia
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Clean the Environment, <br />
              <span className="text-primary-500">Earn Crypto</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join the revolutionary movement. Take photos, clean your city, and
              earn crypto rewards + NFTs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              >
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Sign in form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome to Kreedia</CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Click to start your environmental journey
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full py-3 text-base"
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
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-primary-200 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-bold text-xs">
                        E
                      </span>
                    </div>
                    <span>Enter Kreedia Dashboard</span>
                  </div>
                )}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  🎭 Demo Mode - No real authentication required
                </p>
                <p className="text-xs text-gray-400">
                  This is a frontend-only demonstration
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimpleSignInPage;
