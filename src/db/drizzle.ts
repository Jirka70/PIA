// src/db/drizzle.ts
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

type AnyDb = ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePg>;

let _db: AnyDb | null = null;

function isNeonUrl(url: string) {
  // Neon connection strings usually include neon.tech and require fetch-based driver
  return url.includes("neon.tech");
}

export function getDb(): AnyDb {
  if (_db) return _db;

  const url =
    process.env.DATABASE_URL ??
    "postgresql://app:app@db:5432/app"; // docker-compose service name

  // If DATABASE_URL points to Neon -> use neon-http driver
  if (isNeonUrl(url)) {
    const sql = neon(url);
    _db = drizzleNeon(sql);
    return _db;
  }

  // Otherwise -> assume standard Postgres (local/container) via TCP
  const pool = new Pool({ connectionString: url });
  _db = drizzlePg(pool);
  return _db;
}
