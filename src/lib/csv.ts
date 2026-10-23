export interface CsvColumn {
    key: string;
    header: string;
}

function escapeCsvField(value: unknown): string {
    const str = value === null || value === undefined ? "" : String(value);

    if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }

    return str;
}

export function toCsv(rows: Record<string, unknown>[], columns: CsvColumn[]): string {
    const header = columns.map((c) => escapeCsvField(c.header)).join(",");
    const lines = rows.map((row) => columns.map((c) => escapeCsvField(row[c.key])).join(","));

    return [header, ...lines].join("\r\n");
}
