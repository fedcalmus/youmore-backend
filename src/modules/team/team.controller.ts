import type { Request, Response } from "express";
import {
    createTeamMember,
    deleteTeamMember,
    getTeamMemberById,
    listTeamMembers,
    listTeamMembersAdmin,
    updateTeamMember,
} from "./team.service.js";
import { validateTeamMemberInput } from "./team.validation.js";
import { parseListQuery } from "../../lib/query.js";
import { toCsv } from "../../lib/csv.js";

const TEAM_SORT_FIELDS = ["name", "surname", "role", "createdAt"] as const;

export async function createTeamMemberController(req: Request, res: Response) {
    try {
        const { name, surname, role, email, phoneNumber } = req.body;

        const validationError = validateTeamMemberInput({
            name,
            surname,
            role,
            email,
            phoneNumber,
        });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const image = req.file ? `/uploads/team/${req.file.filename}` : undefined;

        const member = await createTeamMember({
            name,
            surname,
            role: role || undefined,
            email,
            phoneNumber,
            image,
        });

        return res.status(201).json(member);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function listTeamMembersController(_req: Request, res: Response) {
    try {
        const members = await listTeamMembers();
        return res.json(members);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function listTeamMembersAdminController(req: Request, res: Response) {
    try {
        const filters = parseListQuery(req.query, TEAM_SORT_FIELDS, "createdAt");
        const members = await listTeamMembersAdmin(filters);
        return res.json(members);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function exportTeamMembersController(req: Request, res: Response) {
    try {
        const filters = parseListQuery(req.query, TEAM_SORT_FIELDS, "createdAt");
        const members = await listTeamMembersAdmin(filters);

        const csv = toCsv(
            members.map((m) => ({
                name: m.name,
                surname: m.surname,
                role: m.role ?? "",
                email: m.email,
                phoneNumber: m.phoneNumber,
            })),
            [
                { key: "name", header: "Name" },
                { key: "surname", header: "Surname" },
                { key: "role", header: "Role" },
                { key: "email", header: "Email" },
                { key: "phoneNumber", header: "Phone" },
            ]
        );

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", 'attachment; filename="team.csv"');
        return res.send(csv);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function getTeamMemberController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const member = await getTeamMemberById(id);

        if (!member) {
            return res.status(404).json({ message: "Team member not found" });
        }

        return res.json(member);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function updateTeamMemberController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const existing = await getTeamMemberById(id);

        if (!existing) {
            return res.status(404).json({ message: "Team member not found" });
        }

        const { name, surname, role, email, phoneNumber } = req.body;

        const validationError = validateTeamMemberInput({
            name: name ?? existing.name,
            surname: surname ?? existing.surname,
            role: role ?? existing.role,
            email: email ?? existing.email,
            phoneNumber: phoneNumber ?? existing.phoneNumber,
        });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const image = req.file ? `/uploads/team/${req.file.filename}` : undefined;

        const member = await updateTeamMember(id, {
            name,
            surname,
            role: role !== undefined ? (role || null) : undefined,
            email,
            phoneNumber,
            ...(image ? { image } : {}),
        });

        return res.json(member);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function deleteTeamMemberController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const existing = await getTeamMemberById(id);

        if (!existing) {
            return res.status(404).json({ message: "Team member not found" });
        }

        await deleteTeamMember(id);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}
