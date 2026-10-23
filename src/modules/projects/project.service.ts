import prisma from "../../lib/prisma.js";
import { slugify } from "../../lib/slug.js";
import { sanitizeRichText } from "../../lib/sanitize.js";
import { withAutoTranslate } from "../../lib/translate.js";
import type { PaginationRequest } from "../../lib/pagination.js";

const projectImagesSelect = {
    images: {
        select: { id: true, image: true, caption: true },
        orderBy: { createdAt: "asc" },
    },
} as const;

const projectTestimonialsSelect = {
    testimonialCards: {
        where: { status: "APPROVED" as const },
        select: { id: true, order: true, variant: true, tag: true, quote: true, author: true, videoUrl: true },
        orderBy: { order: "asc" as const },
    },
} as const;

const publicProjectSelect = {
    id: true,
    title: true,
    titleEn: true,
    slug: true,
    shortDescription: true,
    shortDescriptionEn: true,
    description: true,
    descriptionEn: true,
    mainImage: true,
    documentUrl: true,
    category: true,
    scope: true,
    location: true,
    locationEn: true,
    startDate: true,
    endDate: true,
    whoCanJoin: true,
    whoCanJoinEn: true,
    createdAt: true,
    updatedAt: true,
    ...projectImagesSelect,
    ...projectTestimonialsSelect,
} as const;

const adminProjectListSelect = {
    ...publicProjectSelect,
    _count: {
        select: { volunteerApplications: true },
    },
} as const;

export async function generateUniqueSlug(title: string, excludeId?: number) {
    const base = slugify(title) || "project";
    let candidate = base;
    let suffix = 1;

    while (true) {
        const existing = await prisma.project.findUnique({
            where: { slug: candidate },
            select: { id: true },
        });

        if (!existing || existing.id === excludeId) {
            return candidate;
        }

        suffix += 1;
        candidate = `${base}-${suffix}`;
    }
}

export type ProjectInput = {
    title: string;
    titleEn?: string;
    shortDescription: string;
    shortDescriptionEn?: string;
    description: string;
    descriptionEn?: string;
    mainImage: string;
    documentUrl?: string | null;
    category?: string | null;
    scope?: "NAZIONALE" | "INTERNAZIONALE";
    location?: string | null;
    locationEn?: string;
    startDate?: Date | null;
    endDate?: Date | null;
    whoCanJoin?: string | null;
    whoCanJoinEn?: string;
};

const TRANSLATABLE_PROJECT_FIELDS = ["title", "shortDescription", "description", "location", "whoCanJoin"] as const;

export async function createProject(input: ProjectInput) {
    const slug = await generateUniqueSlug(input.title);
    const translated = await withAutoTranslate(input, TRANSLATABLE_PROJECT_FIELDS);

    return prisma.project.create({
        data: {
            title: input.title,
            titleEn: translated.titleEn ?? null,
            slug,
            shortDescription: input.shortDescription,
            shortDescriptionEn: translated.shortDescriptionEn ?? null,
            description: sanitizeRichText(input.description),
            descriptionEn: translated.descriptionEn ? sanitizeRichText(translated.descriptionEn) : null,
            mainImage: input.mainImage,
            documentUrl: input.documentUrl ?? null,
            category: input.category ?? null,
            scope: input.scope ?? "NAZIONALE",
            location: input.location ?? null,
            locationEn: translated.locationEn ?? null,
            startDate: input.startDate ?? null,
            endDate: input.endDate ?? null,
            whoCanJoin: input.whoCanJoin ?? null,
            whoCanJoinEn: translated.whoCanJoinEn ?? null,
        },
    });
}

export async function updateProject(id: number, input: Partial<ProjectInput>) {
    const translated = await withAutoTranslate(input, TRANSLATABLE_PROJECT_FIELDS);

    const data: Record<string, unknown> = { ...input };

    for (const field of TRANSLATABLE_PROJECT_FIELDS) {
        const enKey = `${field}En`;
        if (enKey in translated) data[enKey] = translated[enKey] ?? null;
    }

    if (data.description !== undefined) data.description = sanitizeRichText(data.description as string);
    if (data.descriptionEn) data.descriptionEn = sanitizeRichText(data.descriptionEn as string);

    return prisma.project.update({
        where: { id },
        data,
    });
}

export async function softDeleteProject(id: number) {
    return prisma.project.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
}

export async function getProjectByIdForAdmin(id: number) {
    return prisma.project.findFirst({
        where: { id, deletedAt: null },
        select: adminProjectListSelect,
    });
}

export async function getProjectEntityById(id: number) {
    return prisma.project.findFirst({
        where: { id, deletedAt: null },
    });
}

export async function getProjectBySlugPublic(slug: string) {
    return prisma.project.findFirst({
        where: { slug, deletedAt: null },
        select: publicProjectSelect,
    });
}

export async function listProjectsPublic(pagination: PaginationRequest) {
    const where = { deletedAt: null };

    const [items, totalItems] = await Promise.all([
        prisma.project.findMany({
            where,
            select: publicProjectSelect,
            orderBy: { createdAt: "desc" },
            skip: pagination.skip,
            take: pagination.take,
        }),
        prisma.project.count({ where }),
    ]);

    return { items, totalItems };
}

export interface ProjectListFilters {
    search: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
    scope?: string;
    category?: string;
}

function buildProjectWhere(filters: Pick<ProjectListFilters, "search" | "scope" | "category">) {
    return {
        deletedAt: null,
        ...(filters.scope ? { scope: filters.scope as "NAZIONALE" | "INTERNAZIONALE" } : {}),
        ...(filters.category ? { category: filters.category } : {}),
        ...(filters.search
            ? {
                  OR: [
                      { title: { contains: filters.search, mode: "insensitive" as const } },
                      { shortDescription: { contains: filters.search, mode: "insensitive" as const } },
                      { location: { contains: filters.search, mode: "insensitive" as const } },
                  ],
              }
            : {}),
    };
}

export async function listProjectsAdmin(pagination: PaginationRequest, filters: ProjectListFilters) {
    const where = buildProjectWhere(filters);

    const [items, totalItems] = await Promise.all([
        prisma.project.findMany({
            where,
            select: adminProjectListSelect,
            orderBy: { [filters.sortBy]: filters.sortOrder },
            skip: pagination.skip,
            take: pagination.take,
        }),
        prisma.project.count({ where }),
    ]);

    return { items, totalItems };
}

const exportProjectSelect = {
    title: true,
    shortDescription: true,
    category: true,
    scope: true,
    location: true,
    startDate: true,
    endDate: true,
    whoCanJoin: true,
    createdAt: true,
    _count: { select: { volunteerApplications: true } },
} as const;

export async function listProjectsForExport(filters: ProjectListFilters) {
    const where = buildProjectWhere(filters);

    return prisma.project.findMany({
        where,
        select: exportProjectSelect,
        orderBy: { [filters.sortBy]: filters.sortOrder },
    });
}

const volunteerListSelect = {
    id: true,
    name: true,
    surname: true,
    email: true,
    phoneNumber: true,
    city: true,
    citizenship: true,
    createdAt: true,
} as const;

export async function listProjectVolunteers(
    projectId: number,
    pagination: PaginationRequest
) {
    const where = { projectId };

    const [items, totalItems] = await Promise.all([
        prisma.volunteerApplication.findMany({
            where,
            select: volunteerListSelect,
            orderBy: { createdAt: "desc" },
            skip: pagination.skip,
            take: pagination.take,
        }),
        prisma.volunteerApplication.count({ where }),
    ]);

    return { items, totalItems };
}

export async function getProjectImageById(id: number) {
    return prisma.projectImage.findUnique({
        where: { id },
    });
}

export async function createProjectImage(projectId: number, image: string, caption?: string | null) {
    return prisma.projectImage.create({
        data: { projectId, image, caption: caption ?? null },
    });
}

export async function updateProjectImage(
    id: number,
    data: { image?: string; caption?: string | null }
) {
    return prisma.projectImage.update({
        where: { id },
        data,
    });
}

export async function deleteProjectImage(id: number) {
    return prisma.projectImage.delete({
        where: { id },
    });
}
