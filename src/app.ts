import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import path from "path";
import multer from "multer";
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
import { adminAboutPageRoutes, publicAboutPageRoutes } from "./modules/about-page/about-page.routes.js";
import { adminProjectRoutes, publicProjectRoutes } from "./modules/projects/project.routes.js";
import { adminVolunteerRoutes } from "./modules/volunteers/volunteer.routes.js";
import { adminLegalRoutes, publicLegalRoutes } from "./modules/legal/legal.routes.js";
import { adminHomePageRoutes, publicHomePageRoutes } from "./modules/home-page/home-page.routes.js";
import {
    adminTestimonialsPageRoutes,
    publicTestimonialsPageRoutes,
} from "./modules/testimonials-page/testimonials-page.routes.js";
import {
    adminNetworkPartnerRoutes,
    publicNetworkPartnerRoutes,
} from "./modules/network-partners/network-partners.routes.js";

const app = express();

const defaultCorsOrigins = [
    "http://localhost:5173", // admin
    "http://localhost:3000", // website
    "http://localhost:3001", // website (fallback port when 3000 is taken)
];

const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
    : defaultCorsOrigins;

app.use(
    cors({
        origin: corsOrigins,
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

app.use("/api/admin/about", adminAboutPageRoutes);
app.use("/api/about", publicAboutPageRoutes);

app.use("/api/admin/network-partners", adminNetworkPartnerRoutes);
app.use("/api/network-partners", publicNetworkPartnerRoutes);

app.use("/api/admin/projects", adminProjectRoutes);
app.use("/api/projects", publicProjectRoutes);

app.use("/api/admin/volunteers", adminVolunteerRoutes);

app.use("/api/admin/legal", adminLegalRoutes);
app.use("/api/legal", publicLegalRoutes);

app.use("/api/admin/home-page", adminHomePageRoutes);
app.use("/api/home-page", publicHomePageRoutes);

app.use("/api/admin/testimonials-page", adminTestimonialsPageRoutes);
app.use("/api/testimonials-page", publicTestimonialsPageRoutes);

app.use(
    "/uploads",
    express.static(path.join(process.cwd(), "uploads"))
);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    }

    if (err instanceof Error) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
});

export default app;
