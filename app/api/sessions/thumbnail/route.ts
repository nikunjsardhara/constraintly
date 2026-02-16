import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, imageData } = body;

    if (!sessionId || !imageData) {
      return NextResponse.json({ error: "Missing sessionId or imageData" }, { status: 400 });
    }

    const existing = await prisma.designSession.findUnique({ where: { id: sessionId } });
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const uploadsDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (e) {
      // directory may already exist
    }

    const filename = `session-${sessionId}-${Date.now()}.png`;
    const filepath = join(uploadsDir, filename);
    const buffer = Buffer.from(imageData, "base64");
    await writeFile(filepath, buffer);

    const path = `/uploads/${filename}`;

    return NextResponse.json({ path });
  } catch (error) {
    console.error("Error saving thumbnail:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
