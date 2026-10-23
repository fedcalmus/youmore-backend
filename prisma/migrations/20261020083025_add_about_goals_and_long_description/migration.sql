-- AlterTable
ALTER TABLE "AboutPage" ADD COLUMN     "longDescription" TEXT;

-- CreateTable
CREATE TABLE "AboutGoal" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutGoal_pkey" PRIMARY KEY ("id")
);
