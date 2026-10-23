import { isBoolean, isNonEmptyString, isValidDate, isValidEmail, isValidPhone } from "../../lib/validators.js";

export const GENDERS = ["MALE", "FEMALE", "OTHER"] as const;
export const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

const MIN_AGE = 16;
const MAX_AGE = 99;

function getAgeInYears(dob: Date): number {
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const hasHadBirthdayThisYear =
        now.getMonth() > dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());
    if (!hasHadBirthdayThisYear) age -= 1;
    return age;
}

export function validateVolunteerApplicationInput(body: Record<string, unknown>) {
    if (!isNonEmptyString(body.name)) return "Name is required";
    if (!isNonEmptyString(body.surname)) return "Surname is required";

    if (!GENDERS.includes(body.gender as never)) {
        return `Gender must be one of: ${GENDERS.join(", ")}`;
    }

    if (!isNonEmptyString(body.citizenship)) return "Citizenship is required";
    if (!isNonEmptyString(body.city)) return "City is required";

    if (!isValidDate(body.dateOfBirth)) return "A valid date of birth is required";

    const dob = new Date(body.dateOfBirth as string);
    if (dob.getTime() > Date.now()) return "Date of birth cannot be in the future";

    const age = getAgeInYears(dob);
    if (age < MIN_AGE) return `You must be at least ${MIN_AGE} years old to apply`;
    if (age > MAX_AGE) return "The date of birth entered doesn't look valid";

    if (!isValidEmail(body.email)) return "A valid email is required";
    if (!isValidPhone(body.phoneNumber)) return "A valid phone number is required";

    if (!isBoolean(body.hasPassport)) return "hasPassport must be true or false";
    if (body.travelDocumentValidForCountry !== null && !isBoolean(body.travelDocumentValidForCountry)) {
        return "travelDocumentValidForCountry must be true, false, or null (unknown)";
    }

    if (!isNonEmptyString(body.motivation)) return "Motivation is required";
    if (!isBoolean(body.isFirstExperience)) return "isFirstExperience must be true or false";
    if (!isNonEmptyString(body.howDidYouFindUs)) return "howDidYouFindUs is required";
    if (!isNonEmptyString(body.emergencyContact)) return "Emergency contact is required";

    if (!TSHIRT_SIZES.includes(body.tshirtSize as never)) {
        return `tshirtSize must be one of: ${TSHIRT_SIZES.join(", ")}`;
    }

    if (!isBoolean(body.emailGroupConsent)) return "emailGroupConsent must be true or false";
    if (!isBoolean(body.personalDataConsent)) return "personalDataConsent must be true or false";

    if (body.personalDataConsent !== true) {
        return "Personal data consent is required to submit an application";
    }

    return null;
}
