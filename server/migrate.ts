import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import { Pool as PgPool } from "pg";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { migrate as migrateNeon } from "drizzle-orm/neon-serverless/migrator";
import { migrate as migratePg } from "drizzle-orm/node-postgres/migrator";
import ws from "ws";

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL environment variable is required");
    console.log("\nTo connect to your PostgreSQL database, set the following environment variable:");
    console.log("  DATABASE_URL=postgresql://username:password@your-host:5432/database_name");
    console.log("\nExample for AWS RDS:");
    console.log("  DATABASE_URL=postgresql://admin:mypassword@mydb.xxxxx.us-east-1.rds.amazonaws.com:5432/baraka_os");
    console.log("\nExample for Neon:");
    console.log("  DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/baraka_os?sslmode=require");
    process.exit(1);
  }

  console.log("Starting database migrations...");
  console.log("Connecting to database...");

  const isNeon = databaseUrl.includes("neon.tech") || databaseUrl.includes("replit");

  try {
    if (isNeon) {
      console.log("Detected Neon/Replit database, using WebSocket connection...");
      neonConfig.webSocketConstructor = ws;
      const pool = new NeonPool({ connectionString: databaseUrl });
      const db = drizzleNeon(pool);
      
      console.log("Running migrations from ./migrations folder...");
      await migrateNeon(db, { migrationsFolder: "./migrations" });
      
      await pool.end();
    } else {
      console.log("Detected standard PostgreSQL, using TCP connection...");
      const sslConfig = databaseUrl.includes("sslmode=require") || databaseUrl.includes("rds.amazonaws.com")
        ? { rejectUnauthorized: false }
        : false;
      
      const pool = new PgPool({ 
        connectionString: databaseUrl,
        ssl: sslConfig
      });

      console.log("Ensuring pgcrypto extension is enabled...");
      const client = await pool.connect();
      try {
        await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');
        console.log("pgcrypto extension enabled.");
      } finally {
        client.release();
      }
      
      const db = drizzlePg(pool);
      
      console.log("Running migrations from ./migrations folder...");
      await migratePg(db, { migrationsFolder: "./migrations" });
      
      await pool.end();
    }

    console.log("Migrations completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigrations();
