import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "newest";
    const tag = searchParams.get("tag");
    const limit = parseInt(searchParams.get("limit") || "40");

    let orderBy: any = { endedAt: "desc" };

    if (filter === "trending") {
      orderBy = {
        reactions: {
          _count: "desc",
        },
      };
    }

    const where: any = {
      status: "COMPLETED",
      endedAt: { not: null },
    };

    if (tag) {
      where.tags = { contains: tag, mode: "insensitive" };
    }

    const sessions = await prisma.designSession.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true } },
        reactions: true,
      },
      orderBy,
      take: limit,
    });

    const data = sessions.map((s) => {
      const reactionCounts = s.reactions.reduce((acc, r) => {
        acc[r.emoji] = (acc[r.emoji] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const challengeData = s.challengeData as Record<string, any> || {};
      const constraints = challengeData.constraints || [];

      return {
        id: s.id,
        title: s.challengeTitle || "Untitled",
        thumbnail: s.thumbnail,
        user: s.user ? { id: s.user.id, name: s.user.name, image: s.user.image } : null,
        endedAt: s.endedAt,
        tags: s.tags,
        isWinner: s.isWinner,
        format: s.format,
        constraints: constraints,
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
