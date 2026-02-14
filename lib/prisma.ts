import "./types";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

let prisma: PrismaClient;

const connectionString = process.env.DATABASE_URL;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString,
    }),
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      adapter: new PrismaPg({
        connectionString,
      }),
      log: ["error"],
    });
  }
  prisma = global.prisma;
}

export { prisma };

