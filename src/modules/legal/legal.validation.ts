import { isNonEmptyString } from "../../lib/validators.js";

export const LEGAL_PAGE_SLUGS = {
    "privacy-policy": "PRIVACY_POLICY",
    "cookie-policy": "COOKIE_POLICY"
} as const;

export type LegalPageSlug = keyof typeof LEGAL_PAGE_SLUGS;

export function resolveLegalPageKey(slug: string) {
    return LEGAL_PAGE_SLUGS[slug as LegalPageSlug];
}

export const COOKIE_CATEGORY_KEYS = ["NECESSARI", "STATISTICI", "MARKETING"] as const;
export type CookieCategoryKeyValue = (typeof COOKIE_CATEGORY_KEYS)[number];

export function isCookieCategoryKey(key: string): key is CookieCategoryKeyValue {
    return COOKIE_CATEGORY_KEYS.includes(key as CookieCategoryKeyValue);
}

export function validateLegalPageInput(body: {
    title?: unknown;
    intro?: unknown;
    bannerTitle?: unknown;
    bannerText?: unknown;
}) {
    if (!isNonEmptyString(body.title)) {
        return "Title is required";
    }

    if (!isNonEmptyString(body.intro)) {
        return "Intro is required";
    }

    return null;
}

export function validateLegalSectionInput(body: { title?: unknown; content?: unknown }) {
    if (!isNonEmptyString(body.title)) {
        return "Title is required";
    }

    if (!isNonEmptyString(body.content)) {
        return "Content is required";
    }

    return null;
}

export function validateCookieCategoryInput(body: {
    name?: unknown;
    purpose?: unknown;
    duration?: unknown;
}) {
    if (!isNonEmptyString(body.name)) {
        return "Name is required";
    }

    if (!isNonEmptyString(body.purpose)) {
        return "Purpose is required";
    }

    if (!isNonEmptyString(body.duration)) {
        return "Duration is required";
    }

    return null;
}
