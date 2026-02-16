"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Clock, Trophy, Eye, X } from "lucide-react";

interface DesignSession {
  id: string;
  challengeTitle: string | null;
  format: string;
  thumbnail: string | null;
  status: string;
  startedAt: string;
  endedAt: string | null;
  plannedDuration: number | null;
}

export default function MyDesignsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [designs, setDesigns] = useState<DesignSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<DesignSession | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/signin");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (!session?.user) return;

    const loadDesigns = async () => {
      try {
        const res = await fetch("/api/sessions", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setDesigns(data || []);
        }
      } catch (err) {
        console.error("Failed to load designs", err);
      } finally {
        setLoading(false);
      }
    };
    loadDesigns();
  }, [session?.user]);

  if (isPending || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-zinc-600">Loading...</div>
      </div>
    );
  }

  const completedDesigns = designs.filter((d) => d.status === "COMPLETED");

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "In progress";
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold dark:text-white">My Designs</h1>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-zinc-500">Loading designs...</div>
        ) : designs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-500 mb-4">You haven't created any designs yet.</p>
            <Button onClick={() => router.push("/dashboard")}>Start Your First Challenge</Button>
          </div>
        ) : (
          <>
            {completedDesigns.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold dark:text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Completed ({completedDesigns.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {completedDesigns.map((design) => (
                    <Card key={design.id} className="overflow-hidden">
                      <div 
                        className="w-full h-32 bg-zinc-100 dark:bg-zinc-900 relative cursor-pointer"
                        onClick={() => setSelectedDesign(design)}
                      >
                        <img
                          src={design.thumbnail || '/file.svg'}
                          alt={design.challengeTitle || "Design"}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-2 right-2 bg-zinc-900/70 text-white p-1 rounded">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="text-sm font-semibold dark:text-white">
                          {design.challengeTitle || "Untitled"}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1 capitalize">
                          {design.format?.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-zinc-400 mt-1">
                          {formatDate(design.endedAt)}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {selectedDesign && (
          <div 
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDesign(null)}
          >
            <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <button
                className="absolute top-4 right-4 text-white bg-zinc-800/50 hover:bg-zinc-700 rounded-full p-2 z-10"
                onClick={() => setSelectedDesign(null)}
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={selectedDesign.thumbnail || '/file.svg'}
                alt={selectedDesign.challengeTitle || "Design"}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
                <h3 className="text-white font-semibold text-lg">
                  {selectedDesign.challengeTitle || "Untitled"}
                </h3>
                <p className="text-zinc-300 text-sm capitalize">
                  {selectedDesign.format?.replace('_', ' ')} • Completed {formatDate(selectedDesign.endedAt)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
