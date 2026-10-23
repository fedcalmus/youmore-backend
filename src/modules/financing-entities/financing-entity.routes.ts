import { Router } from "express";
import { uploadFinancingEntityImage } from "./financing-entity.upload.js";
import {
    createFinancingEntityController,
    deleteFinancingEntityController,
    exportFinancingEntitiesController,
    getFinancingEntityController,
    listFinancingEntitiesAdminController,
    listFinancingEntitiesController,
    updateFinancingEntityController,
} from "./financing-entity.controller.js";
import { authenticate, requireAdmin } from "../../middleware/auth.middleware.js";

const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);

adminRouter.post(
    "/",
    uploadFinancingEntityImage.single("image"),
    createFinancingEntityController
);
adminRouter.get("/", listFinancingEntitiesAdminController);
adminRouter.get("/export", exportFinancingEntitiesController);
adminRouter.get("/:id", getFinancingEntityController);
adminRouter.put(
    "/:id",
    uploadFinancingEntityImage.single("image"),
    updateFinancingEntityController
);
adminRouter.delete("/:id", deleteFinancingEntityController);

const publicRouter = Router();

publicRouter.get("/", listFinancingEntitiesController);
publicRouter.get("/:id", getFinancingEntityController);

export const adminFinancingEntityRoutes = adminRouter;
export const publicFinancingEntityRoutes = publicRouter;
