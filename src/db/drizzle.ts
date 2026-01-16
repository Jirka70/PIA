// src/db/drizzle.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

type DB = ReturnType<typeof drizzle>;

let _db: DB | null = null;

export function getDb(): DB {
  if (_db) return _db;

  // Allow running locally without a DATABASE_URL by falling back to the
  // docker-compose defaults exposed on localhost.
  const url = process.env.DATABASE_URL ?? 'postgresql://app:app@localhost:5432/app';

  const sql = neon(url);
  _db = drizzle(sql);
  return _db;
}
