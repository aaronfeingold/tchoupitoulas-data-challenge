import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as authSchema from "./schemas/auth";
import * as hallOfFameSchema from "./schemas/hall-of-fame";

// Combine all schemas
const schema = {
  ...authSchema,
  ...hallOfFameSchema,
};

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });
export type Database = typeof db;

// Re-export all schema tables and types
export * from "./schemas/auth";
export * from "./schemas/hall-of-fame";