import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function checkAndAwardBadges(userId: string, stats: any) {
  const badges = await prisma.badge.findMany();

  type UserBadgeType = Prisma.UserBadgeGetPayload<{}>;
  const userBadges: UserBadgeType[] = await prisma.userBadge.findMany({
    where: { userId },
  });
  const earnedBadgeIds = new Set(userBadges.map((b) => b.badgeId));

  for (const badge of badges) {
    if (earnedBadgeIds.has(badge.id)) continue;

    let shouldAward = false;

    switch (badge.criteria) {
      case "complete_1_challenge":
        shouldAward = stats.totalChallenges >= 1;
        break;
      case "3_day_streak":
        shouldAward = stats.currentStreak >= 3;
        break;
      case "7_day_streak":
        shouldAward = stats.currentStreak >= 7;
        break;
      case "30_day_streak":
        shouldAward = stats.currentStreak >= 30;
        break;
      case "10_weekly_challenges":
        const weekStart = getWeekStart(new Date());
        const weekly = await prisma.weeklyStats.findFirst({
          where: { userId, weekStart },
        });
        shouldAward = !!weekly && weekly.challengesCompleted >= 10;
        break;
      case "under_5_minutes":
        shouldAward = true;
        break;
    }

    if (shouldAward) {
      await prisma.userBadge.create({
        data: { userId, badgeId: badge.id },
      });
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const designSession = await prisma.designSession.findUnique({ where: { id } });
    if (!designSession) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (designSession.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(designSession);
  } catch (error) {
    console.error("Error fetching design session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { endedAt, status, canvasData, thumbnail, tags, isWinner } = body;

    const existing = await prisma.designSession.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const isCompleting = status === "COMPLETED" && existing.status !== "COMPLETED" && existing.status !== null;

    const updated = await prisma.designSession.update({
      where: { id },
      data: {
        ...(canvasData && { challengeData: canvasData }),
        ...(endedAt !== undefined && { endedAt: endedAt ? new Date(endedAt) : new Date() }),
        ...(status && { status }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(tags !== undefined && { tags }),
        ...(isWinner !== undefined && { isWinner }),
      },
    });

    if (isCompleting) {
      let userStats = await prisma.userStats.findUnique({
        where: { userId: session.user.id },
      });

      if (!userStats) {
        userStats = await prisma.userStats.create({
          data: { userId: session.user.id },
        });
      }

      const now = new Date();
      const lastActivity = userStats.lastActivityDate ? new Date(userStats.lastActivityDate) : null;
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);

      let newStreak = userStats.currentStreak;
      if (!lastActivity || lastActivity < yesterday) {
        newStreak = 1;
      } else {
        const daysDiff = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff <= 1) {
          newStreak = userStats.currentStreak + 1;
        }
      }

      const weekStart = getWeekStart(now);
      let weeklyStats = await prisma.weeklyStats.findUnique({
        where: {
          userId_weekStart: {
            userId: session.user.id,
            weekStart,
          },
        },
      });

      if (!weeklyStats) {
        weeklyStats = await prisma.weeklyStats.create({
          data: {
            userId: session.user.id,
            weekStart,
            challengesCompleted: 1,
            totalTimeMinutes: existing.plannedDuration || 0,
          },
        });
      } else {
        weeklyStats = await prisma.weeklyStats.update({
          where: { id: weeklyStats.id },
          data: {
            challengesCompleted: { increment: 1 },
            totalTimeMinutes: { increment: existing.plannedDuration || 0 },
          },
        });
      }

      const duration = existing.plannedDuration || 0;

      await prisma.userStats.update({
        where: { userId: session.user.id },
        data: {
          currentStreak: newStreak,
          longestStreak: Math.max(userStats.longestStreak, newStreak),
          totalChallenges: { increment: 1 },
          totalProjects: { increment: 1 },
          lastActivityDate: now,
          weeklyStreak: weeklyStats.challengesCompleted,
          lastWeekStart: weekStart,
        },
      });

      await checkAndAwardBadges(session.user.id, {
        totalChallenges: userStats.totalChallenges + 1,
        currentStreak: newStreak,
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating design session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
