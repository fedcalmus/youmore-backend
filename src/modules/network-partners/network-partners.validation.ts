import { isNonEmptyString } from "../../lib/validators.js";

export function validateNetworkPartnerInput(body: { title?: unknown }) {
    if (!isNonEmptyString(body.title)) {
        return "Title is required";
    }

    return null;
}
