import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("[debug] POST /api/sessions - cookie header:", request.headers.get("cookie"));
    const session = await auth.api.getSession({ headers: request.headers });
    console.log("[debug] POST /api/sessions - auth.api.getSession returned:", !!session, session?.user?.id ? `userId=${session.user.id}` : null);
    if (!session || !session.user) {
      console.log("[debug] POST /api/sessions - unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { challengeId, challengeTitle, challengeData, format, plannedDuration, projectId } = body;

    const designSession = await prisma.designSession.create({
      data: {
        userId: session.user.id,
        challengeId,
        challengeTitle,
        challengeData,
        format,
        plannedDuration,
        startedAt: new Date(),
        status: "ACTIVE",
      },
    });

    return NextResponse.json(designSession, { status: 201 });
  } catch (error) {
    console.error("Error starting design session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.designSession.findMany({
      where: { userId: session.user.id },
      orderBy: { startedAt: "desc" },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching design sessions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
