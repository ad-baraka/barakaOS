import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import { Pool as PgPool } from "pg";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";
import ws from "ws";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const databaseUrl = process.env.DATABASE_URL;
const isNeon = databaseUrl.includes("neon.tech") || databaseUrl.includes("replit");

let db: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePg>;

if (isNeon) {
  neonConfig.webSocketConstructor = ws;
  const pool = new NeonPool({ connectionString: databaseUrl });
  db = drizzleNeon(pool, { schema });
} else {
  const sslConfig = databaseUrl.includes("sslmode=require") || databaseUrl.includes("rds.amazonaws.com")
    ? { rejectUnauthorized: false }
    : false;
  
  const pool = new PgPool({ 
    connectionString: databaseUrl,
    ssl: sslConfig
  });
  db = drizzlePg(pool, { schema });
}

export { db };
export type DbType = typeof db;
