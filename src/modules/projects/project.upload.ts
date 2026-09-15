import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "document") {
            return cb(null, "uploads/documents");
        }

        cb(null, "uploads/projects");
    },

    filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, `${crypto.randomUUID()}${extension}`);
    },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    if (file.fieldname === "mainImage") {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Main image must be an image file"));
        }
        return cb(null, true);
    }

    if (file.fieldname === "document") {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Document must be a PDF file"));
        }
        return cb(null, true);
    }

    cb(new Error("Unexpected file field"));
};

export const uploadProjectFiles = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
}).fields([
    { name: "mainImage", maxCount: 1 },
    { name: "document", maxCount: 1 },
]);
