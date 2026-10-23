-- CreateEnum
CREATE TYPE "HomeGallerySlot" AS ENUM ('GROUP', 'ACTIVITY', 'TRAVEL');

-- CreateTable
CREATE TABLE "HomeGalleryImage" (
    "id" SERIAL NOT NULL,
    "slot" "HomeGallerySlot" NOT NULL,
    "image" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeGalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomeGalleryImage_slot_key" ON "HomeGalleryImage"("slot");
