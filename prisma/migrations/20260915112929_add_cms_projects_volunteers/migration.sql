-- CreateEnum
CREATE TYPE "StaticPageKey" AS ENUM ('TERMS_AND_CONDITIONS', 'COOKIES', 'ABOUT_US');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "TshirtSize" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL');

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaticPage" (
    "id" SERIAL NOT NULL,
    "key" "StaticPageKey" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaticPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInfo" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "instagram" TEXT,
    "facebook" TEXT,
    "linkedin" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mainImage" TEXT NOT NULL,
    "documentUrl" TEXT,
    "projectCode" TEXT,
    "category" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "location" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "beneficiaries" TEXT,
    "funding" TEXT,
    "richContent" JSONB,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolunteerApplication" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "citizenship" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "hasPassport" BOOLEAN NOT NULL,
    "travelDocumentValidForCountry" BOOLEAN NOT NULL,
    "motivation" TEXT NOT NULL,
    "isFirstExperience" BOOLEAN NOT NULL,
    "howDidYouFindUs" TEXT NOT NULL,
    "emergencyContact" TEXT NOT NULL,
    "specialNeeds" TEXT,
    "tshirtSize" "TshirtSize" NOT NULL,
    "emailGroupConsent" BOOLEAN NOT NULL,
    "personalDataConsent" BOOLEAN NOT NULL,
    "consentTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VolunteerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaticPage_key_key" ON "StaticPage"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_slug_idx" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_startDate_idx" ON "Project"("startDate");

-- CreateIndex
CREATE INDEX "Project_endDate_idx" ON "Project"("endDate");

-- CreateIndex
CREATE INDEX "Project_deletedAt_idx" ON "Project"("deletedAt");

-- CreateIndex
CREATE INDEX "VolunteerApplication_projectId_idx" ON "VolunteerApplication"("projectId");

-- CreateIndex
CREATE INDEX "VolunteerApplication_email_idx" ON "VolunteerApplication"("email");

-- CreateIndex
CREATE INDEX "VolunteerApplication_createdAt_idx" ON "VolunteerApplication"("createdAt");

-- AddForeignKey
ALTER TABLE "VolunteerApplication" ADD CONSTRAINT "VolunteerApplication_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
