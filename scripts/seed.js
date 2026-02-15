#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

(function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([^=#\s]+)\s*=\s*(.*)\s*$/);
    if (!match) return;
    const key = match[1];
    let val = match[2].trim().replace(/^['\"]|['\"]$/g, '');
    process.env[key] = val;
  });
})();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
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

  try {
    for (const d of defaults) {
      const exists = await prisma.challenge.findFirst({ where: { title: d.title } });
      if (!exists) {
        await prisma.challenge.create({ data: d });
        console.log('Inserted challenge:', d.title);
      } else {
        console.log('Already exists:', d.title);
      }
    }
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().then(() => process.exit(0));
