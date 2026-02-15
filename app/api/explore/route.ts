import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sessions = await prisma.designSession.findMany({
      where: { status: "COMPLETED" },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { endedAt: "desc" },
      take: 40,
    });

    const data = sessions.map((s) => ({
      id: s.id,
      title: s.challengeTitle || "Untitled",
      thumbnail: s.challengeData?.thumbnail || null,
      user: s.user ? { id: s.user.id, name: s.user.name, image: s.user.image } : null,
      endedAt: s.endedAt,
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("/api/explore error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
