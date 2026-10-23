-- CreateEnum
CREATE TYPE "TestimonialCardVariant" AS ENUM ('LIGHT', 'YELLOW', 'DARK', 'VIDEO');

-- CreateTable
CREATE TABLE "TestimonialsPage" (
    "id" SERIAL NOT NULL,
    "heroEyebrow" TEXT NOT NULL DEFAULT 'Testimonianze',
    "heroQuote" TEXT NOT NULL,
    "heroName" TEXT NOT NULL,
    "heroCountry" TEXT NOT NULL,
    "heroContext" TEXT NOT NULL,
    "ctaText" TEXT NOT NULL DEFAULT 'Sei appena tornato da un progetto? Raccontacelo.',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestimonialsPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestimonialCard" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "variant" "TestimonialCardVariant" NOT NULL DEFAULT 'LIGHT',
    "tag" TEXT,
    "quote" TEXT,
    "author" TEXT NOT NULL,
    "videoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestimonialCard_pkey" PRIMARY KEY ("id")
);
