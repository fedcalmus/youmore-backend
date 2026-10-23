import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth.middleware.js";
import { uploadProjectFiles, uploadProjectGalleryImage } from "./project.upload.js";
import {
    createProjectController,
    createProjectImageController,
    deleteProjectController,
    deleteProjectImageController,
    exportProjectsController,
    getProjectAdminController,
    getProjectPublicController,
    listProjectsAdminController,
    listProjectsPublicController,
    listProjectVolunteersController,
    updateProjectController,
    updateProjectImageController,
} from "./project.controller.js";
import { createVolunteerApplicationController } from "../volunteers/volunteer.controller.js";

const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);

adminRouter.post("/", uploadProjectFiles, createProjectController);
adminRouter.get("/", listProjectsAdminController);
adminRouter.get("/export", exportProjectsController);
adminRouter.get("/:id", getProjectAdminController);
adminRouter.put("/:id", uploadProjectFiles, updateProjectController);
adminRouter.delete("/:id", deleteProjectController);
adminRouter.get("/:id/volunteers", listProjectVolunteersController);
adminRouter.post("/:id/images", uploadProjectGalleryImage.single("image"), createProjectImageController);
adminRouter.put("/:id/images/:imageId", uploadProjectGalleryImage.single("image"), updateProjectImageController);
adminRouter.delete("/:id/images/:imageId", deleteProjectImageController);

const publicRouter = Router();

publicRouter.get("/", listProjectsPublicController);
publicRouter.get("/:slug", getProjectPublicController);
publicRouter.post("/:slug/apply", createVolunteerApplicationController);

export const adminProjectRoutes = adminRouter;
export const publicProjectRoutes = publicRouter;
