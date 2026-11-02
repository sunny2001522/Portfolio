import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { projects } from "../../db/seed-data";
import content from "../../db/content-seed.json";
import en from "../../db/messages.en.json";
import zh from "../../db/messages.zh.json";
import { getRoleProjects } from "../../lib/projects-server";
import { getFilmCredits, getAwards } from "../../lib/works-server";
import { portfolioPages } from "../../lib/portfolio";

async function main() {
  const cjk = /[\u3400-\u9fff]/u;
  assert.equal(new Set(projects.map(p => p.id)).size, projects.length, "Unique project IDs");
  for (const project of projects) {
    for (const asset of [project.thumbnail, project.video, ...(project.images ?? [])].filter(Boolean)) {
      assert(existsSync(`public${asset}`), `Missing media: ${asset}`);
    }
    assert(project.id in content.projects.en && project.id in content.projects.zh, `Missing translation: ${project.id}`);
  }
  const strings = (value: unknown): string[] => typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : [];
  assert(!strings(en).some(s => cjk.test(s)), "English UI contains CJK");
  assert(!strings(content.projects.en).some(s => cjk.test(s)), "English project copy contains CJK");
  assert.deepEqual(Object.keys(en.Portfolio.pages), Object.keys(zh.Portfolio.pages));
  assert.equal(portfolioPages.length, 9);
  for (const role of ["builder", "pm", "fe", "ui", "design"] as const) {
    const selected = await getRoleProjects(role);
    assert(selected.length > 0, `Empty role: ${role}`);
    const key = role === "builder" ? "pm" : role;
    for (const project of selected) {
      const copy = content.projects.en[project.id as keyof typeof content.projects.en] as Record<string, unknown>;
      const contribution = copy[key] as { outcomes: { items: string[] } };
      assert(contribution.outcomes.items.length > 0, `${role}: no contribution for ${project.id}`);
    }
  }
  assert((await getRoleProjects("ui")).some(p=>p.id==="metro-app"), "UI concept was wrongly filtered out");
  assert((await getRoleProjects("ui")).some(p=>p.id==="longterm-treasure-app"), "App design contribution missing");
  assert(!strings(await getFilmCredits("en")).some(s=>cjk.test(s)), "Film English contains CJK");
  assert(!strings(await getAwards("en", "literature")).some(s=>cjk.test(s)), "Award English contains CJK");
  for (const resume of ["SoniaResumeEn.pdf", "SoniaResumeZh.pdf"]) assert(existsSync(`public/${resume}`));
  console.info(`PASS: ${projects.length} projects, 9 disciplines, bilingual copy, media paths, contribution-based placement, translated film/awards, resume assets.`);
}
main().catch(error=>{ console.error(error); process.exitCode=1; });
