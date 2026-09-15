import type { Request, Response } from "express";
import { validateVolunteerApplicationInput } from "./volunteer.validation.js";
import {
    createVolunteerApplication,
    getVolunteerApplicationById,
    listVolunteerApplications,
} from "./volunteer.service.js";
import { getProjectBySlugPublic } from "../projects/project.service.js";
import { buildPaginationMeta, getPagination } from "../../lib/pagination.js";

export async function createVolunteerApplicationController(req: Request, res: Response) {
    try {
        const project = await getProjectBySlugPublic(String(req.params.slug));

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.status !== "ACTIVE") {
            return res.status(400).json({
                message: "This project is not currently accepting applications",
            });
        }

        const validationError = validateVolunteerApplicationInput(req.body);

        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const application = await createVolunteerApplication({
            projectId: project.id,
            name: req.body.name,
            surname: req.body.surname,
            gender: req.body.gender,
            citizenship: req.body.citizenship,
            city: req.body.city,
            dateOfBirth: new Date(req.body.dateOfBirth),
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            hasPassport: req.body.hasPassport,
            travelDocumentValidForCountry: req.body.travelDocumentValidForCountry,
            motivation: req.body.motivation,
            isFirstExperience: req.body.isFirstExperience,
            howDidYouFindUs: req.body.howDidYouFindUs,
            emergencyContact: req.body.emergencyContact,
            specialNeeds: req.body.specialNeeds || null,
            tshirtSize: req.body.tshirtSize,
            emailGroupConsent: req.body.emailGroupConsent,
            personalDataConsent: req.body.personalDataConsent,
        });

        return res.status(201).json({
            message: "Application submitted successfully",
            applicationId: application.id,
        });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function listVolunteerApplicationsController(req: Request, res: Response) {
    try {
        const pagination = getPagination(req.query);
        const { items, totalItems } = await listVolunteerApplications(pagination);

        return res.json({
            data: items,
            pagination: buildPaginationMeta(pagination.page, pagination.limit, totalItems),
        });
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}

export async function getVolunteerApplicationController(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const application = await getVolunteerApplicationById(id);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        return res.json(application);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
}
