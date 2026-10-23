/**
 * Free, no-API-key translation via the public (unofficial) Google Translate
 * endpoint. Used to auto-draft the English version of admin-entered Italian
 * content. Never throws — on any failure it falls back to the original text
 * so a field is never left blank; admin can always edit the result later.
 */
export async function translateToEnglish(text: string): Promise<string> {
    if (!text || !text.trim()) return text;

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=it&tl=en&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url, { signal: AbortSignal.timeout(8000) });

        if (!response.ok) return text;

        const data = (await response.json()) as unknown;
        const segments = Array.isArray(data) ? data[0] : null;

        if (!Array.isArray(segments)) return text;

        const translated = segments
            .map((segment) => (Array.isArray(segment) ? segment[0] : ""))
            .filter((part): part is string => typeof part === "string")
            .join("");

        return translated || text;
    } catch {
        return text;
    }
}

type TranslatableBody = Record<string, unknown>;

/**
 * For each field name in `fields`, if the caller didn't explicitly provide
 * `<field>En` in the request body, auto-translates it from the Italian
 * `<field>` value. If the caller DID provide it (even an empty string —
 * meaning admin deliberately cleared/edited it), that value is kept as-is
 * and never overwritten by a fresh translation.
 */
export async function withAutoTranslate<T extends TranslatableBody>(
    body: T,
    fields: readonly string[]
): Promise<Record<string, string | undefined>> {
    const result: Record<string, string | undefined> = {};

    await Promise.all(
        fields.map(async (field) => {
            const enKey = `${field}En`;
            const provided = body[enKey];

            if (provided !== undefined) {
                result[enKey] = provided as string;
                return;
            }

            const sourceValue = body[field];

            if (typeof sourceValue === "string" && sourceValue.trim()) {
                result[enKey] = await translateToEnglish(sourceValue);
            }
        })
    );

    return result;
}
