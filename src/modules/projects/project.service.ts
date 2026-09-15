import prisma from "../../lib/prisma.js";
import { slugify } from "../../lib/slug.js";
import type { PaginationRequest } from "../../lib/pagination.js";

const publicProjectSelect = {
    id: true,
    title: true,
    slug: true,
    shortDescription: true,
    description: true,
    mainImage: true,
    documentUrl: true,
    projectCode: true,
    category: true,
    status: true,
    location: true,
    startDate: true,
    endDate: true,
    beneficiaries: true,
    funding: true,
    richContent: true,
    createdAt: true,
    updatedAt: true,
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

export interface ProjectInput {
    title: string;
    shortDescription: string;
    description: string;
    mainImage: string;
    documentUrl?: string | null;
    projectCode?: string | null;
    category?: string | null;
    status?: "ACTIVE" | "COMPLETED";
    location?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    beneficiaries?: string | null;
    funding?: string | null;
    richContent?: Record<string, string>;
}

export async function createProject(input: ProjectInput) {
    const slug = await generateUniqueSlug(input.title);

    return prisma.project.create({
        data: {
            title: input.title,
            slug,
            shortDescription: input.shortDescription,
            description: input.description,
            mainImage: input.mainImage,
            documentUrl: input.documentUrl ?? null,
            projectCode: input.projectCode ?? null,
            category: input.category ?? null,
            status: input.status ?? "ACTIVE",
            location: input.location ?? null,
            startDate: input.startDate ?? null,
            endDate: input.endDate ?? null,
            beneficiaries: input.beneficiaries ?? null,
            funding: input.funding ?? null,
            richContent: input.richContent ?? undefined,
        },
    });
}

export async function updateProject(id: number, input: Partial<ProjectInput>) {
    return prisma.project.update({
        where: { id },
        data: input,
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

export async function listProjectsAdmin(pagination: PaginationRequest) {
    const where = { deletedAt: null };

    const [items, totalItems] = await Promise.all([
        prisma.project.findMany({
            where,
            select: adminProjectListSelect,
            orderBy: { createdAt: "desc" },
            skip: pagination.skip,
            take: pagination.take,
        }),
        prisma.project.count({ where }),
    ]);

    return { items, totalItems };
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
