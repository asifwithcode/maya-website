import "server-only";
import { Pool, type PoolConfig } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { MAYA_DB_CA } from "./ca";

type Db = ReturnType<typeof drizzle<typeof schema>>;
const g = globalThis as unknown as { __mayaDb?: Db };

/**
 * TLS for the database. The VPS Postgres uses a certificate from our own CA, so the CA is pinned:
 * DATABASE_CA_CERT (PEM text) wins, else the MAYA CA in ./ca.ts when the URL asks for verify-full.
 * Any other URL (Neon, local docker) keeps what its sslmode says.
 */
function sslFor(url: string): PoolConfig["ssl"] {
  const mode = new URL(url).searchParams.get("sslmode");
  const pem = process.env.DATABASE_CA_CERT?.replace(/\n/g, "\n").trim();
  if (pem) return { ca: pem, rejectUnauthorized: true };
  if (mode === "verify-full") return { ca: MAYA_DB_CA, rejectUnauthorized: true };
  if (mode === "disable" || !mode) return false;
  return { rejectUnauthorized: mode === "verify-full" || mode === "verify-ca" };
}

/** Drizzle over node-postgres; created on first use so builds without DATABASE_URL still work. */
export function db(): Db {
  if (!g.__mayaDb) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    const clean = new URL(url);
    // sslmode/sslrootcert are handled above; pg would otherwise override our ssl object.
    for (const k of ["sslmode", "sslrootcert", "channel_binding"]) clean.searchParams.delete(k);
    const pool = new Pool({
      connectionString: clean.toString(),
      ssl: sslFor(url),
      max: 3, // serverless: a few connections per instance
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 8_000,
    });
    pool.on("error", (err) => console.error("pg pool error", err));
    g.__mayaDb = drizzle(pool, { schema });
  }
  return g.__mayaDb;
}

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);
