import prisma from "../../lib/prisma.js";

export async function createTeamMember(data: {
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    image: string;
}) {
    return prisma.teamMember.create({ data });
}

export async function listTeamMembers() {
    return prisma.teamMember.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function getTeamMemberById(id: number) {
    return prisma.teamMember.findUnique({
        where: { id },
    });
}

export async function updateTeamMember(
    id: number,
    data: {
        name?: string;
        surname?: string;
        email?: string;
        phoneNumber?: string;
        image?: string;
    }
) {
    return prisma.teamMember.update({
        where: { id },
        data,
    });
}

export async function deleteTeamMember(id: number) {
    return prisma.teamMember.delete({
        where: { id },
    });
}
