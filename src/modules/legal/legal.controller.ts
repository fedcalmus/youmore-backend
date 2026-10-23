import type { Request, Response } from "express";
import {
    createSection,
    deleteSection,
    ensureLegalPage,
    getLegalPageByKey,
    getSectionById,
    listCookieCategories,
    listSections,
    updateCookieCategory,
    updateSection,
    upsertLegalPage
} from "./legal.service.js";
import {
    isCookieCategoryKey,
    resolveLegalPageKey,
    validateCookieCategoryInput,
    validateLegalPageInput,
    validateLegalSectionInput
} from "./legal.validation.js";

function defaultTitleForKey(key: string) {
    return key === "PRIVACY_POLICY" ? "Privacy" : "Cookie";
}

export async function getPublicLegalPageController(req: Request, res: Response) {
    try {
        const key = resolveLegalPageKey(String(req.params.slug));

        if (!key) {
            return res.status(404).json({ message: "Page not found" });
        }

        const page = await getLegalPageByKey(key);

        if (!page) {
            return res.status(404).json({ message: "Page not found" });
        }

        return res.json(page);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function getAdminLegalPageController(req: Request, res: Response) {
    try {
        const key = resolveLegalPageKey(String(req.params.slug));

        if (!key) {
            return res.status(404).json({ message: "Page not found" });
        }

        const page = await getLegalPageByKey(key);

        if (!page) {
            return res.status(404).json({ message: "Page not found" });
        }

        return res.json(page);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function updateAdminLegalPageController(req: Request, res: Response) {
    try {
        const key = resolveLegalPageKey(String(req.params.slug));

        if (!key) {
            return res.status(404).json({ message: "Page not found" });
        }

        const { title, intro, bannerTitle, bannerText } = req.body;

        const validationError = validateLegalPageInput({ title, intro, bannerTitle, bannerText });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const page = await upsertLegalPage(key, { title, intro, bannerTitle, bannerText });

        return res.json(page);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function listSectionsController(req: Request, res: Response) {
    try {
        const key = resolveLegalPageKey(String(req.params.slug));

        if (!key) {
            return res.status(404).json({ message: "Page not found" });
        }

        const page = await getLegalPageByKey(key);

        if (!page) {
            return res.json([]);
        }

        const sections = await listSections(page.id);
        return res.json(sections);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function createSectionController(req: Request, res: Response) {
    try {
        const key = resolveLegalPageKey(String(req.params.slug));

        if (!key) {
            return res.status(404).json({ message: "Page not found" });
        }

        const { title, content } = req.body;

        const validationError = validateLegalSectionInput({ title, content });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const page = await ensureLegalPage(key, defaultTitleForKey(key));
        const order = Number.isFinite(Number(req.body.order)) ? Number(req.body.order) : 0;

        const created = await createSection(page.id, { order, title, content });

        return res.status(201).json(created);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function updateSectionController(req: Request, res: Response) {
    try {
        const key = resolveLegalPageKey(String(req.params.slug));

        if (!key) {
            return res.status(404).json({ message: "Page not found" });
        }

        const id = Number(req.params.id);
        const existing = await getSectionById(id);
        const page = await getLegalPageByKey(key);

        if (!existing || !page || existing.legalPageId !== page.id) {
            return res.status(404).json({ message: "Section not found" });
        }

        const { title, content, order } = req.body;

        const validationError = validateLegalSectionInput({
            title: title ?? existing.title,
            content: content ?? existing.content
        });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const updated = await updateSection(id, {
            title,
            content,
            order: order !== undefined ? Number(order) : undefined
        });

        return res.json(updated);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function deleteSectionController(req: Request, res: Response) {
    try {
        const key = resolveLegalPageKey(String(req.params.slug));

        if (!key) {
            return res.status(404).json({ message: "Page not found" });
        }

        const id = Number(req.params.id);
        const existing = await getSectionById(id);
        const page = await getLegalPageByKey(key);

        if (!existing || !page || existing.legalPageId !== page.id) {
            return res.status(404).json({ message: "Section not found" });
        }

        await deleteSection(id);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function listCookieCategoriesController(_req: Request, res: Response) {
    try {
        const categories = await listCookieCategories();
        return res.json(categories);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function updateCookieCategoryController(req: Request, res: Response) {
    try {
        const key = String(req.params.key);

        if (!isCookieCategoryKey(key)) {
            return res.status(404).json({ message: "Cookie category not found" });
        }

        const { name, purpose, duration } = req.body;

        const validationError = validateCookieCategoryInput({ name, purpose, duration });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const updated = await updateCookieCategory(key, { name, purpose, duration });

        return res.json(updated);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}
