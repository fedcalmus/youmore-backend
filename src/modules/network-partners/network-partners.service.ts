import prisma from "../../lib/prisma.js";
import { withAutoTranslate } from "../../lib/translate.js";

export async function listNetworkPartners() {
    return prisma.networkPartner.findMany({
        orderBy: { createdAt: "asc" },
    });
}

export async function getNetworkPartnerById(id: number) {
    return prisma.networkPartner.findUnique({
        where: { id },
    });
}

export async function createNetworkPartner(data: {
    title: string;
    titleEn?: string;
    subtitle?: string | null;
    subtitleEn?: string;
    image?: string | null;
}) {
    const translated = await withAutoTranslate(data, ["title", "subtitle"]);

    return prisma.networkPartner.create({
        data: {
            title: data.title,
            titleEn: translated.titleEn ?? null,
            subtitle: data.subtitle ?? null,
            subtitleEn: translated.subtitleEn ?? null,
            image: data.image ?? null,
        },
    });
}

export async function updateNetworkPartner(
    id: number,
    data: {
        title?: string;
        titleEn?: string;
        subtitle?: string | null;
        subtitleEn?: string;
        image?: string;
    }
) {
    const translated = await withAutoTranslate(data, ["title", "subtitle"]);

    return prisma.networkPartner.update({
        where: { id },
        data: {
            title: data.title,
            titleEn: translated.titleEn,
            subtitle: data.subtitle,
            subtitleEn: translated.subtitleEn,
            image: data.image,
        },
    });
}

export async function deleteNetworkPartner(id: number) {
    return prisma.networkPartner.delete({
        where: { id },
    });
}
