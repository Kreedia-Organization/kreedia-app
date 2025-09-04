"use client";

import { useTheme } from "@/lib/theme-provider";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import NotificationSystem, { Notification } from "./NotificationSystem";

const Header: React.FC = () => {
  const { data: session } = useSession();
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
    <header className="bg-card border-b sticky top-0 z-40 w-full md:my-4  bg-dark-bg/60 backdrop-blur-2xl md:border border-primary-800/20 md:rounded-2xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src="/logo_green.png" alt="Kreedia Logo" className=" h-8" />
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

            {/* Theme toggle - Disabled (Dark mode only) */}

            {/* User info */}
            {session?.user && (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-gray-500">{session.user.email}</p>
                </div>
                <div className="relative">
                  <Image
                    src={session.user.image || "/icon.png"}
                    alt={session.user.name || "User"}
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

export default Header;
