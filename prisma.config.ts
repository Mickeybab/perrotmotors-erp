import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";
import path from "path";

// Prisma CLI ne lit pas .env.local (convention Next.js) — on le charge manuellement
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

export default defineConfig({
  datasource: process.env.DATABASE_URL
    ? { url: process.env.DATABASE_URL }
    : undefined,
});
