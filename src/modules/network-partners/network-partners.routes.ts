import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth.middleware.js";
import { uploadNetworkPartnerImage } from "./network-partners.upload.js";
import {
    createNetworkPartnerController,
    deleteNetworkPartnerController,
    listNetworkPartnersAdminController,
    listNetworkPartnersPublicController,
    updateNetworkPartnerController,
} from "./network-partners.controller.js";

const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);

adminRouter.get("/", listNetworkPartnersAdminController);
adminRouter.post("/", uploadNetworkPartnerImage.single("image"), createNetworkPartnerController);
adminRouter.put("/:id", uploadNetworkPartnerImage.single("image"), updateNetworkPartnerController);
adminRouter.delete("/:id", deleteNetworkPartnerController);

const publicRouter = Router();

publicRouter.get("/", listNetworkPartnersPublicController);

export const adminNetworkPartnerRoutes = adminRouter;
export const publicNetworkPartnerRoutes = publicRouter;
