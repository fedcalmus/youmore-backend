import prisma from "../../lib/prisma.js";

export async function createTeamMember(data: {
    name: string;
    surname: string;
    role?: string;
    email: string;
    phoneNumber: string;
    image?: string;
}) {
    return prisma.teamMember.create({ data });
}

export async function listTeamMembers() {
    return prisma.teamMember.findMany({
        orderBy: { createdAt: "asc" },
    });
}

export interface TeamMemberListFilters {
    search: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
}

function buildTeamMemberWhere(filters: Pick<TeamMemberListFilters, "search">) {
    return filters.search
        ? {
              OR: [
                  { name: { contains: filters.search, mode: "insensitive" as const } },
                  { surname: { contains: filters.search, mode: "insensitive" as const } },
                  { role: { contains: filters.search, mode: "insensitive" as const } },
                  { email: { contains: filters.search, mode: "insensitive" as const } },
              ],
          }
        : {};
}

export async function listTeamMembersAdmin(filters: TeamMemberListFilters) {
    return prisma.teamMember.findMany({
        where: buildTeamMemberWhere(filters),
        orderBy: { [filters.sortBy]: filters.sortOrder },
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
        role?: string | null;
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
