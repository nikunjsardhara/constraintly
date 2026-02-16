import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    type ReactionWithUser = Prisma.ReactionGetPayload<{
      include: { user: { select: { id: true; name: true; image: true } } };
    }>;

    const reactions: ReactionWithUser[] = await prisma.reaction.findMany({
      where: { sessionId },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    const grouped = reactions.reduce((acc: Record<string, { emoji: string; count: number; users: string[] }>, r) => {
      if (!acc[r.emoji]) {
        acc[r.emoji] = { emoji: r.emoji, count: 0, users: [] };
      }
      acc[r.emoji].count++;
      acc[r.emoji].users.push(r.userId);
      return acc;
    }, {});

    return NextResponse.json(Object.values(grouped));
  } catch (error) {
    console.error("Error fetching reactions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, emoji } = await request.json();

    if (!sessionId || !emoji) {
      return NextResponse.json({ error: "sessionId and emoji required" }, { status: 400 });
    }

    const existing = await prisma.reaction.findUnique({
      where: {
        sessionId_userId_emoji: {
          sessionId,
          userId: session.user.id,
          emoji,
        },
      },
    });

    if (existing) {
      await prisma.reaction.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ action: "removed" });
    } else {
      await prisma.reaction.create({
        data: {
          sessionId,
          userId: session.user.id,
          emoji,
        },
      });
      return NextResponse.json({ action: "added" });
    }
  } catch (error) {
    console.error("Error toggling reaction:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
