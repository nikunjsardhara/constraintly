"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionData = await authClient.getSession();
        if (!sessionData) {
          router.push("/auth/signin");
        } else {
          setSession(sessionData);
        }
      } catch (error) {
        router.push("/auth/signin");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Constraintly
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-zinc-600 dark:text-zinc-400">
              {session?.user?.name || session?.user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
            Welcome back, {session?.user?.name?.split(" ")[0]}!
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Ready to challenge yourself? Create a new project and start designing with constraints.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Current Streak</p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white">0</p>
              <p className="text-xs text-zinc-500">days</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Longest Streak</p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white">0</p>
              <p className="text-xs text-zinc-500">days</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Projects</p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white">0</p>
              <p className="text-xs text-zinc-500">completed</p>
            </div>
          </Card>
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Your Projects
            </h3>
            <Button>+ New Project</Button>
          </div>

          <Card className="p-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              No projects yet. Create your first constraint-based design challenge!
            </p>
            <Button asChild>
              <div>+ Create First Project</div>
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
