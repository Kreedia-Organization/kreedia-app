"use client";

import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import { useFakeAuth } from "@/lib/use-fake-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SimpleDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useFakeAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <img src="/logo_green.png" alt="Kreedia Logo" className="w-16 h-16" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Kreedia</h1>
        </div>
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NavBar />
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>
    </div>
  );
}
