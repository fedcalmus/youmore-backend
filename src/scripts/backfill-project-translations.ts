import "dotenv/config";
import prisma from "../lib/prisma.js";
import { sanitizeRichText } from "../lib/sanitize.js";
import { withAutoTranslate } from "../lib/translate.js";

const TRANSLATABLE_FIELDS = ["title", "shortDescription", "description", "location", "whoCanJoin"] as const;

async function main() {
    const projects = await prisma.project.findMany({
        where: {
            deletedAt: null,
            OR: [
                { titleEn: null },
                { shortDescriptionEn: null },
                { descriptionEn: null },
                { location: { not: null }, locationEn: null },
                { whoCanJoin: { not: null }, whoCanJoinEn: null },
            ],
        },
    });

    console.log(`Found ${projects.length} project(s) missing an English translation.`);

    for (const project of projects) {
        const body = {
            title: project.title,
            titleEn: project.titleEn ?? undefined,
            shortDescription: project.shortDescription,
            shortDescriptionEn: project.shortDescriptionEn ?? undefined,
            description: project.description,
            descriptionEn: project.descriptionEn ?? undefined,
            location: project.location ?? undefined,
            locationEn: project.locationEn ?? undefined,
            whoCanJoin: project.whoCanJoin ?? undefined,
            whoCanJoinEn: project.whoCanJoinEn ?? undefined,
        };

        const translated = await withAutoTranslate(body, TRANSLATABLE_FIELDS);

        await prisma.project.update({
            where: { id: project.id },
            data: {
                titleEn: translated.titleEn ?? null,
                shortDescriptionEn: translated.shortDescriptionEn ?? null,
                descriptionEn: translated.descriptionEn ? sanitizeRichText(translated.descriptionEn) : null,
                locationEn: translated.locationEn ?? null,
                whoCanJoinEn: translated.whoCanJoinEn ?? null,
            },
        });

        console.log(`Translated project #${project.id} (${project.title})`);
    }

    console.log("Done.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
