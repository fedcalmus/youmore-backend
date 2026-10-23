export interface ListQuery {
    search: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
}

export function parseListQuery(
    query: Record<string, unknown>,
    allowedSortFields: readonly string[],
    defaultSort: string
): ListQuery {
    const search = typeof query.search === "string" ? query.search.trim() : "";

    const rawSortBy = typeof query.sortBy === "string" ? query.sortBy : undefined;
    const sortBy = rawSortBy && allowedSortFields.includes(rawSortBy) ? rawSortBy : defaultSort;

    const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

    return { search, sortBy, sortOrder };
}
