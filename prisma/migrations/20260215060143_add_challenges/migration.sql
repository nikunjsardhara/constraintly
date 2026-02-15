-- CreateTable
CREATE TABLE "challenges" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "constraints" JSONB,
    "suggestedFormat" TEXT,
    "suggestedDuration" INTEGER,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "challenges_userId_idx" ON "challenges"("userId");

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
