import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./modules/auth/auth.routes.js";
import {
    adminFinancingEntityRoutes,
    publicFinancingEntityRoutes,
} from "./modules/financing-entities/financing-entity.routes.js";
import { adminTeamRoutes, publicTeamRoutes } from "./modules/team/team.routes.js";
import {
    adminStaticPageRoutes,
    publicStaticPageRoutes,
} from "./modules/static-pages/static-page.routes.js";
import { adminContactRoutes, publicContactRoutes } from "./modules/contact/contact.routes.js";
import { adminProjectRoutes, publicProjectRoutes } from "./modules/projects/project.routes.js";
import { adminVolunteerRoutes } from "./modules/volunteers/volunteer.routes.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/api/admin/financing-entities", adminFinancingEntityRoutes);
app.use("/api/financing-entities", publicFinancingEntityRoutes);

app.use("/api/admin/team", adminTeamRoutes);
app.use("/api/team", publicTeamRoutes);

app.use("/api/admin/pages", adminStaticPageRoutes);
app.use("/api/pages", publicStaticPageRoutes);

app.use("/api/admin/contact", adminContactRoutes);
app.use("/api/contact", publicContactRoutes);

app.use("/api/admin/projects", adminProjectRoutes);
app.use("/api/projects", publicProjectRoutes);

app.use("/api/admin/volunteers", adminVolunteerRoutes);

app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "uploads"))
);

export default app;
