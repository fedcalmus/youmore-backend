import prisma from "../../lib/prisma.js";

export async function getContactInfo() {
    return prisma.contactInfo.findFirst();
}

export async function upsertContactInfo(data: {
    address: string;
    phone: string;
    email: string;
    instagram?: string | null;
    facebook?: string | null;
    linkedin?: string | null;
}) {
    const existing = await prisma.contactInfo.findFirst();

    if (!existing) {
        return prisma.contactInfo.create({ data });
    }

    return prisma.contactInfo.update({
        where: { id: existing.id },
        data,
    });
}
