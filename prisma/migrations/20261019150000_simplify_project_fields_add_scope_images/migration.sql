-- CreateEnum
CREATE TYPE "ProjectScope" AS ENUM ('NAZIONALE', 'INTERNAZIONALE');

-- DropIndex
DROP INDEX "Project_status_idx";

-- AlterTable
ALTER TABLE "Project"
  DROP COLUMN "projectCode",
  DROP COLUMN "status",
  DROP COLUMN "beneficiaries",
  DROP COLUMN "funding",
  DROP COLUMN "richContent",
  ADD COLUMN "scope" "ProjectScope" NOT NULL DEFAULT 'NAZIONALE',
  ADD COLUMN "whoCanJoin" TEXT;

-- DropEnum
DROP TYPE "ProjectStatus";

-- CreateIndex
CREATE INDEX "Project_scope_idx" ON "Project"("scope");

-- CreateTable
CREATE TABLE "ProjectImage" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectImage_projectId_idx" ON "ProjectImage"("projectId");

-- AddForeignKey
ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
