-- AlterTable
ALTER TABLE "TestimonialCard" ADD COLUMN     "projectId" INTEGER;

-- CreateIndex
CREATE INDEX "TestimonialCard_projectId_idx" ON "TestimonialCard"("projectId");

-- AddForeignKey
ALTER TABLE "TestimonialCard" ADD CONSTRAINT "TestimonialCard_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
