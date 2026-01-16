import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

const databaseUrl = process.env.DATABASE_URL ?? "postgresql://app:app@localhost:5432/app";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
