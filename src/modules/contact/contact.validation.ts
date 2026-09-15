import { isNonEmptyString, isValidEmail, isValidPhone, isValidUrl } from "../../lib/validators.js";

export function validateContactInfoInput(body: {
    address?: unknown;
    phone?: unknown;
    email?: unknown;
    instagram?: unknown;
    facebook?: unknown;
    linkedin?: unknown;
}) {
    if (!isNonEmptyString(body.address)) {
        return "Address is required";
    }

    if (!isValidPhone(body.phone)) {
        return "A valid phone number is required";
    }

    if (!isValidEmail(body.email)) {
        return "A valid email is required";
    }

    if (body.instagram && !isValidUrl(body.instagram)) {
        return "Instagram must be a valid URL";
    }

    if (body.facebook && !isValidUrl(body.facebook)) {
        return "Facebook must be a valid URL";
    }

    if (body.linkedin && !isValidUrl(body.linkedin)) {
        return "LinkedIn must be a valid URL";
    }

    return null;
}
