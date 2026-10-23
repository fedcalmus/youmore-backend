-- CreateTable
CREATE TABLE "HomePage" (
    "id" SERIAL NOT NULL,
    "stepsEyebrow" TEXT NOT NULL DEFAULT 'Come funziona',
    "stepsTitle" TEXT NOT NULL,
    "aboutTeaserEyebrow" TEXT NOT NULL DEFAULT 'Chi siamo',
    "aboutTeaserTitle" TEXT NOT NULL,
    "aboutTeaserText" TEXT NOT NULL,
    "testimonialsEyebrow" TEXT NOT NULL DEFAULT 'Testimonianze',
    "testimonialsTitle" TEXT NOT NULL,
    "fundersEyebrow" TEXT NOT NULL DEFAULT 'Enti finanziatori',
    "fundersIntroText" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeStep" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeTestimonial" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "quote" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "variant" TEXT NOT NULL DEFAULT 'light',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeTestimonial_pkey" PRIMARY KEY ("id")
);
