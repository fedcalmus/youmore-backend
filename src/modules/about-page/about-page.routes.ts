import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth.middleware.js";
import { uploadAboutGalleryImage } from "./about-page.upload.js";
import {
    createGalleryImageController,
    createGoalController,
    deleteGalleryImageController,
    deleteGoalController,
    getAdminAboutPageController,
    getPublicAboutPageController,
    listGalleryImagesController,
    listGoalsAdminController,
    listGoalsPublicController,
    updateAboutPageController,
    updateGalleryImageController,
    updateGoalController,
} from "./about-page.controller.js";

const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);

adminRouter.get("/", getAdminAboutPageController);
adminRouter.put("/", updateAboutPageController);
adminRouter.get("/gallery", listGalleryImagesController);
adminRouter.post(
    "/gallery",
    uploadAboutGalleryImage.single("image"),
    createGalleryImageController
);
adminRouter.put(
    "/gallery/:id",
    uploadAboutGalleryImage.single("image"),
    updateGalleryImageController
);
adminRouter.delete("/gallery/:id", deleteGalleryImageController);
adminRouter.get("/goals", listGoalsAdminController);
adminRouter.post("/goals", createGoalController);
adminRouter.put("/goals/:id", updateGoalController);
adminRouter.delete("/goals/:id", deleteGoalController);

const publicRouter = Router();

publicRouter.get("/", getPublicAboutPageController);
publicRouter.get("/gallery", listGalleryImagesController);
publicRouter.get("/goals", listGoalsPublicController);

export const adminAboutPageRoutes = adminRouter;
export const publicAboutPageRoutes = publicRouter;
