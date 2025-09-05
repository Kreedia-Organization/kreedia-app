"use client";

import { useTheme } from "@/lib/theme-provider";
import { useFakeAuth } from "@/lib/use-fake-auth";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import NotificationSystem, { Notification } from "./NotificationSystem";
import Button from "./ui/Button";

const SimpleHeader: React.FC = () => {
  const { user } = useFakeAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Mission Completed!",
      message:
        "Your Central Park cleanup has been validated. You earned 0.15 ETH!",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      read: false,
    },
    {
      id: "2",
      type: "info",
      title: "New NFT Earned",
      message:
        'You received the "Beach Guardian" NFT for your outstanding cleanup work!',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
    },
    {
      id: "3",
      type: "warning",
      title: "Mission Deadline",
      message: "Your River cleanup mission has 2 days remaining.",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true,
    },
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40 w-full backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-foreground">Kreedia</span>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationSystem
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onDismiss={handleDismiss}
              onClearAll={handleClearAll}
            />

            {/* Theme toggle */}
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* User info */}
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="relative">
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-primary-200"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-500 border-2 border-card rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;
