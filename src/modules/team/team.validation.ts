import { isNonEmptyString, isValidEmail, isValidPhone } from "../../lib/validators.js";

export function validateTeamMemberInput(body: {
    name?: unknown;
    surname?: unknown;
    email?: unknown;
    phoneNumber?: unknown;
}) {
    if (!isNonEmptyString(body.name)) {
        return "Name is required";
    }

    if (!isNonEmptyString(body.surname)) {
        return "Surname is required";
    }

    if (!isValidEmail(body.email)) {
        return "A valid email is required";
    }

    if (!isValidPhone(body.phoneNumber)) {
        return "A valid phone number is required";
    }

    return null;
}
