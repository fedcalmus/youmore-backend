import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth.middleware.js";
import { createVideoUpload } from "../../lib/upload.js";
import {
    createCardController,
    deleteCardController,
    getAdminTestimonialsPageController,
    getPublicTestimonialsPageController,
    listCardsController,
    submitPublicTestimonialController,
    updateAdminTestimonialsPageController,
    updateCardController,
} from "./testimonials-page.controller.js";

const uploadTestimonialVideo = createVideoUpload("testimonial-videos");

const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);

adminRouter.get("/", getAdminTestimonialsPageController);
adminRouter.put("/", updateAdminTestimonialsPageController);
adminRouter.get("/cards", listCardsController);
adminRouter.post("/cards", uploadTestimonialVideo.single("video"), createCardController);
adminRouter.put("/cards/:id", uploadTestimonialVideo.single("video"), updateCardController);
adminRouter.delete("/cards/:id", deleteCardController);

const publicRouter = Router();

publicRouter.get("/", getPublicTestimonialsPageController);
publicRouter.post("/submit", submitPublicTestimonialController);

export const adminTestimonialsPageRoutes = adminRouter;
export const publicTestimonialsPageRoutes = publicRouter;
