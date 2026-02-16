import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const DEFAULT_BADGES = [
  {
    name: "First Challenge",
    description: "Complete your first design challenge",
    icon: "🎯",
    criteria: "complete_1_challenge",
  },
  {
    name: "3-Day Streak",
    description: "Complete challenges 3 days in a row",
    icon: "🔥",
    criteria: "3_day_streak",
  },
  {
    name: "Week Warrior",
    description: "Complete challenges 7 days in a row",
    icon: "⚔️",
    criteria: "7_day_streak",
  },
  {
    name: "Unbreakable",
    description: "Maintain a 30-day streak",
    icon: "💎",
    criteria: "30_day_streak",
  },
  {
    name: "Weekly Winner",
    description: "Complete 10 challenges in a single week",
    icon: "🏆",
    criteria: "10_weekly_challenges",
  },
  {
    name: "Speed Demon",
    description: "Complete a challenge in under 5 minutes",
    icon: "⚡",
    criteria: "under_5_minutes",
  },
  {
    name: "Explorer",
    description: "View 50 different designs in explore",
    icon: "🔍",
    criteria: "view_50_designs",
  },
  {
    name: "Community Star",
    description: "Receive 100 reactions on your designs",
    icon: "⭐",
    criteria: "100_reactions",
  },
];

export async function GET() {
  try {
    const badges = await prisma.badge.findMany();
    
    if (badges.length === 0) {
      for (const b of DEFAULT_BADGES) {
        await prisma.badge.create({ data: b });
      }
      const newBadges = await prisma.badge.findMany();
      return NextResponse.json(newBadges);
    }
    
    return NextResponse.json(badges);
  } catch (error) {
    console.error("Error fetching badges:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
