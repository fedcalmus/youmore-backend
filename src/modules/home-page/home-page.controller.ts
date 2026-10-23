import type { Request, Response } from "express";
import {
    createStep,
    createTestimonial,
    deleteStep,
    deleteTestimonial,
    getGalleryImageBySlot,
    getHomePage,
    getStepById,
    getTestimonialById,
    listGalleryImages,
    listSteps,
    listTestimonials,
    updateStep,
    updateTestimonial,
    upsertGalleryImage,
    upsertHomePage,
} from "./home-page.service.js";
import {
    HOME_GALLERY_SLOTS,
    validateHomePageInput,
    validateHomeStepInput,
    validateHomeTestimonialInput,
} from "./home-page.validation.js";
import type { HomeGallerySlotValue } from "./home-page.validation.js";

export async function getAdminHomePageController(_req: Request, res: Response) {
    try {
        const page = await getHomePage();

        if (!page) {
            return res.status(404).json({ message: "Homepage content not set" });
        }

        return res.json(page);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function updateAdminHomePageController(req: Request, res: Response) {
    try {
        const {
            stepsEyebrow,
            stepsTitle,
            aboutTeaserEyebrow,
            aboutTeaserTitle,
            aboutTeaserText,
            testimonialsEyebrow,
            testimonialsTitle,
            fundersEyebrow,
            fundersIntroText,
        } = req.body;

        const validationError = validateHomePageInput({
            stepsEyebrow,
            stepsTitle,
            aboutTeaserEyebrow,
            aboutTeaserTitle,
            aboutTeaserText,
            testimonialsEyebrow,
            testimonialsTitle,
            fundersEyebrow,
            fundersIntroText,
        });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const page = await upsertHomePage({
            stepsEyebrow,
            stepsTitle,
            aboutTeaserEyebrow,
            aboutTeaserTitle,
            aboutTeaserText,
            testimonialsEyebrow,
            testimonialsTitle,
            fundersEyebrow,
            fundersIntroText,
        });

        return res.json(page);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function listStepsController(_req: Request, res: Response) {
    try {
        const steps = await listSteps();
        return res.json(steps);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function createStepController(req: Request, res: Response) {
    try {
        const { title, text } = req.body;

        const validationError = validateHomeStepInput({ title, text });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const order = Number.isFinite(Number(req.body.order)) ? Number(req.body.order) : 0;

        const created = await createStep({ order, title, text });

        return res.status(201).json(created);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function updateStepController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const existing = await getStepById(id);

        if (!existing) {
            return res.status(404).json({ message: "Step not found" });
        }

        const { title, text, order } = req.body;

        const validationError = validateHomeStepInput({
            title: title ?? existing.title,
            text: text ?? existing.text,
        });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const updated = await updateStep(id, {
            title,
            text,
            order: order !== undefined ? Number(order) : undefined,
        });

        return res.json(updated);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function deleteStepController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const existing = await getStepById(id);

        if (!existing) {
            return res.status(404).json({ message: "Step not found" });
        }

        await deleteStep(id);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function listTestimonialsController(_req: Request, res: Response) {
    try {
        const testimonials = await listTestimonials();
        return res.json(testimonials);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function createTestimonialController(req: Request, res: Response) {
    try {
        const { quote, name, context, variant } = req.body;

        const validationError = validateHomeTestimonialInput({ quote, name, context, variant });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const order = Number.isFinite(Number(req.body.order)) ? Number(req.body.order) : 0;

        const created = await createTestimonial({ order, quote, name, context, variant });

        return res.status(201).json(created);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function updateTestimonialController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const existing = await getTestimonialById(id);

        if (!existing) {
            return res.status(404).json({ message: "Testimonial not found" });
        }

        const { quote, name, context, variant, order } = req.body;

        const validationError = validateHomeTestimonialInput({
            quote: quote ?? existing.quote,
            name: name ?? existing.name,
            context: context ?? existing.context,
            variant: variant ?? existing.variant,
        });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const updated = await updateTestimonial(id, {
            quote,
            name,
            context,
            variant,
            order: order !== undefined ? Number(order) : undefined,
        });

        return res.json(updated);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function deleteTestimonialController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const existing = await getTestimonialById(id);

        if (!existing) {
            return res.status(404).json({ message: "Testimonial not found" });
        }

        await deleteTestimonial(id);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function getPublicHomePageController(_req: Request, res: Response) {
    try {
        const [page, steps, testimonials, gallery] = await Promise.all([
            getHomePage(),
            listSteps(),
            listTestimonials(),
            listGalleryImages(),
        ]);

        if (!page) {
            return res.status(404).json({ message: "Homepage content not set" });
        }

        return res.json({ ...page, steps, testimonials, gallery });
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

export async function updateGalleryImageController(req: Request, res: Response) {
    try {
        const slot = String(req.params.slot).toUpperCase();

        if (!HOME_GALLERY_SLOTS.includes(slot as HomeGallerySlotValue)) {
            return res.status(404).json({ message: "Gallery slot not found" });
        }

        const typedSlot = slot as HomeGallerySlotValue;
        const file = req.file;
        const caption = req.body.caption !== undefined ? req.body.caption || null : undefined;

        if (!file) {
            const existing = await getGalleryImageBySlot(typedSlot);

            if (!existing) {
                return res.status(400).json({ message: "Image is required" });
            }
        }

        const updated = await upsertGalleryImage(typedSlot, {
            image: file ? `/uploads/home-gallery/${file.filename}` : undefined,
            caption,
        });

        return res.json(updated);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}
