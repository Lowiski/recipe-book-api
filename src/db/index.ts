import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { ENV } from "@/config/env";
import * as schema from "./schema";

if (!ENV.DATABASE_URL) {
  throw new Error("DATABASE_URL is required. Set it in the .env file.");
}

// One shared connection pool for the whole application.
export const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
  ssl: ENV.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle({ client: pool, schema });
