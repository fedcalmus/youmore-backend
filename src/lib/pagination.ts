export interface PaginationRequest {
    skip: number;
    take: number;
    page: number;
    limit: number;
}

export interface PaginationMeta {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export function getPagination(
    query: Record<string, unknown>,
    fixedLimit = 10
): PaginationRequest {
    const rawPage = parseInt(String(query.page ?? "1"), 10);
    const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit = fixedLimit;
    const skip = (page - 1) * limit;

    return { skip, take: limit, page, limit };
}

export function buildPaginationMeta(
    page: number,
    limit: number,
    totalItems: number
): PaginationMeta {
    return {
        currentPage: page,
        pageSize: limit,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / limit)
    };
}
