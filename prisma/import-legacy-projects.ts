import "dotenv/config";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import prisma from "../src/lib/prisma.js";
import { createProject, createProjectImage } from "../src/modules/projects/project.service.js";
import { createCard } from "../src/modules/testimonials-page/testimonials-page.service.js";

interface LegacyProject {
    sourceUrl: string;
    category: "Scambio giovanile" | "Training course";
    title: string;
    startDate: string;
    endDate: string;
    location: string;
    whoCanJoin: string | null;
    shortDescription: string;
    description: string;
    mainImage: string;
    gallery: string[];
    testimonial: { quote: string; author: string } | null;
}

function extensionFor(url: string, contentType: string | null): string {
    const fromUrl = path.extname(new URL(url).pathname).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(fromUrl)) return fromUrl;
    if (contentType?.includes("png")) return ".png";
    if (contentType?.includes("webp")) return ".webp";
    if (contentType?.includes("gif")) return ".gif";
    return ".jpg";
}

async function downloadImage(url: string, folder: string): Promise<string> {
    let res = await fetch(url);
    if (!res.ok) {
        // Some old-site filenames are stored with NFD-normalized Unicode (e.g. "a" + combining
        // diaeresis) on disk, so the NFC-looking URL in the post HTML 404s — retry normalized.
        res = await fetch(url.normalize("NFD"));
    }
    if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());

    const dir = path.join(process.cwd(), "uploads", folder);
    fs.mkdirSync(dir, { recursive: true });

    const filename = `${crypto.randomUUID()}${extensionFor(url, res.headers.get("content-type"))}`;
    fs.writeFileSync(path.join(dir, filename), buffer);

    return `/uploads/${folder}/${filename}`;
}

async function wipeExistingProjects() {
    await prisma.volunteerApplication.deleteMany({});
    await prisma.project.deleteMany({});
    console.log("Cleared existing projects, images (cascaded) and volunteer applications.");
}

async function main() {
    const dataPath = path.join(process.cwd(), "prisma", "legacy-projects-data.json");
    const entries: LegacyProject[] = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    await wipeExistingProjects();

    const maxOrder = await prisma.testimonialCard.aggregate({ _max: { order: true } });
    let nextOrder = (maxOrder._max.order ?? 0) + 1;

    for (const entry of entries) {
        console.log(`Importing: ${entry.title}`);

        const mainImagePath = await downloadImage(entry.mainImage, "projects");

        const project = await createProject({
            title: entry.title,
            shortDescription: entry.shortDescription,
            description: entry.description,
            mainImage: mainImagePath,
            category: entry.category,
            scope: "INTERNAZIONALE",
            location: entry.location,
            startDate: new Date(entry.startDate),
            endDate: new Date(entry.endDate),
            whoCanJoin: entry.whoCanJoin ?? undefined,
        });

        for (const imageUrl of entry.gallery) {
            const galleryPath = await downloadImage(imageUrl, "project-gallery");
            await createProjectImage(project.id, galleryPath, null);
        }

        if (entry.testimonial) {
            await createCard({
                order: nextOrder++,
                variant: "LIGHT",
                tag: `${entry.category} · ${entry.location}`,
                quote: entry.testimonial.quote,
                author: entry.testimonial.author,
                status: "APPROVED",
                projectId: project.id,
            });
        }
    }

    console.log(`Imported ${entries.length} legacy projects.`);
    await prisma.$disconnect();
}

main().catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
});
