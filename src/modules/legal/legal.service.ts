import prisma from "../../lib/prisma.js";
import { sanitizeRichText } from "../../lib/sanitize.js";
import type { CookieCategoryKeyValue } from "./legal.validation.js";

export async function getLegalPageByKey(key: string) {
    return prisma.legalPage.findUnique({
        where: { key: key as never },
        include: {
            sections: {
                orderBy: { order: "asc" }
            }
        }
    });
}

export async function upsertLegalPage(
    key: string,
    data: {
        title: string;
        intro: string;
        bannerTitle?: string | null;
        bannerText?: string | null;
    }
) {
    const payload = {
        title: data.title,
        intro: sanitizeRichText(data.intro),
        bannerTitle: data.bannerTitle ?? null,
        bannerText: data.bannerText ? sanitizeRichText(data.bannerText) : null
    };

    return prisma.legalPage.upsert({
        where: { key: key as never },
        update: payload,
        create: { key: key as never, ...payload }
    });
}

/** Sections have a required FK to LegalPage — this creates the parent row with sane defaults if it doesn't exist yet. */
export async function ensureLegalPage(key: string, defaultTitle: string) {
    const existing = await prisma.legalPage.findUnique({ where: { key: key as never } });

    if (existing) {
        return existing;
    }

    return prisma.legalPage.create({
        data: { key: key as never, title: defaultTitle, intro: "" }
    });
}

export async function listSections(legalPageId: number) {
    return prisma.legalSection.findMany({
        where: { legalPageId },
        orderBy: { order: "asc" }
    });
}

export async function getSectionById(id: number) {
    return prisma.legalSection.findUnique({ where: { id } });
}

export async function createSection(
    legalPageId: number,
    data: { order: number; title: string; content: string }
) {
    return prisma.legalSection.create({
        data: {
            legalPageId,
            order: data.order,
            title: data.title,
            content: sanitizeRichText(data.content)
        }
    });
}

export async function updateSection(
    id: number,
    data: { order?: number; title?: string; content?: string }
) {
    return prisma.legalSection.update({
        where: { id },
        data: {
            ...data,
            content: data.content !== undefined ? sanitizeRichText(data.content) : undefined
        }
    });
}

export async function deleteSection(id: number) {
    return prisma.legalSection.delete({ where: { id } });
}

export async function listCookieCategories() {
    return prisma.cookieCategory.findMany({ orderBy: { key: "asc" } });
}

export async function getCookieCategoryByKey(key: CookieCategoryKeyValue) {
    return prisma.cookieCategory.findUnique({ where: { key } });
}

export async function updateCookieCategory(
    key: CookieCategoryKeyValue,
    data: { name: string; purpose: string; duration: string }
) {
    return prisma.cookieCategory.upsert({
        where: { key },
        update: data,
        create: { key, ...data }
    });
}
