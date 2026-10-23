import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth.middleware.js";
import {
    createSectionController,
    deleteSectionController,
    getAdminLegalPageController,
    getPublicLegalPageController,
    listCookieCategoriesController,
    listSectionsController,
    updateAdminLegalPageController,
    updateCookieCategoryController,
    updateSectionController
} from "./legal.controller.js";

const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);

adminRouter.get("/pages/:slug", getAdminLegalPageController);
adminRouter.put("/pages/:slug", updateAdminLegalPageController);
adminRouter.get("/pages/:slug/sections", listSectionsController);
adminRouter.post("/pages/:slug/sections", createSectionController);
adminRouter.put("/pages/:slug/sections/:id", updateSectionController);
adminRouter.delete("/pages/:slug/sections/:id", deleteSectionController);
adminRouter.get("/cookie-categories", listCookieCategoriesController);
adminRouter.put("/cookie-categories/:key", updateCookieCategoryController);

const publicRouter = Router();

publicRouter.get("/pages/:slug", getPublicLegalPageController);
publicRouter.get("/cookie-categories", listCookieCategoriesController);

export const adminLegalRoutes = adminRouter;
export const publicLegalRoutes = publicRouter;
