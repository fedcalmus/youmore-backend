import type { Request, Response } from "express";
import {
    createFinancingEntity,
    deleteFinancingEntity,
    getFinancingEntityById,
    listFinancingEntities,
    updateFinancingEntity,
} from "./financing-entity.service.js";
import { validateFinancingEntityInput } from "./financing-entity.validation.js";

export async function createFinancingEntityController(
    req: Request,
    res: Response
) {
    try {
        const { name, url } = req.body;

        const validationError = validateFinancingEntityInput({ name, url });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Image is required",
            });
        }

        const image = `/uploads/financing-entities/${req.file.filename}`;

        const entity = await createFinancingEntity(name, image, url);

        return res.status(201).json(entity);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function listFinancingEntitiesController(
    _req: Request,
    res: Response
) {
    try {
        const entities = await listFinancingEntities();
        return res.json(entities);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function getFinancingEntityController(
    req: Request,
    res: Response
) {
    try {
        const id = Number(req.params.id);
        const entity = await getFinancingEntityById(id);

        if (!entity) {
            return res.status(404).json({ message: "Financing entity not found" });
        }

        return res.json(entity);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function updateFinancingEntityController(
    req: Request,
    res: Response
) {
    try {
        const id = Number(req.params.id);
        const existing = await getFinancingEntityById(id);

        if (!existing) {
            return res.status(404).json({ message: "Financing entity not found" });
        }

        const { name, url } = req.body;

        const validationError = validateFinancingEntityInput({
            name: name ?? existing.name,
            url: url ?? existing.url,
        });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const image = req.file
            ? `/uploads/financing-entities/${req.file.filename}`
            : undefined;

        const entity = await updateFinancingEntity(id, {
            name,
            url,
            ...(image ? { image } : {}),
        });

        return res.json(entity);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function deleteFinancingEntityController(
    req: Request,
    res: Response
) {
    try {
        const id = Number(req.params.id);
        const existing = await getFinancingEntityById(id);

        if (!existing) {
            return res.status(404).json({ message: "Financing entity not found" });
        }

        await deleteFinancingEntity(id);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}
