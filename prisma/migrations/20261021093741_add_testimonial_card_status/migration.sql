-- CreateEnum
CREATE TYPE "TestimonialCardStatus" AS ENUM ('PENDING', 'APPROVED');

-- AlterTable
ALTER TABLE "TestimonialCard" ADD COLUMN     "status" "TestimonialCardStatus" NOT NULL DEFAULT 'APPROVED';
