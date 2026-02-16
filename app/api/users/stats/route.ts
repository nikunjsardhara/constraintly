import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let stats = await prisma.userStats.findUnique({
      where: { userId: session.user.id },
    });

    if (!stats) {
      stats = await prisma.userStats.create({
        data: { userId: session.user.id },
      });
    }

    const badges = await prisma.userBadge.findMany({
      where: { userId: session.user.id },
      include: { badge: true },
    });

    const weeklyStats = await prisma.weeklyStats.findMany({
      where: { userId: session.user.id },
      orderBy: { weekStart: "desc" },
      take: 12,
    });

    return NextResponse.json({
      stats,
      badges: badges.map((b) => b.badge),
      weeklyStats,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
