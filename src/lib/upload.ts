import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

export function createImageUpload(folder: string) {
    const storage = multer.diskStorage({
        destination: (_req, _file, cb) => {
            const dir = `uploads/${folder}`;
            fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        },

        filename: (_req, file, cb) => {
            const extension = path.extname(file.originalname);
            const filename = `${crypto.randomUUID()}${extension}`;
            cb(null, filename);
        }
    });

    const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed"));
        }

        cb(null, true);
    };

    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    });
}

export function createVideoUpload(folder: string) {
    const storage = multer.diskStorage({
        destination: (_req, _file, cb) => {
            const dir = `uploads/${folder}`;
            fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        },

        filename: (_req, file, cb) => {
            const extension = path.extname(file.originalname);
            const filename = `${crypto.randomUUID()}${extension}`;
            cb(null, filename);
        }
    });

    const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
        if (!file.mimetype.startsWith("video/")) {
            return cb(new Error("Only video files are allowed"));
        }

        cb(null, true);
    };

    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: 30 * 1024 * 1024
        }
    });
}

export function createDocumentUpload(folder: string) {
    const storage = multer.diskStorage({
        destination: (_req, _file, cb) => {
            const dir = `uploads/${folder}`;
            fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        },

        filename: (_req, file, cb) => {
            const extension = path.extname(file.originalname);
            const filename = `${crypto.randomUUID()}${extension}`;
            cb(null, filename);
        }
    });

    const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Only PDF files are allowed"));
        }

        cb(null, true);
    };

    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: 10 * 1024 * 1024
        }
    });
}
