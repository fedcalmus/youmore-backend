import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth.middleware.js";
import {
    createStepController,
    createTestimonialController,
    deleteStepController,
    deleteTestimonialController,
    getAdminHomePageController,
    getPublicHomePageController,
    listGalleryImagesController,
    listStepsController,
    listTestimonialsController,
    updateAdminHomePageController,
    updateGalleryImageController,
    updateStepController,
    updateTestimonialController,
} from "./home-page.controller.js";
import { uploadHomeGalleryImage } from "./home-page.upload.js";

const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);

adminRouter.get("/", getAdminHomePageController);
adminRouter.put("/", updateAdminHomePageController);
adminRouter.get("/steps", listStepsController);
adminRouter.post("/steps", createStepController);
adminRouter.put("/steps/:id", updateStepController);
adminRouter.delete("/steps/:id", deleteStepController);
adminRouter.get("/testimonials", listTestimonialsController);
adminRouter.post("/testimonials", createTestimonialController);
adminRouter.put("/testimonials/:id", updateTestimonialController);
adminRouter.delete("/testimonials/:id", deleteTestimonialController);
adminRouter.get("/gallery", listGalleryImagesController);
adminRouter.put("/gallery/:slot", uploadHomeGalleryImage.single("image"), updateGalleryImageController);

const publicRouter = Router();

publicRouter.get("/", getPublicHomePageController);

export const adminHomePageRoutes = adminRouter;
export const publicHomePageRoutes = publicRouter;
