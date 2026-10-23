import type { Request, Response } from "express";
import {
    createCard,
    createPublicSubmission,
    deleteCard,
    getCardById,
    getTestimonialsPage,
    listAllCards,
    listApprovedCards,
    updateCard,
    upsertTestimonialsPage,
} from "./testimonials-page.service.js";
import {
    validatePublicTestimonialInput,
    validateTestimonialCardInput,
    validateTestimonialsPageInput,
} from "./testimonials-page.validation.js";

export async function getAdminTestimonialsPageController(_req: Request, res: Response) {
    try {
        const page = await getTestimonialsPage();

        if (!page) {
            return res.status(404).json({ message: "Testimonials page content not set" });
        }

        return res.json(page);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function updateAdminTestimonialsPageController(req: Request, res: Response) {
    try {
        const { heroEyebrow, heroQuote, heroName, heroCountry, heroContext, ctaText } = req.body;

        const validationError = validateTestimonialsPageInput({
            heroEyebrow,
            heroQuote,
            heroName,
            heroCountry,
            heroContext,
            ctaText,
        });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const page = await upsertTestimonialsPage({
            heroEyebrow,
            heroQuote,
            heroName,
            heroCountry,
            heroContext,
            ctaText,
        });

        return res.json(page);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function listCardsController(_req: Request, res: Response) {
    try {
        const cards = await listAllCards();
        return res.json(cards);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function createCardController(req: Request, res: Response) {
    try {
        const { variant, tag, quote, author } = req.body;

        const validationError = validateTestimonialCardInput({ variant, tag, quote, author });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const file = req.file;

        if (variant === "VIDEO" && !file) {
            return res.status(400).json({ message: "A video file is required for a video testimonial" });
        }

        const order = Number.isFinite(Number(req.body.order)) ? Number(req.body.order) : 0;
        const projectId = req.body.projectId ? Number(req.body.projectId) : null;

        const created = await createCard({
            order,
            variant,
            tag: tag || null,
            quote: variant === "VIDEO" ? null : quote,
            author,
            videoUrl: file ? `/uploads/testimonial-videos/${file.filename}` : null,
            projectId: Number.isFinite(projectId) ? projectId : null,
        });

        return res.status(201).json(created);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function updateCardController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const existing = await getCardById(id);

        if (!existing) {
            return res.status(404).json({ message: "Testimonial card not found" });
        }

        const { variant, tag, quote, author, order, status } = req.body;

        const validationError = validateTestimonialCardInput({
            variant: variant ?? existing.variant,
            tag: tag ?? existing.tag,
            quote: quote ?? existing.quote,
            author: author ?? existing.author,
            status,
        });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const file = req.file;
        const resolvedVariant = variant ?? existing.variant;

        if (resolvedVariant === "VIDEO" && !file && !existing.videoUrl) {
            return res.status(400).json({ message: "A video file is required for a video testimonial" });
        }

        const updated = await updateCard(id, {
            order: order !== undefined ? Number(order) : undefined,
            variant,
            tag: tag !== undefined ? tag || null : undefined,
            quote: resolvedVariant === "VIDEO" ? null : quote,
            author,
            videoUrl: file ? `/uploads/testimonial-videos/${file.filename}` : undefined,
            status,
            projectId: req.body.projectId !== undefined ? (req.body.projectId ? Number(req.body.projectId) : null) : undefined,
        });

        return res.json(updated);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function deleteCardController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const existing = await getCardById(id);

        if (!existing) {
            return res.status(404).json({ message: "Testimonial card not found" });
        }

        await deleteCard(id);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function getPublicTestimonialsPageController(_req: Request, res: Response) {
    try {
        const [page, cards] = await Promise.all([getTestimonialsPage(), listApprovedCards()]);

        if (!page) {
            return res.status(404).json({ message: "Testimonials page content not set" });
        }

        return res.json({ ...page, cards });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function submitPublicTestimonialController(req: Request, res: Response) {
    try {
        const { author, tag, quote } = req.body;

        const validationError = validatePublicTestimonialInput({ author, quote });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        await createPublicSubmission({ author, tag: tag || null, quote });

        return res.status(201).json({ message: "Grazie! La tua testimonianza è in revisione e verrà pubblicata a breve." });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}
