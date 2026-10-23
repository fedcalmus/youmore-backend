import prisma from "../../lib/prisma.js";
import { sanitizeRichText } from "../../lib/sanitize.js";

export async function getHomePage() {
    return prisma.homePage.findFirst();
}

export async function upsertHomePage(data: {
    stepsEyebrow: string;
    stepsTitle: string;
    aboutTeaserEyebrow: string;
    aboutTeaserTitle: string;
    aboutTeaserText: string;
    testimonialsEyebrow: string;
    testimonialsTitle: string;
    fundersEyebrow: string;
    fundersIntroText: string;
}) {
    const payload = {
        ...data,
        aboutTeaserText: sanitizeRichText(data.aboutTeaserText),
    };

    const existing = await prisma.homePage.findFirst();

    if (!existing) {
        return prisma.homePage.create({ data: payload });
    }

    return prisma.homePage.update({
        where: { id: existing.id },
        data: payload,
    });
}

export async function listSteps() {
    return prisma.homeStep.findMany({
        orderBy: { order: "asc" },
    });
}

export async function getStepById(id: number) {
    return prisma.homeStep.findUnique({ where: { id } });
}

export async function createStep(data: { order: number; title: string; text: string }) {
    return prisma.homeStep.create({ data });
}

export async function updateStep(id: number, data: { order?: number; title?: string; text?: string }) {
    return prisma.homeStep.update({
        where: { id },
        data,
    });
}

export async function deleteStep(id: number) {
    return prisma.homeStep.delete({ where: { id } });
}

export async function listTestimonials() {
    return prisma.homeTestimonial.findMany({
        orderBy: { order: "asc" },
    });
}

export async function getTestimonialById(id: number) {
    return prisma.homeTestimonial.findUnique({ where: { id } });
}

export async function createTestimonial(data: {
    order: number;
    quote: string;
    name: string;
    context: string;
    variant: string;
}) {
    return prisma.homeTestimonial.create({
        data: { ...data, quote: sanitizeRichText(data.quote) },
    });
}

export async function updateTestimonial(
    id: number,
    data: { order?: number; quote?: string; name?: string; context?: string; variant?: string }
) {
    return prisma.homeTestimonial.update({
        where: { id },
        data: {
            ...data,
            quote: data.quote !== undefined ? sanitizeRichText(data.quote) : undefined,
        },
    });
}

export async function deleteTestimonial(id: number) {
    return prisma.homeTestimonial.delete({ where: { id } });
}

export async function listGalleryImages() {
    return prisma.homeGalleryImage.findMany();
}

export async function getGalleryImageBySlot(slot: "GROUP" | "ACTIVITY" | "TRAVEL") {
    return prisma.homeGalleryImage.findUnique({ where: { slot } });
}

export async function upsertGalleryImage(
    slot: "GROUP" | "ACTIVITY" | "TRAVEL",
    data: { image?: string; caption?: string | null }
) {
    const existing = await prisma.homeGalleryImage.findUnique({ where: { slot } });

    if (!existing) {
        return prisma.homeGalleryImage.create({
            data: {
                slot,
                image: data.image as string,
                caption: data.caption ?? null,
            },
        });
    }

    return prisma.homeGalleryImage.update({
        where: { slot },
        data: {
            ...(data.image ? { image: data.image } : {}),
            ...(data.caption !== undefined ? { caption: data.caption } : {}),
        },
    });
}
