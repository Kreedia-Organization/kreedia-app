"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/lib/theme-provider";
import { ChevronDown, LogOut, Settings, User, Wallet } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import NotificationDropdown from "./NotificationDropdown";

const Header: React.FC = () => {
  const { user, userData, signOut, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu utilisateur en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
    } catch (error) {
      console.error("Sign-out error:", error);
    }
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
            <NotificationDropdown userId={user?.uid || null} />

            {/* Theme toggle - Disabled (Dark mode only) */}

            {/* User menu */}
            {user && userData && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-foreground">
                      {userData.name || user.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="relative">
                    <Image
                      src={
                        userData.profileImage || user.photoURL || "/icon.png"
                      }
                      alt={userData.name || user.displayName || "User"}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-primary-200"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full"></div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {/* User information */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={
                            userData.profileImage ||
                            user.photoURL ||
                            "/icon.png"
                          }
                          alt={userData.name || "User"}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {userData.name || user.displayName || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                          {userData.walletAddress && (
                            <p className="text-xs text-green-600 dark:text-green-400 truncate">
                              {userData.walletAddress.slice(0, 6)}...
                              {userData.walletAddress.slice(-4)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* User statistics */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                            {userData.totalMissionsCompleted || 0}
                          </p>
                          <p className="text-xs text-gray-500">Missions</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                            {userData.totalRewardsEarned || 0} ETH
                          </p>
                          <p className="text-xs text-gray-500">Earnings</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu options */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          // Navigate to profile page
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <User className="h-4 w-4 mr-3" />
                        My Profile
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          // Navigate to wallet page
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Wallet className="h-4 w-4 mr-3" />
                        Wallet
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          // Navigate to settings page
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </button>
                    </div>

                    {/* Sign out button */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
                      <button
                        onClick={handleSignOut}
                        disabled={loading}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        {loading ? "Signing out..." : "Sign out"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Loading state */}
            {loading && !user && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="hidden sm:block">
                  <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
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
