import prisma from "../../lib/prisma.js";

export async function createFinancingEntity(
    name: string,
    image: string,
    url: string
) {
    return prisma.financingEntity.create({
        data: {
            name,
            image,
            url,
        },
    });
}

export async function listFinancingEntities() {
    return prisma.financingEntity.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function getFinancingEntityById(id: number) {
    return prisma.financingEntity.findUnique({
        where: { id },
    });
}

export async function updateFinancingEntity(
    id: number,
    data: { name?: string; url?: string; image?: string }
) {
    return prisma.financingEntity.update({
        where: { id },
        data,
    });
}

export async function deleteFinancingEntity(id: number) {
    return prisma.financingEntity.delete({
        where: { id },
    });
}
