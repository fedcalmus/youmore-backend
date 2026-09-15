import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth.middleware.js";
import { uploadProjectFiles } from "./project.upload.js";
import {
    createProjectController,
    deleteProjectController,
    getProjectAdminController,
    getProjectPublicController,
    listProjectsAdminController,
    listProjectsPublicController,
    listProjectVolunteersController,
    updateProjectController,
} from "./project.controller.js";
import { createVolunteerApplicationController } from "../volunteers/volunteer.controller.js";

const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);

adminRouter.post("/", uploadProjectFiles, createProjectController);
adminRouter.get("/", listProjectsAdminController);
adminRouter.get("/:id", getProjectAdminController);
adminRouter.put("/:id", uploadProjectFiles, updateProjectController);
adminRouter.delete("/:id", deleteProjectController);
adminRouter.get("/:id/volunteers", listProjectVolunteersController);

const publicRouter = Router();

publicRouter.get("/", listProjectsPublicController);
publicRouter.get("/:slug", getProjectPublicController);
publicRouter.post("/:slug/apply", createVolunteerApplicationController);

export const adminProjectRoutes = adminRouter;
export const publicProjectRoutes = publicRouter;
