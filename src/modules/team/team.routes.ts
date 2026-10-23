import { Router } from "express";
import { uploadTeamMemberImage } from "./team.upload.js";
import {
    createTeamMemberController,
    deleteTeamMemberController,
    exportTeamMembersController,
    getTeamMemberController,
    listTeamMembersAdminController,
    listTeamMembersController,
    updateTeamMemberController,
} from "./team.controller.js";
import { authenticate, requireAdmin } from "../../middleware/auth.middleware.js";

const adminRouter = Router();

adminRouter.use(authenticate, requireAdmin);

adminRouter.post(
    "/",
    uploadTeamMemberImage.single("image"),
    createTeamMemberController
);
adminRouter.get("/", listTeamMembersAdminController);
adminRouter.get("/export", exportTeamMembersController);
adminRouter.get("/:id", getTeamMemberController);
adminRouter.put(
    "/:id",
    uploadTeamMemberImage.single("image"),
    updateTeamMemberController
);
adminRouter.delete("/:id", deleteTeamMemberController);

const publicRouter = Router();

publicRouter.get("/", listTeamMembersController);
publicRouter.get("/:id", getTeamMemberController);

export const adminTeamRoutes = adminRouter;
export const publicTeamRoutes = publicRouter;
