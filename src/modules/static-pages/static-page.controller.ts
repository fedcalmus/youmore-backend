import type { Request, Response } from "express";
import {
    getStaticPageByKey,
    listStaticPages,
    resolveStaticPageKey,
    upsertStaticPage
} from "./static-page.service.js";
import { isNonEmptyString } from "../../lib/validators.js";

export async function getPublicStaticPageController(
    req: Request,
    res: Response
) {
    try {
        const key = resolveStaticPageKey(String(req.params.slug));

        if (!key) {
            return res.status(404).json({ message: "Page not found" });
        }

        const page = await getStaticPageByKey(key);

        if (!page) {
            return res.status(404).json({ message: "Page not found" });
        }

        return res.json({
            key: page.key,
            content: page.content,
            updatedAt: page.updatedAt
        });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function listAdminStaticPagesController(
    _req: Request,
    res: Response
) {
    try {
        const pages = await listStaticPages();
        return res.json(pages);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function getAdminStaticPageController(
    req: Request,
    res: Response
) {
    try {
        const key = resolveStaticPageKey(String(req.params.slug));

        if (!key) {
            return res.status(404).json({ message: "Page not found" });
        }

        const page = await getStaticPageByKey(key);

        if (!page) {
            return res.status(404).json({ message: "Page not found" });
        }

        return res.json(page);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function upsertAdminStaticPageController(
    req: Request,
    res: Response
) {
    try {
        const key = resolveStaticPageKey(String(req.params.slug));

        if (!key) {
            return res.status(404).json({ message: "Page not found" });
        }

        const { content } = req.body;

        if (!isNonEmptyString(content)) {
            return res.status(400).json({ message: "Content is required" });
        }

        const page = await upsertStaticPage(key, content);
        return res.json(page);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}
