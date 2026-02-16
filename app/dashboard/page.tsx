"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Flame, Trophy, Target, Clock, Star, Award } from "lucide-react";
import { Constraint } from "@/lib/constants/constraints";
import { getConstraintSummary } from "@/lib/design/constraints";

interface UserStats {
  currentStreak: number;
  longestStreak: number;
  weeklyStreak: number;
  totalChallenges: number;
  totalProjects: number;
  lastActivityDate: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [challenges, setChallenges] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<any>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>("instagram");
  const [duration, setDuration] = useState<number>(20);
  const [designStarted, setDesignStarted] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  const formats = [
    { value: "instagram", label: "Instagram Post (1080x1080)" },
    { value: "logo", label: "Logo (vector-friendly)" },
    { value: "youtube_thumbnail", label: "YouTube Thumbnail (1280x720)" },
    { value: "youtube_banner", label: "YouTube Banner (2560x1440)" },
    { value: "facebook_banner", label: "Facebook Banner (820x312)" },
    { value: "linkedin_banner", label: "LinkedIn Banner (1584x396)" },
    { value: "twitter_post", label: "Twitter/X Post (1200x675)" },
    { value: "presentation", label: "Presentation (16:9 slide)" },
  ];

  const initialChallenges = [
    {
      id: "c1",
      title: "Minimalist Logo",
      description: "Design a simple, memorable logo using two shapes and one accent color.",
      constraints: [
        { type: "MAX_SHAPES", value: 2, description: "Maximum 2 shapes" },
        { type: "MAX_COLORS", value: 1, description: "Max 1 color" },
        { type: "FORBIDDEN_TOOLS", value: ["text"], description: "No text" },
      ] as Constraint[],
      suggestedFormat: "logo",
      suggestedDuration: 20,
    },
  ];

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/signin");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/challenges', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) setChallenges(data);
          else setChallenges(initialChallenges);
        } else {
          setChallenges(initialChallenges);
        }
      } catch (err) {
        console.error('Error loading challenges', err);
        setChallenges(initialChallenges);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    const loadStats = async () => {
      try {
        const res = await fetch('/api/users/stats', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUserStats(data.stats);
          setBadges(data.badges || []);
        }
      } catch (err) {
        console.error('Error loading stats', err);
      } finally {
        setLoadingStats(false);
      }
    };
    loadStats();
  }, [session?.user]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-zinc-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const openChallenge = (c: any) => {
    setActiveChallenge(c);
    setSelectedFormat(c.suggestedFormat || "instagram");
    setDuration(c.suggestedDuration || 20);
    setDesignStarted(false);
    setDialogOpen(true);
  };

  const startDesign = async () => {
    try {
      const payload = {
        challengeId: activeChallenge?.id,
        challengeTitle: activeChallenge?.title,
        challengeData: activeChallenge || {},
        format: selectedFormat,
        plannedDuration: duration,
      };

      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        console.error("Failed to start design session", res.status, text);
        alert("Failed to start design session: " + (text || res.status));
        return;
      }

      const data = await res.json();
      setDialogOpen(false);
      router.push(`/studio?sessionId=${data.id}&format=${encodeURIComponent(selectedFormat)}`);
    } catch (err) {
      console.error("Error starting design session:", err);
      alert("Error starting design session");
    }
  };

  const createRandomChallenge = () => {
    const random = Math.random().toString(36).slice(2, 7);
    const constraintSets: Constraint[][] = [
      [
        { type: "MAX_SHAPES", value: 3, description: "Max 3 shapes" },
        { type: "MAX_COLORS", value: 2, description: "Max 2 colors" },
      ],
      [
        { type: "FORBIDDEN_TOOLS", value: ["text"], description: "No text" },
        { type: "MAX_SHAPES", value: 5, description: "Max 5 shapes" },
      ],
      [
        { type: "MAX_COLORS", value: 3, description: "Max 3 colors" },
        { type: "MIN_FONT_SIZE", value: 24, description: "Min font 24px" },
      ],
    ];
    const newChallenge = {
      id: `rnd-${random}`,
      title: `Random Challenge ${random}`,
      description: "Generated constraints to spark originality.",
      constraints: constraintSets[Math.floor(Math.random() * constraintSets.length)],
      suggestedFormat: formats[Math.floor(Math.random() * formats.length)].value,
      suggestedDuration: [10, 15, 20, 30][Math.floor(Math.random() * 4)],
    };
    setChallenges([newChallenge, ...challenges]);
    openChallenge(newChallenge);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
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
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              Welcome back, {session?.user?.name?.split(" ")[0]}!
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-xl">
              Overcome creative blocks with constraint-driven challenges and rapid execution. Pick a challenge below or generate a random one to start designing immediately.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={createRandomChallenge}>Start Random Challenge</Button>
            <Button variant="outline" onClick={() => router.push("/my-designs")}>My Designs</Button>
            <Button variant="ghost" onClick={() => router.push("/explore")}>Explore</Button>
          </div>
        </div>

        {!loadingStats && userStats && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Your Progress</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50">
                    <Flame className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-white">{userStats.currentStreak}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">Day Streak</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                    <Trophy className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-white">{userStats.longestStreak}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">Best Streak</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-white">{userStats.totalChallenges}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">Challenges</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-white">{userStats.weeklyStreak}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">This Week</div>
                  </div>
                </div>
              </Card>
            </div>

            {badges.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Your Badges</h4>
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                      title={badge.description}
                    >
                      <span>{badge.icon}</span>
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {challenges.map((c) => (
            <Card key={c.id} className="p-6">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{c.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">{c.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(() => {
                      const constraints = c.constraints as Constraint[] | undefined;
                      const summaries = constraints ? getConstraintSummary(constraints) : [];
                      return summaries.slice(0, 3).map((con: string, idx: number) => (
                        <span key={idx} className="text-xs px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200">{con}</span>
                      ));
                    })()}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-zinc-500">{c.suggestedDuration} min</div>
                  <Button onClick={() => openChallenge(c)}>Start</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeChallenge?.title || "Start Challenge"}</DialogTitle>
          </DialogHeader>
          <DialogDescription>{activeChallenge?.description}</DialogDescription>

          {!designStarted ? (
            <div className="mt-4 space-y-4">
              <div>
                <Label>Format</Label>
                <Select defaultValue={selectedFormat} onValueChange={(v:any) => setSelectedFormat(v)}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {formats.map((f) => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  className="mt-2"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </div>

              <div>
                <Label>Constraints</Label>
                <div className="mt-2 space-y-2">
                  {(() => {
                    const constraints = activeChallenge?.constraints as Constraint[] | undefined;
                    if (!constraints) return null;
                    const summaries = getConstraintSummary(constraints);
                    return summaries.map((con: string, idx: number) => (
                      <div key={idx} className="text-sm text-zinc-700 dark:text-zinc-200">{con}</div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-zinc-600">Designing — {selectedFormat}</div>
                <div className="text-sm text-zinc-500">{duration} min</div>
              </div>

              <div id="studio-canvas" className="w-full h-[420px] bg-white/80 dark:bg-black/60 border-2 border-dashed rounded-md flex items-center justify-center">
                <p className="text-zinc-500">Canvas placeholder — integrate fabric.js in the studio for real tools</p>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" onClick={() => setDesignStarted(false)}>Stop</Button>
                <Button onClick={() => router.push("/studio")}>Open Full Studio</Button>
              </div>
            </div>
          )}

          <DialogFooter>
            {!designStarted ? (
              <>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={startDesign}>Start Designing</Button>
              </>
            ) : (
              <Button onClick={() => { setDialogOpen(false); setDesignStarted(false); }}>Done</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
