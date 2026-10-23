import { isNonEmptyString, isValidDate } from "../../lib/validators.js";

export const PROJECT_SCOPES = ["NAZIONALE", "INTERNAZIONALE"] as const;
export type ProjectScopeValue = (typeof PROJECT_SCOPES)[number];

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

    if (!isUpdate && body.scope === undefined) {
        return `Scope is required and must be one of: ${PROJECT_SCOPES.join(", ")}`;
    }

    if (body.scope !== undefined) {
        if (!PROJECT_SCOPES.includes(body.scope as ProjectScopeValue)) {
            return `Scope must be one of: ${PROJECT_SCOPES.join(", ")}`;
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
