"use client";

import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import {
  Bell,
  ChevronRight,
  Globe,
  LogOut,
  Palette,
  Settings as SettingsIcon,
  Shield,
  User,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const SettingsPage: React.FC = () => {
  const { user, userData, signOut, loading } = useAuth();
  const { address, isConnected, disconnectWallet } = useWallet();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth/signin");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error("Wallet disconnect error:", error);
    }
  };

  const settingsSections = [
    {
      title: "Account",
      icon: User,
      items: [
        {
          title: "Profile Information",
          description: "Manage your personal details and profile picture",
          href: "/profile",
          icon: User,
        },
        {
          title: "Wallet Connection",
          description: isConnected
            ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}`
            : "Connect your Web3 wallet",
          action: isConnected
            ? handleDisconnectWallet
            : () => router.push("/dashboard"),
          icon: Wallet,
          badge: isConnected ? "Connected" : "Not Connected",
          badgeColor: isConnected ? "green" : "gray",
        },
      ],
    },
    {
      title: "Preferences",
      icon: Palette,
      items: [
        {
          title: "Notifications",
          description: "Manage your notification preferences",
          href: "/settings/notifications",
          icon: Bell,
        },
        {
          title: "Appearance",
          description: "Customize the look and feel",
          href: "/settings/appearance",
          icon: Palette,
        },
        {
          title: "Language & Region",
          description: "Set your language and regional preferences",
          href: "/settings/language",
          icon: Globe,
        },
      ],
    },
    {
      title: "Security & Privacy",
      icon: Shield,
      items: [
        {
          title: "Privacy Settings",
          description: "Control your data and privacy",
          href: "/settings/privacy",
          icon: Shield,
        },
        {
          title: "Security",
          description: "Manage your account security",
          href: "/settings/security",
          icon: Shield,
        },
      ],
    },
  ];

  const getBadgeColor = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "gray":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
          <SettingsIcon className="h-8 w-8 text-primary-600" />
          <span>Settings</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <section.icon className="h-5 w-5 text-primary-600" />
                <span>{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-foreground">
                          {item.title}
                        </h3>
                        {item.badge && (
                          <Badge
                            className={getBadgeColor(item.badgeColor || "gray")}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.href ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(item.href!)}
                        className="flex items-center space-x-1"
                      >
                        <span>Open</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : item.action ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={item.action}
                        className="flex items-center space-x-1"
                      >
                        <span>{isConnected ? "Disconnect" : "Connect"}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <LogOut className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-medium text-red-900 dark:text-red-100">
                  Sign Out
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Sign out of your account
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              disabled={loading}
              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              {loading ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
