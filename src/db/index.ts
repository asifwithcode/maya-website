import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let client: ReturnType<typeof drizzle<typeof schema>> | null = null;

/** Drizzle over Neon's HTTP driver; created on first use so builds without DATABASE_URL still work. */
export function db() {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    client = drizzle(neon(url), { schema });
  }
  return client;
}

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);
