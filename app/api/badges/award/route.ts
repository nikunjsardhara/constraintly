import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { badgeId } = await request.json();

    if (!badgeId) {
      return NextResponse.json({ error: "badgeId required" }, { status: 400 });
    }

    const existing = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId: session.user.id,
          badgeId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ message: "Badge already awarded" });
    }

    const userBadge = await prisma.userBadge.create({
      data: {
        userId: session.user.id,
        badgeId,
      },
      include: { badge: true },
    });

    return NextResponse.json(userBadge);
  } catch (error) {
    console.error("Error awarding badge:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
