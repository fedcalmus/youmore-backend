import prisma from "../../lib/prisma.js";
import { sanitizeRichText } from "../../lib/sanitize.js";

export async function getTestimonialsPage() {
    return prisma.testimonialsPage.findFirst();
}

export async function upsertTestimonialsPage(data: {
    heroEyebrow: string;
    heroQuote: string;
    heroName: string;
    heroCountry: string;
    heroContext: string;
    ctaText: string;
}) {
    const payload = {
        ...data,
        heroQuote: sanitizeRichText(data.heroQuote),
    };

    const existing = await prisma.testimonialsPage.findFirst();

    if (!existing) {
        return prisma.testimonialsPage.create({ data: payload });
    }

    return prisma.testimonialsPage.update({
        where: { id: existing.id },
        data: payload,
    });
}

export async function listAllCards() {
    return prisma.testimonialCard.findMany({
        orderBy: { order: "asc" },
    });
}

export async function listApprovedCards() {
    return prisma.testimonialCard.findMany({
        where: { status: "APPROVED" },
        orderBy: { order: "asc" },
    });
}

export async function getCardById(id: number) {
    return prisma.testimonialCard.findUnique({ where: { id } });
}

export async function createCard(data: {
    order: number;
    variant: "LIGHT" | "YELLOW" | "DARK" | "VIDEO";
    tag?: string | null;
    quote?: string | null;
    author: string;
    videoUrl?: string | null;
    status?: "PENDING" | "APPROVED";
    projectId?: number | null;
}) {
    return prisma.testimonialCard.create({
        data: {
            ...data,
            quote: data.quote ? sanitizeRichText(data.quote) : null,
        },
    });
}

export async function updateCard(
    id: number,
    data: {
        order?: number;
        variant?: "LIGHT" | "YELLOW" | "DARK" | "VIDEO";
        tag?: string | null;
        quote?: string | null;
        author?: string;
        videoUrl?: string | null;
        status?: "PENDING" | "APPROVED";
        projectId?: number | null;
    }
) {
    return prisma.testimonialCard.update({
        where: { id },
        data: {
            ...data,
            quote: data.quote !== undefined ? (data.quote ? sanitizeRichText(data.quote) : null) : undefined,
        },
    });
}

export async function deleteCard(id: number) {
    return prisma.testimonialCard.delete({ where: { id } });
}

export async function createPublicSubmission(data: { author: string; tag?: string | null; quote: string }) {
    const maxOrder = await prisma.testimonialCard.aggregate({ _max: { order: true } });
    const order = (maxOrder._max.order ?? 0) + 1;

    return prisma.testimonialCard.create({
        data: {
            order,
            variant: "LIGHT",
            status: "PENDING",
            tag: data.tag || null,
            quote: sanitizeRichText(data.quote),
            author: data.author,
        },
    });
}
