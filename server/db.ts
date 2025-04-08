import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

// Create a neon client
const sql = neon(process.env.DATABASE_URL!);

// Create drizzle instance - force type assertion to make TypeScript happy
export const db = drizzle(sql as any, { schema });