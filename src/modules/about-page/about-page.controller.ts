import type { Request, Response } from "express";
import {
    createGalleryImage,
    createGoal,
    deleteGalleryImage,
    deleteGoal,
    getAboutPage,
    getGalleryImageById,
    getGoalById,
    listGalleryImages,
    listGoals,
    updateGalleryImage,
    updateGoal,
    upsertAboutPage,
} from "./about-page.service.js";
import {
    validateAboutPageInput,
    validateGalleryImageInput,
    validateGoalInput,
} from "./about-page.validation.js";
import { pick, pickNullable, resolveLang } from "../../lib/localize.js";

export async function getAdminAboutPageController(_req: Request, res: Response) {
    try {
        const page = await getAboutPage();

        if (!page) {
            return res.status(404).json({ message: "About page content not set" });
        }

        return res.json(page);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function getPublicAboutPageController(req: Request, res: Response) {
    try {
        const page = await getAboutPage();

        if (!page) {
            return res.status(404).json({ message: "About page content not set" });
        }

        const lang = resolveLang(req.query);

        return res.json({
            id: page.id,
            title: pick(page.title, page.titleEn, lang),
            description: pick(page.description, page.descriptionEn, lang),
            longDescription: pickNullable(page.longDescription, page.longDescriptionEn, lang),
            sede: page.sede,
            legalForm: pick(page.legalForm, page.legalFormEn, lang),
            updatedAt: page.updatedAt,
        });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function updateAboutPageController(req: Request, res: Response) {
    try {
        const { title, titleEn, description, descriptionEn, longDescription, longDescriptionEn, sede, legalForm, legalFormEn } = req.body;

        const validationError = validateAboutPageInput({ title, description, sede, legalForm });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const page = await upsertAboutPage({
            title,
            titleEn,
            description,
            descriptionEn,
            longDescription,
            longDescriptionEn,
            sede,
            legalForm,
            legalFormEn,
        });

        return res.json(page);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function listGalleryImagesController(_req: Request, res: Response) {
    try {
        const images = await listGalleryImages();
        return res.json(images);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function createGalleryImageController(req: Request, res: Response) {
    try {
        const { caption } = req.body;

        const validationError = validateGalleryImageInput({ caption });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const image = `/uploads/about-gallery/${req.file.filename}`;
        const created = await createGalleryImage(image, caption);

        return res.status(201).json(created);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function updateGalleryImageController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const existing = await getGalleryImageById(id);

        if (!existing) {
            return res.status(404).json({ message: "Gallery image not found" });
        }

        const { caption } = req.body;

        const validationError = validateGalleryImageInput({ caption: caption ?? existing.caption });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const image = req.file ? `/uploads/about-gallery/${req.file.filename}` : undefined;

        const updated = await updateGalleryImage(id, {
            caption,
            ...(image ? { image } : {}),
        });

        return res.json(updated);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function deleteGalleryImageController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const existing = await getGalleryImageById(id);

        if (!existing) {
            return res.status(404).json({ message: "Gallery image not found" });
        }

        await deleteGalleryImage(id);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function listGoalsAdminController(_req: Request, res: Response) {
    try {
        const goals = await listGoals();
        return res.json(goals);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function listGoalsPublicController(req: Request, res: Response) {
    try {
        const goals = await listGoals();
        const lang = resolveLang(req.query);

        return res.json(
            goals.map((goal) => ({
                id: goal.id,
                title: pick(goal.title, goal.titleEn, lang),
                text: pick(goal.text, goal.textEn, lang),
                createdAt: goal.createdAt,
                updatedAt: goal.updatedAt,
            }))
        );
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function createGoalController(req: Request, res: Response) {
    try {
        const { title, titleEn, text, textEn } = req.body;

        const validationError = validateGoalInput({ title, text });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const created = await createGoal({ title, titleEn, text, textEn });

        return res.status(201).json(created);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function updateGoalController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const existing = await getGoalById(id);

        if (!existing) {
            return res.status(404).json({ message: "Goal not found" });
        }

        const { title, titleEn, text, textEn } = req.body;

        const validationError = validateGoalInput({
            title: title ?? existing.title,
            text: text ?? existing.text,
        });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const updated = await updateGoal(id, { title, titleEn, text, textEn });

        return res.json(updated);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function deleteGoalController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const existing = await getGoalById(id);

        if (!existing) {
            return res.status(404).json({ message: "Goal not found" });
        }

        await deleteGoal(id);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}
