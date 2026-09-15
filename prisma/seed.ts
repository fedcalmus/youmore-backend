import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

const password = "superAdmin1234";

const hashedPassword = await bcrypt.hash(password, 12);

await prisma.user.upsert({
    where: {
        username: "superAdmin",
    },

    update: {
        role: "SUPER_ADMIN",
    },

    create: {
        username: "superAdmin",
        password: hashedPassword,
        role: "SUPER_ADMIN",
    },
});

console.log("Super Admin created");

await prisma.$disconnect();