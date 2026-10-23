import { isNonEmptyString } from "../../lib/validators.js";

export const HOME_TESTIMONIAL_VARIANTS = ["dark", "light"] as const;
export type HomeTestimonialVariant = (typeof HOME_TESTIMONIAL_VARIANTS)[number];

export const HOME_GALLERY_SLOTS = ["GROUP", "ACTIVITY", "TRAVEL"] as const;
export type HomeGallerySlotValue = (typeof HOME_GALLERY_SLOTS)[number];

export function validateHomePageInput(body: {
    stepsEyebrow?: unknown;
    stepsTitle?: unknown;
    aboutTeaserEyebrow?: unknown;
    aboutTeaserTitle?: unknown;
    aboutTeaserText?: unknown;
    testimonialsEyebrow?: unknown;
    testimonialsTitle?: unknown;
    fundersEyebrow?: unknown;
    fundersIntroText?: unknown;
}) {
    if (!isNonEmptyString(body.stepsEyebrow)) return "Steps eyebrow is required";
    if (!isNonEmptyString(body.stepsTitle)) return "Steps title is required";
    if (!isNonEmptyString(body.aboutTeaserEyebrow)) return "About teaser eyebrow is required";
    if (!isNonEmptyString(body.aboutTeaserTitle)) return "About teaser title is required";
    if (!isNonEmptyString(body.aboutTeaserText)) return "About teaser text is required";
    if (!isNonEmptyString(body.testimonialsEyebrow)) return "Testimonials eyebrow is required";
    if (!isNonEmptyString(body.testimonialsTitle)) return "Testimonials title is required";
    if (!isNonEmptyString(body.fundersEyebrow)) return "Funders eyebrow is required";
    if (!isNonEmptyString(body.fundersIntroText)) return "Funders intro text is required";

    return null;
}

export function validateHomeStepInput(body: { title?: unknown; text?: unknown }) {
    if (!isNonEmptyString(body.title)) return "Title is required";
    if (!isNonEmptyString(body.text)) return "Text is required";

    return null;
}

export function validateHomeTestimonialInput(body: {
    quote?: unknown;
    name?: unknown;
    context?: unknown;
    variant?: unknown;
}) {
    if (!isNonEmptyString(body.quote)) return "Quote is required";
    if (!isNonEmptyString(body.name)) return "Name is required";
    if (!isNonEmptyString(body.context)) return "Context is required";

    if (!HOME_TESTIMONIAL_VARIANTS.includes(body.variant as never)) {
        return `Variant must be one of: ${HOME_TESTIMONIAL_VARIANTS.join(", ")}`;
    }

    return null;
}
