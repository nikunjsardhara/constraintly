import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("[debug] GET /api/sessions/:id - cookie:", request.headers.get("cookie"));
    const session = await auth.api.getSession({ headers: request.headers });
    console.log("[debug] GET /api/sessions/:id - session:", !!session, session?.user?.id ? `userId=${session.user.id}` : null);
    if (!session || !session.user) {
      console.log("[debug] GET /api/sessions/:id - unauthorized");
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
    console.log("[debug] PATCH /api/sessions/:id - cookie:", request.headers.get("cookie"));
    const session = await auth.api.getSession({ headers: request.headers });
    console.log("[debug] PATCH /api/sessions/:id - session:", !!session, session?.user?.id ? `userId=${session.user.id}` : null);
    if (!session || !session.user) {
      console.log("[debug] PATCH /api/sessions/:id - unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { endedAt, status, canvasData } = body;

    const existing = await prisma.designSession.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.designSession.update({
      where: { id },
      data: {
        ...(canvasData && { challengeData: canvasData }),
        ...(endedAt !== undefined && { endedAt: endedAt ? new Date(endedAt) : new Date() }),
        ...(status && { status }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating design session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
