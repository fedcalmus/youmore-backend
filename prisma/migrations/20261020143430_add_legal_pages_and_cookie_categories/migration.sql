-- CreateEnum
CREATE TYPE "LegalPageKey" AS ENUM ('PRIVACY_POLICY', 'COOKIE_POLICY');

-- CreateEnum
CREATE TYPE "CookieCategoryKey" AS ENUM ('NECESSARI', 'STATISTICI', 'MARKETING');

-- CreateTable
CREATE TABLE "LegalPage" (
    "id" SERIAL NOT NULL,
    "key" "LegalPageKey" NOT NULL,
    "title" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "bannerTitle" TEXT,
    "bannerText" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LegalPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalSection" (
    "id" SERIAL NOT NULL,
    "legalPageId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LegalSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CookieCategory" (
    "id" SERIAL NOT NULL,
    "key" "CookieCategoryKey" NOT NULL,
    "name" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CookieCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LegalPage_key_key" ON "LegalPage"("key");

-- CreateIndex
CREATE INDEX "LegalSection_legalPageId_idx" ON "LegalSection"("legalPageId");

-- CreateIndex
CREATE UNIQUE INDEX "CookieCategory_key_key" ON "CookieCategory"("key");

-- AddForeignKey
ALTER TABLE "LegalSection" ADD CONSTRAINT "LegalSection_legalPageId_fkey" FOREIGN KEY ("legalPageId") REFERENCES "LegalPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
