import prisma from "../../lib/prisma.js";
import { sanitizeRichText } from "../../lib/sanitize.js";
import { withAutoTranslate } from "../../lib/translate.js";

export async function getAboutPage() {
    return prisma.aboutPage.findFirst();
}

export async function upsertAboutPage(data: {
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
    longDescription?: string | null;
    longDescriptionEn?: string | null;
    sede: string;
    legalForm: string;
    legalFormEn?: string;
}) {
    const translated = await withAutoTranslate(data, ["title", "description", "longDescription", "legalForm"]);

    const payload = {
        title: data.title,
        titleEn: translated.titleEn ?? null,
        description: sanitizeRichText(data.description),
        descriptionEn: translated.descriptionEn ? sanitizeRichText(translated.descriptionEn) : null,
        longDescription: data.longDescription ? sanitizeRichText(data.longDescription) : null,
        longDescriptionEn: translated.longDescriptionEn ? sanitizeRichText(translated.longDescriptionEn) : null,
        sede: data.sede,
        legalForm: data.legalForm,
        legalFormEn: translated.legalFormEn ?? null,
    };
    const existing = await prisma.aboutPage.findFirst();

    if (!existing) {
        return prisma.aboutPage.create({ data: payload });
    }

    return prisma.aboutPage.update({
        where: { id: existing.id },
        data: payload,
    });
}

export async function listGalleryImages() {
    return prisma.aboutGalleryImage.findMany({
        orderBy: { createdAt: "asc" },
    });
}

export async function getGalleryImageById(id: number) {
    return prisma.aboutGalleryImage.findUnique({
        where: { id },
    });
}

export async function createGalleryImage(image: string, caption: string) {
    return prisma.aboutGalleryImage.create({
        data: { image, caption },
    });
}

export async function updateGalleryImage(
    id: number,
    data: { image?: string; caption?: string }
) {
    return prisma.aboutGalleryImage.update({
        where: { id },
        data,
    });
}

export async function deleteGalleryImage(id: number) {
    return prisma.aboutGalleryImage.delete({
        where: { id },
    });
}

export async function listGoals() {
    return prisma.aboutGoal.findMany({
        orderBy: { createdAt: "asc" },
    });
}

export async function getGoalById(id: number) {
    return prisma.aboutGoal.findUnique({
        where: { id },
    });
}

export async function createGoal(data: { title: string; titleEn?: string; text: string; textEn?: string }) {
    const translated = await withAutoTranslate(data, ["title", "text"]);

    return prisma.aboutGoal.create({
        data: {
            title: data.title,
            titleEn: translated.titleEn ?? null,
            text: data.text,
            textEn: translated.textEn ?? null,
        },
    });
}

export async function updateGoal(
    id: number,
    data: { title?: string; titleEn?: string; text?: string; textEn?: string }
) {
    const translated = await withAutoTranslate(data, ["title", "text"]);

    return prisma.aboutGoal.update({
        where: { id },
        data: {
            title: data.title,
            titleEn: translated.titleEn,
            text: data.text,
            textEn: translated.textEn,
        },
    });
}

export async function deleteGoal(id: number) {
    return prisma.aboutGoal.delete({
        where: { id },
    });
}
