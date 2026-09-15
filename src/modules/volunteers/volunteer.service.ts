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
    travelDocumentValidForCountry: boolean;
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

export async function listVolunteerApplications(pagination: PaginationRequest) {
    const [items, totalItems] = await Promise.all([
        prisma.volunteerApplication.findMany({
            select: listSelect,
            orderBy: { createdAt: "desc" },
            skip: pagination.skip,
            take: pagination.take,
        }),
        prisma.volunteerApplication.count(),
    ]);

    return { items, totalItems };
}

export async function getVolunteerApplicationById(id: number) {
    return prisma.volunteerApplication.findUnique({
        where: { id },
        include: {
            project: {
                select: { id: true, title: true, slug: true, status: true },
            },
        },
    });
}
