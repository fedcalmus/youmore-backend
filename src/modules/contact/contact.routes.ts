import { Router } from "express";
import { getContactInfoController, updateContactInfoController } from "./contact.controller.js";
import { authenticate, requireAdmin } from "../../middleware/auth.middleware.js";

const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);
adminRouter.get("/", getContactInfoController);
adminRouter.put("/", updateContactInfoController);

const publicRouter = Router();

publicRouter.get("/", getContactInfoController);

export const adminContactRoutes = adminRouter;
export const publicContactRoutes = publicRouter;
