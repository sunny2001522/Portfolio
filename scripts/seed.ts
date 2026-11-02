import { createClient } from "@libsql/client";
import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { projects } from "../db/seed-data";
import { filmCredits, literatureAwards, roleAwards } from "../db/works-seed-data";

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

async function seedWorks() {
  await db.batch(["DELETE FROM awards", "DELETE FROM film_credits"]);

  const creditStmts = filmCredits.map((c, idx) => ({
    sql: "INSERT INTO film_credits (id, year, title, format_zh, format_en, role_zh, role_en, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    args: [c.id, c.year, c.title, c.format.zh, c.format.en, c.role.zh, c.role.en, idx],
  }));

  const awardSql =
    "INSERT INTO awards (page, credit_id, year, name_zh, name_en, result_zh, result_en, work_zh, work_en, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  const filmAwardStmts = filmCredits.flatMap((c) =>
    (c.awards ?? []).map((a, idx) => ({
      sql: awardSql,
      args: [
        "film",
        c.id,
        a.year ?? c.year,
        a.name.zh,
        a.name.en,
        a.result?.zh ?? "",
        a.result?.en ?? "",
        c.title,
        c.titleEn,
        idx,
      ],
    }))
  );

  const literatureStmts = literatureAwards.map((a, idx) => ({
    sql: awardSql,
    args: [
      "literature",
      null,
      a.year ?? "",
      a.name.zh,
      a.name.en,
      a.result?.zh ?? "",
      a.result?.en ?? "",
      a.work?.zh ?? "",
      a.work?.en ?? "",
      idx,
    ],
  }));

  const roleStmts = Object.entries(roleAwards).flatMap(([role, list]) =>
    list.map((a, idx) => ({
      sql: awardSql,
      args: [role, null, a.year ?? "", a.name.zh, a.name.en, "", "", "", "", idx],
    }))
  );

  await db.batch([
    ...creditStmts,
    ...filmAwardStmts,
    ...literatureStmts,
    ...roleStmts,
  ]);
  console.log(
    `✓ seeded ${creditStmts.length} film credits, ${filmAwardStmts.length + literatureStmts.length + roleStmts.length} awards`
  );
}

interface ContentSeed {
  roles: Record<string, Record<string, RoleSeed>>;
  projects: Record<string, Record<string, ProjectSeed>>;
  skills: Record<string, { name: string; icon: string }[]>;
}
interface RoleSeed {
  title: string;
  me: string;
  about: { skill: string; hobby: string; description: string };
  resume: string;
  description: string[];
}
interface ProjectSeed {
  title: string;
  overview: { goal: string; user?: string };
  [role: string]: unknown;
}

async function seedContent() {
  const content: ContentSeed = JSON.parse(
    readFileSync(resolve(ROOT, "db/content-seed.json"), "utf8")
  );

  const stmts: { sql: string; args: (string | number | null)[] }[] = [];
  for (const table of [
    "role_profiles",
    "role_taglines",
    "project_i18n",
    "project_outcomes",
    "skills",
  ]) {
    stmts.push({ sql: `DELETE FROM ${table}`, args: [] });
  }

  for (const [locale, roles] of Object.entries(content.roles)) {
    for (const [role, r] of Object.entries(roles)) {
      stmts.push({
        sql: "INSERT INTO role_profiles (role, locale, title, me, about_skill, about_hobby, about_description, resume) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        args: [role, locale, r.title, r.me, r.about.skill, r.about.hobby, r.about.description, r.resume],
      });
      r.description.forEach((text, idx) =>
        stmts.push({
          sql: "INSERT INTO role_taglines (role, locale, sort_order, text) VALUES (?, ?, ?, ?)",
          args: [role, locale, idx, text],
        })
      );
    }
  }

  for (const [locale, byId] of Object.entries(content.projects)) {
    for (const [id, p] of Object.entries(byId)) {
      stmts.push({
        sql: "INSERT INTO project_i18n (project_id, locale, title, goal, user_text) VALUES (?, ?, ?, ?, ?)",
        args: [id, locale, p.title, p.overview.goal, p.overview.user ?? null],
      });
      for (const role of ["fe", "pm", "ui", "design"]) {
        const items = (p[role] as { outcomes?: { items?: string[] } } | undefined)
          ?.outcomes?.items;
        (items ?? []).forEach((text, idx) =>
          stmts.push({
            sql: "INSERT INTO project_outcomes (project_id, locale, role, sort_order, text) VALUES (?, ?, ?, ?, ?)",
            args: [id, locale, role, idx, text],
          })
        );
      }
    }
  }

  Object.entries(content.skills).forEach(([category, list], cIdx) =>
    list.forEach((s, idx) =>
      stmts.push({
        sql: "INSERT INTO skills (category, name, icon, sort_order, category_order) VALUES (?, ?, ?, ?, ?)",
        args: [category, s.name, s.icon, idx, cIdx],
      })
    )
  );

  await db.batch(stmts);
  console.log(`✓ seeded role/project/skill content (${stmts.length - 5} rows)`);
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
  await seedWorks();
  await seedContent();
  await seedMessages();
  console.log("✅ Seed complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
