import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Constraint, CONSTRAINT_DEFINITIONS } from "@/lib/constants/constraints";

const DEFAULT_CHALLENGES = [
  // ============ EASY (6) - Warm-ups ============
  {
    title: "One Shape Logo",
    description: "Create a memorable logo using exactly ONE shape and ONE color. Pure simplicity.",
    constraints: [
      { type: "MAX_SHAPES", value: 1, description: "Exactly 1 shape" },
      { type: "MAX_COLORS", value: 1, description: "Only 1 color" },
      { type: "FORBIDDEN_TOOLS", value: ["text"], description: "No text allowed" },
    ] as Constraint[],
    suggestedFormat: "logo",
    suggestedDuration: 15,
  },
  {
    title: "Quick Post",
    description: "Create any design you want. No rules, just create!",
    constraints: [
      { type: "MAX_COLORS", value: 3, description: "Maximum 3 colors" },
      { type: "FORBIDDEN_CONTENT", value: ["images"], description: "No external images" },
    ] as Constraint[],
    suggestedFormat: "instagram",
    suggestedDuration: 20,
  },
  {
    title: "Minimal Icon",
    description: "Design a clean icon with maximum 2 shapes. No text needed.",
    constraints: [
      { type: "MAX_SHAPES", value: 2, description: "Maximum 2 shapes" },
      { type: "MAX_COLORS", value: 2, description: "Maximum 2 colors" },
      { type: "FORBIDDEN_TOOLS", value: ["text"], description: "No text allowed" },
    ] as Constraint[],
    suggestedFormat: "logo",
    suggestedDuration: 15,
  },
  {
    title: "Basic Type",
    description: "Design with typography. One font family, max 2 colors.",
    constraints: [
      { type: "MAX_COLORS", value: 2, description: "Maximum 2 colors" },
      { type: "FORBIDDEN_TOOLS", value: ["shapes", "images"], description: "No shapes or images" },
    ] as Constraint[],
    suggestedFormat: "twitter_post",
    suggestedDuration: 15,
  },
  {
    title: "Fast Banner",
    description: "Create a banner with max 5 shapes. No time pressure, just create.",
    constraints: [
      { type: "MAX_SHAPES", value: 5, description: "Maximum 5 shapes" },
      { type: "MAX_COLORS", value: 4, description: "Maximum 4 colors" },
    ] as Constraint[],
    suggestedFormat: "linkedin_banner",
    suggestedDuration: 25,
  },
  {
    title: "Tiny Avatar",
    description: "Design a profile picture. Small canvas, big impact!",
    constraints: [
      { type: "MAX_SHAPES", value: 2, description: "Maximum 2 shapes" },
      { type: "MAX_COLORS", value: 2, description: "Maximum 2 colors" },
      { type: "FORBIDDEN_TOOLS", value: ["text"], description: "No text allowed" },
    ] as Constraint[],
    suggestedFormat: "logo",
    suggestedDuration: 10,
  },

  // ============ MEDIUM (6) - Requires creative thinking ============
  {
    title: "Negative Space",
    description: "Use white space as an active design element. Let the emptiness speak.",
    constraints: [
      { type: "MAX_SHAPES", value: 4, description: "Maximum 4 shapes" },
      { type: "MAX_COLORS", value: 2, description: "Maximum 2 colors" },
      { type: "FORBIDDEN_TOOLS", value: ["text"], description: "No text allowed" },
    ] as Constraint[],
    suggestedFormat: "instagram",
    suggestedDuration: 25,
  },
  {
    title: "Duotone Dreams",
    description: "Create depth and drama using exactly 2 colors. Limited palette, unlimited possibility.",
    constraints: [
      { type: "MAX_COLORS", value: 2, description: "Exactly 2 colors" },
      { type: "MIN_SHAPES", value: 3, description: "At least 3 shapes" },
      { type: "FORBIDDEN_CONTENT", value: ["gradients"], description: "No gradients" },
    ] as Constraint[],
    suggestedFormat: "youtube_thumbnail",
    suggestedDuration: 25,
  },
  {
    title: "Overlap Magic",
    description: "Explore transparency and blending. Let shapes interact in unexpected ways.",
    constraints: [
      { type: "MAX_SHAPES", value: 4, description: "Maximum 4 shapes" },
      { type: "MAX_COLORS", value: 3, description: "Maximum 3 colors" },
      { type: "FORBIDDEN_TOOLS", value: ["text", "images"], description: "No text or images" },
    ] as Constraint[],
    suggestedFormat: "facebook_banner",
    suggestedDuration: 30,
  },
  {
    title: "Type as Shape",
    description: "Text IS the visual. Make letters become graphics.",
    constraints: [
      { type: "MIN_FONT_SIZE", value: 48, description: "Minimum font size 48px" },
      { type: "MAX_COLORS", value: 2, description: "Maximum 2 colors" },
      { type: "FORBIDDEN_TOOLS", value: ["shapes", "images"], description: "No shapes or images" },
    ] as Constraint[],
    suggestedFormat: "instagram",
    suggestedDuration: 25,
  },
  {
    title: "Symmetry",
    description: "Create a perfect mirror composition. Balanced, hypnotic, timeless.",
    constraints: [
      { type: "MAX_SHAPES", value: 6, description: "Maximum 6 shapes" },
      { type: "MAX_COLORS", value: 3, description: "Maximum 3 colors" },
      { type: "FORBIDDEN_TOOLS", value: ["text", "images"], description: "No text or images" },
    ] as Constraint[],
    suggestedFormat: "presentation",
    suggestedDuration: 30,
  },
  {
    title: "Contrast Call",
    description: "Embrace opposites: light vs dark, big vs small, filled vs empty.",
    constraints: [
      { type: "MAX_COLORS", value: 2, description: "Maximum 2 colors" },
      { type: "MAX_SHAPES", value: 5, description: "Maximum 5 shapes" },
      { type: "FORBIDDEN_TOOLS", value: ["images"], description: "No images" },
    ] as Constraint[],
    suggestedFormat: "twitter_post",
    suggestedDuration: 25,
  },

  // ============ HARD (6) - Forces unusual solutions ============
  {
    title: "One Line",
    description: "Draw everything with a SINGLE continuous line. No lifting, no stopping.",
    constraints: [
      { type: "MAX_SHAPES", value: 1, description: "Only 1 line/shape" },
      { type: "MAX_COLORS", value: 1, description: "Only 1 color" },
      { type: "FORBIDDEN_TOOLS", value: ["text", "images"], description: "No text or images" },
    ] as Constraint[],
    suggestedFormat: "logo",
    suggestedDuration: 20,
  },
  {
    title: "Impossible",
    description: "Create an optical illusion using shapes. Mind-bending geometry.",
    constraints: [
      { type: "MAX_SHAPES", value: 5, description: "Maximum 5 shapes" },
      { type: "MAX_COLORS", value: 3, description: "Maximum 3 colors" },
      { type: "FORBIDDEN_TOOLS", value: ["text", "images"], description: "No text or images" },
    ] as Constraint[],
    suggestedFormat: "instagram",
    suggestedDuration: 35,
  },
  {
    title: "Grayscale Power",
    description: "No color, no problem. Create maximum impact with shades of gray.",
    constraints: [
      { type: "MAX_COLORS", value: 1, description: "Only grayscale" },
      { type: "MIN_SHAPES", value: 4, description: "At least 4 shapes" },
      { type: "FORBIDDEN_CONTENT", value: ["gradients"], description: "No gradients" },
    ] as Constraint[],
    suggestedFormat: "youtube_thumbnail",
    suggestedDuration: 25,
  },
  {
    title: "Tiny Giant",
    description: "Fill the entire space with ONE massive element. Scale is everything.",
    constraints: [
      { type: "MAX_SHAPES", value: 1, description: "Only 1 shape" },
      { type: "MAX_COLORS", value: 2, description: "Maximum 2 colors" },
      { type: "FORBIDDEN_TOOLS", value: ["text", "images"], description: "No text or images" },
    ] as Constraint[],
    suggestedFormat: "instagram",
    suggestedDuration: 20,
  },
  {
    title: "Rule Breaker",
    description: "Counter-intuitive placement. Unexpected scaling. Break all expectations.",
    constraints: [
      { type: "MAX_SHAPES", value: 4, description: "Maximum 4 shapes" },
      { type: "MAX_COLORS", value: 3, description: "Maximum 3 colors" },
      { type: "FORBIDDEN_TOOLS", value: ["images"], description: "No images" },
    ] as Constraint[],
    suggestedFormat: "twitter_post",
    suggestedDuration: 30,
  },
  {
    title: "Emoji Story",
    description: "Tell a visual story using only geometric shapes. Abstract narrative.",
    constraints: [
      { type: "MIN_SHAPES", value: 5, description: "At least 5 shapes" },
      { type: "MAX_COLORS", value: 4, description: "Maximum 4 colors" },
      { type: "FORBIDDEN_TOOLS", value: ["text", "images"], description: "No text or images" },
    ] as Constraint[],
    suggestedFormat: "instagram",
    suggestedDuration: 30,
  },

  // ============ VERY HARD / ARTISTIC (6) - Push creative boundaries ============
  {
    title: "Emotion Only",
    description: "Convey a feeling — joy, mystery, calm, urgency — without ANY text. Pure visual language.",
    constraints: [
      { type: "MAX_SHAPES", value: 5, description: "Maximum 5 shapes" },
      { type: "MAX_COLORS", value: 3, description: "Maximum 3 colors" },
      { type: "FORBIDDEN_TOOLS", value: ["text"], description: "NO text allowed" },
    ] as Constraint[],
    suggestedFormat: "instagram",
    suggestedDuration: 40,
  },
  {
    title: "Inception",
    description: "A design within a design. Recursive composition — small within big, big within small.",
    constraints: [
      { type: "MIN_SHAPES", value: 6, description: "At least 6 shapes" },
      { type: "MAX_COLORS", value: 4, description: "Maximum 4 colors" },
      { type: "FORBIDDEN_TOOLS", value: ["text"], description: "No text allowed" },
    ] as Constraint[],
    suggestedFormat: "presentation",
    suggestedDuration: 45,
  },
  {
    title: "Bauhaus",
    description: "Geometric, functional, iconic. Pay homage to the masters of modern design.",
    constraints: [
      { type: "MAX_SHAPES", value: 5, description: "Maximum 5 shapes" },
      { type: "MAX_COLORS", value: 3, description: "Maximum 3 primary-influenced colors" },
      { type: "FORBIDDEN_TOOLS", value: ["images"], description: "No images" },
    ] as Constraint[],
    suggestedFormat: "logo",
    suggestedDuration: 35,
  },
  {
    title: "Op Art",
    description: "Create movement illusion with patterns. Mesmerize the viewer. Make it pulse.",
    constraints: [
      { type: "MIN_SHAPES", value: 10, description: "At least 10 shapes" },
      { type: "MAX_COLORS", value: 2, description: "Maximum 2 colors" },
      { type: "FORBIDDEN_TOOLS", value: ["text", "images"], description: "No text or images" },
    ] as Constraint[],
    suggestedFormat: "instagram",
    suggestedDuration: 45,
  },
  {
    title: "Chaos Order",
    description: "Controlled disorder. Intentional mess with purpose. Beautiful chaos.",
    constraints: [
      { type: "MIN_SHAPES", value: 8, description: "At least 8 shapes" },
      { type: "MAX_COLORS", value: 4, description: "Maximum 4 colors" },
      { type: "FORBIDDEN_TOOLS", value: ["text"], description: "No text allowed" },
    ] as Constraint[],
    suggestedFormat: "facebook_banner",
    suggestedDuration: 40,
  },
  {
    title: "Minimal Maximum",
    description: "Extreme constraints: 1 shape, 1 color. But it must be STUNNING.",
    constraints: [
      { type: "MAX_SHAPES", value: 1, description: "Only 1 shape" },
      { type: "MAX_COLORS", value: 1, description: "Only 1 color" },
      { type: "MIN_FONT_SIZE", value: 24, description: "Optional text min 24px" },
    ] as Constraint[],
    suggestedFormat: "logo",
    suggestedDuration: 30,
  },
];

export async function GET() {
  try {
    let challenges = await prisma.challenge.findMany({ orderBy: { createdAt: 'desc' } });

    if (!challenges || challenges.length < DEFAULT_CHALLENGES.length) {
      await prisma.challenge.deleteMany({});
      for (const d of DEFAULT_CHALLENGES) {
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
