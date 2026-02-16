import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "newest";
    const tag = searchParams.get("tag");
    const limit = parseInt(searchParams.get("limit") || "40");

    let orderBy: Record<string, unknown> = { endedAt: "desc" };

    if (filter === "trending") {
      orderBy = {
        reactions: {
          _count: "desc",
        },
      };
    }

    const where: Record<string, unknown> = {
      status: "COMPLETED",
      endedAt: { not: null },
    };

    if (tag) {
      where.tags = { contains: tag, mode: "insensitive" };
    }

    type SessionWithRelations = Prisma.DesignSessionGetPayload<{
      include: {
        user: { select: { id: true; name: true; image: true } };
        reactions: true;
      };
    }>;

    const sessions: SessionWithRelations[] = await prisma.designSession.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true } },
        reactions: true,
      },
      orderBy,
      take: limit,
    });

    const data = sessions.map((s) => {
      const reactionCounts: Record<string, number> = {};
      for (const r of s.reactions) {
        reactionCounts[r.emoji] = (reactionCounts[r.emoji] || 0) + 1;
      }

      const challengeData = (s.challengeData as Record<string, unknown>) || {};
      const constraints = (challengeData.constraints as string[]) || [];

      const sessionAny = s as Record<string, unknown>;

      return {
        id: s.id,
        title: s.challengeTitle || "Untitled",
        thumbnail: s.thumbnail,
        user: s.user ? { id: s.user.id, name: s.user.name, image: s.user.image } : null,
        endedAt: s.endedAt,
        tags: sessionAny.tags as string | null,
        isWinner: sessionAny.isWinner as boolean,
        format: s.format,
        constraints,
        reactionCounts,
        totalReactions: s.reactions.length,
      };
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error("/api/explore error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
