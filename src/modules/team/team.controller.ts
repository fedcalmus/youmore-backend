import type { Request, Response } from "express";
import {
    createTeamMember,
    deleteTeamMember,
    getTeamMemberById,
    listTeamMembers,
    updateTeamMember,
} from "./team.service.js";
import { validateTeamMemberInput } from "./team.validation.js";

export async function createTeamMemberController(req: Request, res: Response) {
    try {
        const { name, surname, email, phoneNumber } = req.body;

        const validationError = validateTeamMemberInput({
            name,
            surname,
            email,
            phoneNumber,
        });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const image = `/uploads/team/${req.file.filename}`;

        const member = await createTeamMember({
            name,
            surname,
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

        const { name, surname, email, phoneNumber } = req.body;

        const validationError = validateTeamMemberInput({
            name: name ?? existing.name,
            surname: surname ?? existing.surname,
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
