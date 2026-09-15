const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9][0-9\s()-]{6,19}$/;
const URL_REGEX = /^https?:\/\/[^\s]+$/i;

export function isValidEmail(value: unknown): value is string {
    return typeof value === "string" && EMAIL_REGEX.test(value.trim());
}

export function isValidPhone(value: unknown): value is string {
    return typeof value === "string" && PHONE_REGEX.test(value.trim());
}

export function isValidUrl(value: unknown): value is string {
    return typeof value === "string" && URL_REGEX.test(value.trim());
}

export function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

export function isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
}

export function isValidDate(value: unknown): boolean {
    if (typeof value !== "string" && !(value instanceof Date)) {
        return false;
    }

    const date = new Date(value as string);
    return !Number.isNaN(date.getTime());
}
