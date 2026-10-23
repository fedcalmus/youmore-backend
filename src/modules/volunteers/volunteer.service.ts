import prisma from "../../lib/prisma.js";
import type { PaginationRequest } from "../../lib/pagination.js";

export interface VolunteerApplicationInput {
    projectId: number;
    name: string;
    surname: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    citizenship: string;
    city: string;
    dateOfBirth: Date;
    email: string;
    phoneNumber: string;
    hasPassport: boolean;
    travelDocumentValidForCountry: boolean | null;
    motivation: string;
    isFirstExperience: boolean;
    howDidYouFindUs: string;
    emergencyContact: string;
    specialNeeds?: string | null;
    tshirtSize: "XS" | "S" | "M" | "L" | "XL" | "XXL";
    emailGroupConsent: boolean;
    personalDataConsent: boolean;
}

export async function createVolunteerApplication(input: VolunteerApplicationInput) {
    return prisma.volunteerApplication.create({
        data: {
            ...input,
            consentTimestamp: new Date(),
        },
        select: { id: true, createdAt: true },
    });
}

const listSelect = {
    id: true,
    name: true,
    surname: true,
    email: true,
    phoneNumber: true,
    city: true,
    citizenship: true,
    createdAt: true,
    project: {
        select: { id: true, title: true, slug: true },
    },
} as const;

export interface VolunteerListFilters {
    search: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
    projectId?: number;
}

function buildVolunteerWhere(filters: Pick<VolunteerListFilters, "search" | "projectId">) {
    return {
        ...(filters.projectId ? { projectId: filters.projectId } : {}),
        ...(filters.search
            ? {
                  OR: [
                      { name: { contains: filters.search, mode: "insensitive" as const } },
                      { surname: { contains: filters.search, mode: "insensitive" as const } },
                      { email: { contains: filters.search, mode: "insensitive" as const } },
                      { city: { contains: filters.search, mode: "insensitive" as const } },
                      { citizenship: { contains: filters.search, mode: "insensitive" as const } },
                      { phoneNumber: { contains: filters.search, mode: "insensitive" as const } },
                  ],
              }
            : {}),
    };
}

export async function listVolunteerApplications(pagination: PaginationRequest, filters: VolunteerListFilters) {
    const where = buildVolunteerWhere(filters);

    const [items, totalItems] = await Promise.all([
        prisma.volunteerApplication.findMany({
            where,
            select: listSelect,
            orderBy: { [filters.sortBy]: filters.sortOrder },
            skip: pagination.skip,
            take: pagination.take,
        }),
        prisma.volunteerApplication.count({ where }),
    ]);

    return { items, totalItems };
}

const exportVolunteerSelect = {
    name: true,
    surname: true,
    email: true,
    phoneNumber: true,
    city: true,
    citizenship: true,
    gender: true,
    dateOfBirth: true,
    tshirtSize: true,
    createdAt: true,
    project: { select: { title: true } },
} as const;

export async function listVolunteerApplicationsForExport(filters: VolunteerListFilters) {
    const where = buildVolunteerWhere(filters);

    return prisma.volunteerApplication.findMany({
        where,
        select: exportVolunteerSelect,
        orderBy: { [filters.sortBy]: filters.sortOrder },
    });
}

export async function getVolunteerApplicationById(id: number) {
    return prisma.volunteerApplication.findUnique({
        where: { id },
        include: {
            project: {
                select: { id: true, title: true, slug: true, scope: true },
            },
        },
    });
}
