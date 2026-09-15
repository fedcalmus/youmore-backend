import type { Request, Response } from "express";
import { getContactInfo, upsertContactInfo } from "./contact.service.js";
import { validateContactInfoInput } from "./contact.validation.js";

export async function getContactInfoController(_req: Request, res: Response) {
    try {
        const contact = await getContactInfo();

        if (!contact) {
            return res.status(404).json({ message: "Contact information not set" });
        }

        return res.json(contact);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function updateContactInfoController(req: Request, res: Response) {
    try {
        const { address, phone, email, instagram, facebook, linkedin } = req.body;

        const validationError = validateContactInfoInput({
            address,
            phone,
            email,
            instagram,
            facebook,
            linkedin,
        });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const contact = await upsertContactInfo({
            address,
            phone,
            email,
            instagram: instagram || null,
            facebook: facebook || null,
            linkedin: linkedin || null,
        });

        return res.json(contact);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}
