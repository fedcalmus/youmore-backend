import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt.js";

export interface AuthUser {
    id: number;
    username: string;
    role: string;
}

export interface AuthenticatedRequest extends Request {
    user?: AuthUser;
}

export function authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    const token = header.slice("Bearer ".length);

    try {
        const payload = verifyToken(token) as AuthUser;
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

export function requireAdmin(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    if (!req.user || req.user.role !== "SUPER_ADMIN") {
        return res.status(403).json({
            message: "Admin access required"
        });
    }

    next();
}
