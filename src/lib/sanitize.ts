import sanitizeHtml from "sanitize-html";

const allowedTags = [
    ...sanitizeHtml.defaults.allowedTags,
    "h1",
    "h2",
    "h3",
    "h4",
    "img",
    "span",
    "u"
];

const allowedAttributes = {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "width", "height"]
};

export function sanitizeRichText(html: string | null | undefined): string {
    if (!html) {
        return "";
    }

    return sanitizeHtml(html, {
        allowedTags,
        allowedAttributes,
        allowedSchemes: ["http", "https", "mailto"],
        disallowedTagsMode: "discard"
    });
}
