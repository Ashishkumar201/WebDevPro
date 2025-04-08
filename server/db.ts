import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Create a postgres connection
const connectionString = process.env.DATABASE_URL!;
// Configure postgres client with proper ssl settings for managed DB services
const client = postgres(connectionString, {
  ssl: connectionString.includes("localhost") ? false : "require",
  max: 10, // Max pool size
  idle_timeout: 20, // Idle connection timeout in seconds
  connect_timeout: 10, // Connection timeout in seconds
});

// Create drizzle instance
export const db = drizzle(client, { schema });