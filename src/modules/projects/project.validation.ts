import { isNonEmptyString, isValidDate } from "../../lib/validators.js";

export const PROJECT_STATUSES = ["ACTIVE", "COMPLETED"] as const;
export type ProjectStatusValue = (typeof PROJECT_STATUSES)[number];

const RICH_CONTENT_KEYS = [
    "overview",
    "objectives",
    "activities",
    "requirements",
    "impact",
    "additionalInfo",
] as const;

export function validateProjectInput(
    body: Record<string, unknown>,
    { isUpdate = false }: { isUpdate?: boolean } = {}
) {
    if (!isUpdate || body.title !== undefined) {
        if (!isNonEmptyString(body.title)) {
            return "Title is required";
        }
    }

    if (!isUpdate || body.shortDescription !== undefined) {
        if (!isNonEmptyString(body.shortDescription)) {
            return "Short description is required";
        }
    }

    if (!isUpdate || body.description !== undefined) {
        if (!isNonEmptyString(body.description)) {
            return "Description is required";
        }
    }

    if (body.status !== undefined) {
        if (!PROJECT_STATUSES.includes(body.status as ProjectStatusValue)) {
            return `Status must be one of: ${PROJECT_STATUSES.join(", ")}`;
        }
    }

    if (body.startDate !== undefined && body.startDate !== null && body.startDate !== "") {
        if (!isValidDate(body.startDate)) {
            return "Start date is invalid";
        }
    }

    if (body.endDate !== undefined && body.endDate !== null && body.endDate !== "") {
        if (!isValidDate(body.endDate)) {
            return "End date is invalid";
        }
    }

    if (
        body.startDate &&
        body.endDate &&
        isValidDate(body.startDate) &&
        isValidDate(body.endDate)
    ) {
        if (new Date(body.startDate as string) > new Date(body.endDate as string)) {
            return "Start date must be before end date";
        }
    }

    return null;
}

export function normalizeRichContent(input: unknown): Record<string, string> | undefined {
    if (input === undefined || input === null || input === "") {
        return undefined;
    }

    let parsed: unknown = input;

    if (typeof input === "string") {
        try {
            parsed = JSON.parse(input);
        } catch {
            throw new Error("richContent must be a valid JSON object");
        }
    }

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        throw new Error("richContent must be a JSON object");
    }

    const result: Record<string, string> = {};

    for (const key of RICH_CONTENT_KEYS) {
        const value = (parsed as Record<string, unknown>)[key];

        if (typeof value === "string" && value.trim().length > 0) {
            result[key] = value;
        }
    }

    return result;
}
