export type Lang = "it" | "en";

/** Reads `?lang=it|en` from the request query, defaulting to Italian. */
export function resolveLang(query: Record<string, unknown>): Lang {
    return query.lang === "en" ? "en" : "it";
}

/** Picks the English value when requested and present, else falls back to Italian. */
export function pick(it: string, en: string | null | undefined, lang: Lang): string {
    if (lang === "en" && en && en.trim()) return en;
    return it;
}

/** Same as `pick`, but for fields that are themselves optional/nullable in Italian too. */
export function pickNullable(
    it: string | null | undefined,
    en: string | null | undefined,
    lang: Lang
): string | null {
    if (lang === "en" && en && en.trim()) return en;
    return it ?? null;
}
