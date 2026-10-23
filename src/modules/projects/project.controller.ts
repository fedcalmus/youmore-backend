import type { Request, Response } from "express";
import {
    createProject,
    createProjectImage,
    deleteProjectImage,
    getProjectByIdForAdmin,
    getProjectBySlugPublic,
    getProjectEntityById,
    getProjectImageById,
    listProjectsAdmin,
    listProjectsForExport,
    listProjectsPublic,
    listProjectVolunteers,
    softDeleteProject,
    updateProject,
    updateProjectImage,
} from "./project.service.js";
import { validateProjectInput } from "./project.validation.js";
import { buildPaginationMeta, getPagination } from "../../lib/pagination.js";
import { parseListQuery } from "../../lib/query.js";
import { toCsv } from "../../lib/csv.js";
import { pick, pickNullable, resolveLang } from "../../lib/localize.js";

const PROJECT_SORT_FIELDS = ["title", "category", "scope", "startDate", "endDate", "createdAt"] as const;

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

        const documentFile = files?.document?.[0];

        const project = await createProject({
            title: req.body.title,
            titleEn: req.body.titleEn,
            shortDescription: req.body.shortDescription,
            shortDescriptionEn: req.body.shortDescriptionEn,
            description: req.body.description,
            descriptionEn: req.body.descriptionEn,
            mainImage: `/uploads/projects/${mainImageFile.filename}`,
            documentUrl: documentFile ? `/uploads/documents/${documentFile.filename}` : null,
            category: req.body.category || null,
            scope: req.body.scope,
            location: req.body.location || null,
            locationEn: req.body.locationEn,
            startDate: req.body.startDate ? new Date(req.body.startDate) : null,
            endDate: req.body.endDate ? new Date(req.body.endDate) : null,
            whoCanJoin: req.body.whoCanJoin || null,
            whoCanJoinEn: req.body.whoCanJoinEn,
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

        const files = req.files as MulterFields | undefined;
        const mainImageFile = files?.mainImage?.[0];
        const documentFile = files?.document?.[0];

        const data: Record<string, unknown> = {};

        if (req.body.title !== undefined) data.title = req.body.title;
        if (req.body.titleEn !== undefined) data.titleEn = req.body.titleEn;
        if (req.body.shortDescription !== undefined) data.shortDescription = req.body.shortDescription;
        if (req.body.shortDescriptionEn !== undefined) data.shortDescriptionEn = req.body.shortDescriptionEn;
        if (req.body.description !== undefined) data.description = req.body.description;
        if (req.body.descriptionEn !== undefined) data.descriptionEn = req.body.descriptionEn;
        if (req.body.category !== undefined) data.category = req.body.category || null;
        if (req.body.scope !== undefined) data.scope = req.body.scope;
        if (req.body.location !== undefined) data.location = req.body.location || null;
        if (req.body.locationEn !== undefined) data.locationEn = req.body.locationEn;
        if (req.body.startDate !== undefined) {
            data.startDate = req.body.startDate ? new Date(req.body.startDate) : null;
        }
        if (req.body.endDate !== undefined) {
            data.endDate = req.body.endDate ? new Date(req.body.endDate) : null;
        }
        if (req.body.whoCanJoin !== undefined) data.whoCanJoin = req.body.whoCanJoin || null;
        if (req.body.whoCanJoinEn !== undefined) data.whoCanJoinEn = req.body.whoCanJoinEn;
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
        const listQuery = parseListQuery(req.query, PROJECT_SORT_FIELDS, "createdAt");
        const filters = {
            ...listQuery,
            scope: typeof req.query.scope === "string" ? req.query.scope : undefined,
            category: typeof req.query.category === "string" ? req.query.category : undefined,
        };
        const { items, totalItems } = await listProjectsAdmin(pagination, filters);

        return res.json({
            data: items,
            pagination: buildPaginationMeta(pagination.page, pagination.limit, totalItems),
        });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function exportProjectsController(req: Request, res: Response) {
    try {
        const listQuery = parseListQuery(req.query, PROJECT_SORT_FIELDS, "createdAt");
        const filters = {
            ...listQuery,
            scope: typeof req.query.scope === "string" ? req.query.scope : undefined,
            category: typeof req.query.category === "string" ? req.query.category : undefined,
        };
        const items = await listProjectsForExport(filters);

        const csv = toCsv(
            items.map((p) => ({
                title: p.title,
                shortDescription: p.shortDescription,
                category: p.category ?? "",
                scope: p.scope,
                location: p.location ?? "",
                startDate: p.startDate ? p.startDate.toISOString().slice(0, 10) : "",
                endDate: p.endDate ? p.endDate.toISOString().slice(0, 10) : "",
                whoCanJoin: p.whoCanJoin ?? "",
                volunteers: p._count.volunteerApplications,
                createdAt: p.createdAt.toISOString().slice(0, 10),
            })),
            [
                { key: "title", header: "Title" },
                { key: "shortDescription", header: "Short Description" },
                { key: "category", header: "Category" },
                { key: "scope", header: "Scope" },
                { key: "location", header: "Location" },
                { key: "startDate", header: "Start Date" },
                { key: "endDate", header: "End Date" },
                { key: "whoCanJoin", header: "Who Can Join" },
                { key: "volunteers", header: "Volunteers" },
                { key: "createdAt", header: "Created At" },
            ]
        );

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", 'attachment; filename="projects.csv"');
        return res.send(csv);
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

function localizeProject<T extends {
    title: string;
    titleEn: string | null;
    shortDescription: string;
    shortDescriptionEn: string | null;
    description: string;
    descriptionEn: string | null;
    location: string | null;
    locationEn: string | null;
    whoCanJoin: string | null;
    whoCanJoinEn: string | null;
}>(project: T, lang: ReturnType<typeof resolveLang>) {
    const { titleEn, shortDescriptionEn, descriptionEn, locationEn, whoCanJoinEn, ...rest } = project;

    return {
        ...rest,
        title: pick(project.title, titleEn, lang),
        shortDescription: pick(project.shortDescription, shortDescriptionEn, lang),
        description: pick(project.description, descriptionEn, lang),
        location: pickNullable(project.location, locationEn, lang),
        whoCanJoin: pickNullable(project.whoCanJoin, whoCanJoinEn, lang),
    };
}

export async function listProjectsPublicController(req: Request, res: Response) {
    try {
        const pagination = getPagination(req.query);
        const { items, totalItems } = await listProjectsPublic(pagination);
        const lang = resolveLang(req.query);

        return res.json({
            data: items.map((item) => localizeProject(item, lang)),
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

        const lang = resolveLang(req.query);

        return res.json(localizeProject(project, lang));
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function createProjectImageController(req: Request, res: Response) {
    try {
        const projectId = Number(req.params.id);
        const project = await getProjectEntityById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const image = `/uploads/project-gallery/${req.file.filename}`;
        const created = await createProjectImage(projectId, image, req.body.caption || null);

        return res.status(201).json(created);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function updateProjectImageController(req: Request, res: Response) {
    try {
        const projectId = Number(req.params.id);
        const project = await getProjectEntityById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const imageId = Number(req.params.imageId);
        const existing = await getProjectImageById(imageId);

        if (!existing || existing.projectId !== projectId) {
            return res.status(404).json({ message: "Gallery image not found" });
        }

        const image = req.file ? `/uploads/project-gallery/${req.file.filename}` : undefined;

        const updated = await updateProjectImage(imageId, {
            caption: req.body.caption !== undefined ? req.body.caption || null : undefined,
            ...(image ? { image } : {}),
        });

        return res.json(updated);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function deleteProjectImageController(req: Request, res: Response) {
    try {
        const projectId = Number(req.params.id);
        const project = await getProjectEntityById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const imageId = Number(req.params.imageId);
        const existing = await getProjectImageById(imageId);

        if (!existing || existing.projectId !== projectId) {
            return res.status(404).json({ message: "Gallery image not found" });
        }

        await deleteProjectImage(imageId);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}
