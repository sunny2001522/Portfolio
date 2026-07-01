import { createClient } from "@libsql/client";
import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { projects } from "../db/seed-data";

config({ path: resolve(process.cwd(), ".env.local") });

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) throw new Error("TURSO_DATABASE_URL missing");

const db = createClient({ url, authToken });

async function applySchema() {
  const sql = readFileSync(resolve(ROOT, "db/schema.sql"), "utf8");
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const stmt of statements) {
    await db.execute(stmt);
  }
  console.log(`✓ schema applied (${statements.length} statements)`);
}

async function seedProjects() {
  await db.batch([
    "DELETE FROM project_skills",
    "DELETE FROM project_links",
    "DELETE FROM project_images",
    "DELETE FROM projects",
  ]);

  const projectStmts = projects.map((p, idx) => ({
    sql: "INSERT INTO projects (id, year, thumbnail, video, category, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
    args: [p.id, p.year, p.thumbnail, p.video ?? null, p.category ?? "", idx],
  }));

  const linkStmts = projects.flatMap((p) =>
    p.links.map((l) => ({
      sql: "INSERT INTO project_links (project_id, type, url) VALUES (?, ?, ?)",
      args: [p.id, l.type, l.url],
    }))
  );

  const skillStmts = projects.flatMap((p) =>
    (p.skills ?? []).map((s, idx) => ({
      sql: "INSERT INTO project_skills (project_id, skill_name, sort_order) VALUES (?, ?, ?)",
      args: [p.id, s, idx],
    }))
  );

  const imageStmts = projects.flatMap((p) =>
    (p.images ?? []).map((url, idx) => ({
      sql: "INSERT INTO project_images (project_id, url, sort_order) VALUES (?, ?, ?)",
      args: [p.id, url, idx],
    }))
  );

  await db.batch([
    ...projectStmts,
    ...linkStmts,
    ...skillStmts,
    ...imageStmts,
  ]);
  console.log(
    `✓ seeded ${projectStmts.length} projects, ${linkStmts.length} links, ${skillStmts.length} skills, ${imageStmts.length} images`
  );
}

async function seedMessages() {
  const locales = ["en", "zh"];
  const rows = locales.map((locale) => {
    const file = resolve(ROOT, `db/messages.${locale}.json`);
    const raw = readFileSync(file, "utf8");
    JSON.parse(raw);
    return { locale, content: raw };
  });

  await db.execute("DELETE FROM messages");
  await db.batch(
    rows.map((r) => ({
      sql: "INSERT INTO messages (locale, content) VALUES (?, ?)",
      args: [r.locale, r.content],
    }))
  );
  console.log(`✓ seeded messages for: ${locales.join(", ")}`);
}

async function main() {
  await applySchema();
  await seedProjects();
  await seedMessages();
  console.log("✅ Seed complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
