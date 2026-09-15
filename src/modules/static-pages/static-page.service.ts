import prisma from "../../lib/prisma.js";
import { sanitizeRichText } from "../../lib/sanitize.js";

export const STATIC_PAGE_SLUGS = {
    "terms-and-conditions": "TERMS_AND_CONDITIONS",
    "cookies": "COOKIES",
    "about-us": "ABOUT_US"
} as const;

export type StaticPageSlug = keyof typeof STATIC_PAGE_SLUGS;

export function resolveStaticPageKey(slug: string) {
    return STATIC_PAGE_SLUGS[slug as StaticPageSlug];
}

export async function getStaticPageByKey(key: string) {
    return prisma.staticPage.findUnique({
        where: { key: key as never }
    });
}

export async function listStaticPages() {
    return prisma.staticPage.findMany({
        orderBy: { key: "asc" }
    });
}

export async function upsertStaticPage(key: string, content: string) {
    const sanitizedContent = sanitizeRichText(content);

    return prisma.staticPage.upsert({
        where: { key: key as never },
        update: { content: sanitizedContent },
        create: { key: key as never, content: sanitizedContent }
    });
}
