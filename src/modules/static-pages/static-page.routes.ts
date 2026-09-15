import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth.middleware.js";
import {
    getAdminStaticPageController,
    getPublicStaticPageController,
    listAdminStaticPagesController,
    upsertAdminStaticPageController
} from "./static-page.controller.js";

const publicRouter = Router();

publicRouter.get("/:slug", getPublicStaticPageController);

const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);
adminRouter.get("/", listAdminStaticPagesController);
adminRouter.get("/:slug", getAdminStaticPageController);
adminRouter.put("/:slug", upsertAdminStaticPageController);

export const publicStaticPageRoutes = publicRouter;
export const adminStaticPageRoutes = adminRouter;
