import { isNonEmptyString, isValidUrl } from "../../lib/validators.js";

export function validateFinancingEntityInput(body: {
    name?: unknown;
    url?: unknown;
}) {
    if (!isNonEmptyString(body.name)) {
        return "Name is required";
    }

    if (!isValidUrl(body.url)) {
        return "A valid URL is required";
    }

    return null;
}
