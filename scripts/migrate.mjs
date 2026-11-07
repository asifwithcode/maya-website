// Applies drizzle/*.sql to DATABASE_URL.   npm run db:migrate
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { pool } from "./db.mjs";

const p = pool();
await migrate(drizzle(p), { migrationsFolder: "drizzle" });
const { rows } = await p.query("select count(*)::int as n from drizzle.__drizzle_migrations");
console.log(`migrations applied: ${rows[0].n}`);
await p.end();
