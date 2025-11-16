// src/db/drizzle.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// ŽÁDNÉ dotenv – Next načte .env sám
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
