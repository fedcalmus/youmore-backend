import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const [username, password] = process.argv.slice(2);

if (!username || !password) {
    console.error("Usage: npx tsx prisma/set-password.ts <username> <newPassword>");
    process.exit(1);
}

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

const hashedPassword = await bcrypt.hash(password, 12);

const user = await prisma.user.update({
    where: { username },
    data: { password: hashedPassword },
});

console.log(`Password updated for user "${user.username}"`);

await prisma.$disconnect();
