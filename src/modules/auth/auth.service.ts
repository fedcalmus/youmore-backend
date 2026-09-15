import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma.js";
import { generateToken } from "../../lib/jwt.js";

export async function login(username, password) {
    const user = await prisma.user.findUnique({
        where: {
            username
        }
    });

    if (!user) {
        throw new Error("Invalid username or password");
    }

    const passwordIsValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordIsValid) {
        throw new Error("Invalid username or password");
    }

    const token = generateToken({
        id: user.id,
        username: user.username,
        role: user.role
    });

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    };
}