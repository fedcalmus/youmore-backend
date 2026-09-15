import type { Request, Response } from "express";
import {
    createProject,
    getProjectByIdForAdmin,
    getProjectBySlugPublic,
    getProjectEntityById,
    listProjectsAdmin,
    listProjectsPublic,
    listProjectVolunteers,
    softDeleteProject,
    updateProject,
} from "./project.service.js";
import { normalizeRichContent, validateProjectInput } from "./project.validation.js";
import { sanitizeRichText } from "../../lib/sanitize.js";
import { buildPaginationMeta, getPagination } from "../../lib/pagination.js";

interface MulterFields {
    mainImage?: Express.Multer.File[];
    document?: Express.Multer.File[];
}

export async function createProjectController(req: Request, res: Response) {
    try {
        const files = req.files as MulterFields | undefined;

        const validationError = validateProjectInput(req.body);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const mainImageFile = files?.mainImage?.[0];

        if (!mainImageFile) {
            return res.status(400).json({ message: "Main image is required" });
        }

        let richContent;

        try {
            richContent = normalizeRichContent(req.body.richContent);
        } catch (error) {
            return res.status(400).json({ message: (error as Error).message });
        }

        if (richContent) {
            for (const key of Object.keys(richContent)) {
                richContent[key] = sanitizeRichText(richContent[key]);
            }
        }

        const documentFile = files?.document?.[0];

        const project = await createProject({
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            description: sanitizeRichText(req.body.description),
            mainImage: `/uploads/projects/${mainImageFile.filename}`,
            documentUrl: documentFile ? `/uploads/documents/${documentFile.filename}` : null,
            projectCode: req.body.projectCode || null,
            category: req.body.category || null,
            status: req.body.status || "ACTIVE",
            location: req.body.location || null,
            startDate: req.body.startDate ? new Date(req.body.startDate) : null,
            endDate: req.body.endDate ? new Date(req.body.endDate) : null,
            beneficiaries: req.body.beneficiaries || null,
            funding: req.body.funding || null,
            richContent,
        });

        return res.status(201).json(project);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function updateProjectController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const existing = await getProjectEntityById(id);

        if (!existing) {
            return res.status(404).json({ message: "Project not found" });
        }

        const validationError = validateProjectInput(req.body, { isUpdate: true });

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        let richContent;

        try {
            richContent = normalizeRichContent(req.body.richContent);
        } catch (error) {
            return res.status(400).json({ message: (error as Error).message });
        }

        if (richContent) {
            for (const key of Object.keys(richContent)) {
                richContent[key] = sanitizeRichText(richContent[key]);
            }
        }

        const files = req.files as MulterFields | undefined;
        const mainImageFile = files?.mainImage?.[0];
        const documentFile = files?.document?.[0];

        const data: Record<string, unknown> = {};

        if (req.body.title !== undefined) data.title = req.body.title;
        if (req.body.shortDescription !== undefined) data.shortDescription = req.body.shortDescription;
        if (req.body.description !== undefined) data.description = sanitizeRichText(req.body.description);
        if (req.body.projectCode !== undefined) data.projectCode = req.body.projectCode || null;
        if (req.body.category !== undefined) data.category = req.body.category || null;
        if (req.body.status !== undefined) data.status = req.body.status;
        if (req.body.location !== undefined) data.location = req.body.location || null;
        if (req.body.startDate !== undefined) {
            data.startDate = req.body.startDate ? new Date(req.body.startDate) : null;
        }
        if (req.body.endDate !== undefined) {
            data.endDate = req.body.endDate ? new Date(req.body.endDate) : null;
        }
        if (req.body.beneficiaries !== undefined) data.beneficiaries = req.body.beneficiaries || null;
        if (req.body.funding !== undefined) data.funding = req.body.funding || null;
        if (richContent !== undefined) data.richContent = richContent;
        if (mainImageFile) data.mainImage = `/uploads/projects/${mainImageFile.filename}`;
        if (documentFile) data.documentUrl = `/uploads/documents/${documentFile.filename}`;

        const project = await updateProject(id, data);

        return res.json(project);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function deleteProjectController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const existing = await getProjectEntityById(id);

        if (!existing) {
            return res.status(404).json({ message: "Project not found" });
        }

        await softDeleteProject(id);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function listProjectsAdminController(req: Request, res: Response) {
    try {
        const pagination = getPagination(req.query);
        const { items, totalItems } = await listProjectsAdmin(pagination);

        return res.json({
            data: items,
            pagination: buildPaginationMeta(pagination.page, pagination.limit, totalItems),
        });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function getProjectAdminController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const project = await getProjectByIdForAdmin(id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        return res.json(project);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function listProjectVolunteersController(req: Request, res: Response) {
    try {
        const projectId = Number(req.params.id);
        const project = await getProjectEntityById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const pagination = getPagination(req.query);
        const { items, totalItems } = await listProjectVolunteers(projectId, pagination);

        return res.json({
            data: items,
            pagination: buildPaginationMeta(pagination.page, pagination.limit, totalItems),
        });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function listProjectsPublicController(req: Request, res: Response) {
    try {
        const pagination = getPagination(req.query);
        const { items, totalItems } = await listProjectsPublic(pagination);

        return res.json({
            data: items,
            pagination: buildPaginationMeta(pagination.page, pagination.limit, totalItems),
        });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function getProjectPublicController(req: Request, res: Response) {
    try {
        const project = await getProjectBySlugPublic(String(req.params.slug));

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        return res.json(project);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}
