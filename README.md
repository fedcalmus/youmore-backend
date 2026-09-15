# YouMore Backend

Express + Prisma (PostgreSQL) backend API.

## Tech Stack

- Node.js, Express 5
- TypeScript (via `tsx`)
- Prisma 7 (`@prisma/adapter-pg`) + PostgreSQL
- JWT auth (`jsonwebtoken`), password hashing (`bcryptjs`)
- File uploads (`multer`)

## Prerequisites

- Node.js 20+
- Docker (for PostgreSQL) or an existing PostgreSQL instance

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/myapp?schema=public"
   JWT_SECRET="your-secret-key"
   PORT=3000
   ```

3. Start PostgreSQL:

   ```bash
   docker compose up -d
   ```

   > If port `5432` is already in use by another container, either stop it or point `DATABASE_URL` at an existing PostgreSQL instance/database.

4. Run database migrations:

   ```bash
   npx prisma migrate deploy
   ```

5. Seed the super admin user:

   ```bash
   npx tsx prisma/seed.ts
   ```

   Default credentials: `superAdmin` / `superAdmin1234`

## Running the app

```bash
npm run dev
```

The server starts on `http://localhost:3000` (or the port set via `PORT`).

## API Endpoints

### Auth

- `POST /auth/login` — body: `{ "username": string, "password": string }` → returns `{ token, user }`

### Financing Entities (admin)

- `POST /api/admin/financing-entities` — multipart form-data: `name`, `url`, `image` (file) → creates a financing entity

### Misc

- `GET /users` — sample static endpoint
- `GET /uploads/*` — serves uploaded files (e.g. financing entity images)

## Database

Prisma schema: `prisma/schema.prisma`

- `User` (`id`, `username`, `password`, `role: USER | SUPER_ADMIN`, `createdAt`)
- `FinancingEntity` (`id`, `name`, `image`, `url`, `createdAt`, `updatedAt`)

## Project Structure

```
src/
  app.ts              # Express app setup
  server.ts           # Entry point
  lib/
    prisma.js         # Prisma client instance
    jwt.js            # JWT sign/verify helpers
  modules/
    auth/              # Login route/controller/service
    financing-entities/ # Financing entity route/controller/service/upload
prisma/
  schema.prisma
  seed.ts
  migrations/
```
