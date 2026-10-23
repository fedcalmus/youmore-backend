import type { Request, Response } from "express";
import {
    createNetworkPartner,
    deleteNetworkPartner,
    getNetworkPartnerById,
    listNetworkPartners,
    updateNetworkPartner,
} from "./network-partners.service.js";
import { validateNetworkPartnerInput } from "./network-partners.validation.js";
import { pick, pickNullable, resolveLang } from "../../lib/localize.js";

export async function listNetworkPartnersAdminController(_req: Request, res: Response) {
    try {
        const partners = await listNetworkPartners();
        return res.json(partners);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function listNetworkPartnersPublicController(req: Request, res: Response) {
    try {
        const partners = await listNetworkPartners();
        const lang = resolveLang(req.query);

        return res.json(
            partners.map((partner) => ({
                id: partner.id,
                title: pick(partner.title, partner.titleEn, lang),
                subtitle: pickNullable(partner.subtitle, partner.subtitleEn, lang),
                image: partner.image,
            }))
        );
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function createNetworkPartnerController(req: Request, res: Response) {
    try {
        const { title, titleEn, subtitle, subtitleEn } = req.body;

        const validationError = validateNetworkPartnerInput({ title });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const image = req.file ? `/uploads/network-partners/${req.file.filename}` : null;

        const created = await createNetworkPartner({
            title,
            titleEn,
            subtitle: subtitle || null,
            subtitleEn,
            image,
        });

        return res.status(201).json(created);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function updateNetworkPartnerController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const existing = await getNetworkPartnerById(id);

        if (!existing) {
            return res.status(404).json({ message: "Network partner not found" });
        }

        const { title, titleEn, subtitle, subtitleEn } = req.body;

        const validationError = validateNetworkPartnerInput({ title: title ?? existing.title });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const image = req.file ? `/uploads/network-partners/${req.file.filename}` : undefined;

        const updated = await updateNetworkPartner(id, {
            title,
            titleEn,
            subtitle: subtitle !== undefined ? subtitle || null : undefined,
            subtitleEn,
            image,
        });

        return res.json(updated);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function deleteNetworkPartnerController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const existing = await getNetworkPartnerById(id);

        if (!existing) {
            return res.status(404).json({ message: "Network partner not found" });
        }

        await deleteNetworkPartner(id);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}
