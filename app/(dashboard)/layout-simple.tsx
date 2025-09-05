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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <img
            src="/icon.png"
            alt="Kreedia Logo"
            className="h-16 animate-spin mx-auto"
            style={{ animationDuration: "1s" }}
          />
        </div>
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
