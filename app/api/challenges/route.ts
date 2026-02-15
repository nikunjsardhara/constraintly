import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    let challenges = await prisma.challenge.findMany({ orderBy: { createdAt: 'desc' } });

    if (!challenges || challenges.length === 0) {
      // seed some default challenges
      const defaults = [
        {
          title: "Minimalist Logo",
          description: "Design a simple, memorable logo using two shapes and one accent color.",
          constraints: ["2 shapes max", "1 accent color", "No text"],
          suggestedFormat: "logo",
          suggestedDuration: 20,
        },
        {
          title: "Bold Instagram Post",
          description: "Create an attention-grabbing IG post with a limited palette.",
          constraints: ["3 colors only", "Asymmetrical layout", "No stock photos"],
          suggestedFormat: "instagram",
          suggestedDuration: 30,
        },
        {
          title: "YouTube Thumbnail — Dramatic",
          description: "Design a high-contrast thumbnail that reads clearly at small sizes.",
          constraints: ["Large type", "High contrast", "Single focal point"],
          suggestedFormat: "youtube_thumbnail",
          suggestedDuration: 25,
        },
      ];

      for (const d of defaults) {
        await prisma.challenge.create({ data: d as any });
      }

      challenges = await prisma.challenge.findMany({ orderBy: { createdAt: 'desc' } });
    }

    return NextResponse.json(challenges);
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, constraints, suggestedFormat, suggestedDuration } = body;

    if (!title) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }

    const created = await prisma.challenge.create({
      data: {
        title,
        description,
        constraints,
        suggestedFormat,
        suggestedDuration,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating challenge:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
