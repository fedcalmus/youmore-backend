import { isNonEmptyString } from "../../lib/validators.js";

export const TESTIMONIAL_CARD_VARIANTS = ["LIGHT", "YELLOW", "DARK", "VIDEO"] as const;
export type TestimonialCardVariantValue = (typeof TESTIMONIAL_CARD_VARIANTS)[number];

export const TESTIMONIAL_CARD_STATUSES = ["PENDING", "APPROVED"] as const;
export type TestimonialCardStatusValue = (typeof TESTIMONIAL_CARD_STATUSES)[number];

export function validateTestimonialsPageInput(body: {
    heroEyebrow?: unknown;
    heroQuote?: unknown;
    heroName?: unknown;
    heroCountry?: unknown;
    heroContext?: unknown;
    ctaText?: unknown;
}) {
    if (!isNonEmptyString(body.heroEyebrow)) return "Hero eyebrow is required";
    if (!isNonEmptyString(body.heroQuote)) return "Hero quote is required";
    if (!isNonEmptyString(body.heroName)) return "Hero name is required";
    if (!isNonEmptyString(body.heroCountry)) return "Hero country is required";
    if (!isNonEmptyString(body.heroContext)) return "Hero context is required";
    if (!isNonEmptyString(body.ctaText)) return "CTA text is required";

    return null;
}

export function validateTestimonialCardInput(body: {
    variant?: unknown;
    tag?: unknown;
    quote?: unknown;
    author?: unknown;
    status?: unknown;
}) {
    if (!TESTIMONIAL_CARD_VARIANTS.includes(body.variant as never)) {
        return `Variant must be one of: ${TESTIMONIAL_CARD_VARIANTS.join(", ")}`;
    }

    if (!isNonEmptyString(body.author)) return "Author is required";

    if (body.variant !== "VIDEO" && !isNonEmptyString(body.quote)) {
        return "Quote is required";
    }

    if (body.status !== undefined && !TESTIMONIAL_CARD_STATUSES.includes(body.status as never)) {
        return `Status must be one of: ${TESTIMONIAL_CARD_STATUSES.join(", ")}`;
    }

    return null;
}

export function validatePublicTestimonialInput(body: { author?: unknown; quote?: unknown }) {
    if (!isNonEmptyString(body.author)) return "Name is required";
    if (!isNonEmptyString(body.quote)) return "Testimonial text is required";

    return null;
}
