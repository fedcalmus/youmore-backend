import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth.middleware.js";
import {
    getVolunteerApplicationController,
    listVolunteerApplicationsController,
} from "./volunteer.controller.js";

const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);
adminRouter.get("/", listVolunteerApplicationsController);
adminRouter.get("/:id", getVolunteerApplicationController);

export const adminVolunteerRoutes = adminRouter;
