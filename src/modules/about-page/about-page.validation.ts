import { isNonEmptyString } from "../../lib/validators.js";

export function validateAboutPageInput(body: {
    title?: unknown;
    description?: unknown;
    sede?: unknown;
    legalForm?: unknown;
}) {
    if (!isNonEmptyString(body.title)) {
        return "Title is required";
    }

    if (!isNonEmptyString(body.description)) {
        return "Description is required";
    }

    if (!isNonEmptyString(body.sede)) {
        return "Sede is required";
    }

    if (!isNonEmptyString(body.legalForm)) {
        return "Legal form is required";
    }

    return null;
}

export function validateGalleryImageInput(body: { caption?: unknown }) {
    if (!isNonEmptyString(body.caption)) {
        return "Caption is required";
    }

    return null;
}

export function validateGoalInput(body: { title?: unknown; text?: unknown }) {
    if (!isNonEmptyString(body.title)) {
        return "Title is required";
    }

    if (!isNonEmptyString(body.text)) {
        return "Text is required";
    }

    return null;
}
