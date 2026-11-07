// Shared connection for the scripts, same TLS rules as src/db/index.ts.
import { existsSync, readFileSync } from "node:fs";
import pg from "pg";

if (!process.env.DATABASE_URL && existsSync(".env.local")) process.loadEnvFile(".env.local");

/** The MAYA CA from src/db/ca.ts (one copy, shared with the app). */
function mayaCa() {
  const src = readFileSync("src/db/ca.ts", "utf8");
  return src.slice(src.indexOf("-----BEGIN"), src.lastIndexOf("-----") + 5);
}

export function pool() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const u = new URL(url);
  const mode = u.searchParams.get("sslmode");
  for (const k of ["sslmode", "sslrootcert", "channel_binding"]) u.searchParams.delete(k);
  const pem = process.env.DATABASE_CA_CERT?.replace(/\n/g, "\n").trim();
  let ssl = false;
  if (pem) ssl = { ca: pem, rejectUnauthorized: true };
  else if (mode === "verify-full") ssl = { ca: mayaCa(), rejectUnauthorized: true };
  else if (mode && mode !== "disable") ssl = { rejectUnauthorized: mode === "verify-full" || mode === "verify-ca" };
  return new pg.Pool({ connectionString: u.toString(), ssl, max: 2 });
}
