"use client";

import { cn } from "@/lib/utils";
import { Award, Home, Target, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/missions", label: "Missions", icon: Target },
  { href: "/nft", label: "NFTs", icon: Award },
  { href: "/profile", label: "Profile", icon: User },
];

const NavBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation - Top */}
      <nav className="hidden md:flex bg-card max-w-xl bg-dark-bg/60 backdrop-blur-2xl border border-primary-800/20 rounded-2xl mx-auto shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between space-x-8 h-16">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 text-xs transition-colors",
                  isActive
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-primary-600 dark:text-primary-400" : ""
                  )}
                />
                <span
                  className={cn(
                    "font-medium",
                    isActive ? "text-primary-600 dark:text-primary-400" : ""
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-primary-500 rounded-b-lg" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
