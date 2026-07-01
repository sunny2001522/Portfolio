import { db } from "./db";
import type { Project, Role } from "./types";

const FE_SKILLS = new Set([
  "React",
  "Next.js",
  "Redux",
  "TanStack",
  "Shadcn",
  "GSAP",
  "Lottie",
  "Swiper",
  "TailwindCSS",
  "i18n",
  "Git",
  "MongoDB",
  "Restful API",
  "Supabase",
  "Playwright",
]);

const UI_SKILLS = new Set([
  "Figma",
  "Photoshop",
  "Illustrator",
  "UI/UX",
  "GSAP",
  "Lottie",
  "Spline",
  "Swiper",
]);

const PM_SKILLS = new Set(["Jira", "Notion", "Swimlane", "Confluence"]);

async function getAllProjectsUncached(): Promise<Project[]> {
  const [projectsRes, linksRes, skillsRes, imagesRes] = await Promise.all([
    db.execute(
      "SELECT id, year, thumbnail, video, category FROM projects ORDER BY sort_order ASC"
    ),
    db.execute(
      "SELECT project_id, type, url FROM project_links ORDER BY id ASC"
    ),
    db.execute(
      "SELECT project_id, skill_name FROM project_skills ORDER BY sort_order ASC"
    ),
    db.execute(
      "SELECT project_id, url FROM project_images ORDER BY sort_order ASC"
    ),
  ]);

  const linksByProject = new Map<string, Project["links"]>();
  for (const row of linksRes.rows) {
    const pid = row.project_id as string;
    const arr = linksByProject.get(pid) ?? [];
    arr.push({
      type: row.type as Project["links"][number]["type"],
      url: row.url as string,
    });
    linksByProject.set(pid, arr);
  }

  const skillsByProject = new Map<string, string[]>();
  for (const row of skillsRes.rows) {
    const pid = row.project_id as string;
    const arr = skillsByProject.get(pid) ?? [];
    arr.push(row.skill_name as string);
    skillsByProject.set(pid, arr);
  }

  const imagesByProject = new Map<string, string[]>();
  for (const row of imagesRes.rows) {
    const pid = row.project_id as string;
    const arr = imagesByProject.get(pid) ?? [];
    arr.push(row.url as string);
    imagesByProject.set(pid, arr);
  }

  return projectsRes.rows.map((row) => ({
    id: row.id as string,
    year: row.year as string,
    thumbnail: row.thumbnail as string,
    video: (row.video as string | null) ?? undefined,
    images: imagesByProject.get(row.id as string) ?? [],
    category: row.category as string,
    links: linksByProject.get(row.id as string) ?? [],
    skills: skillsByProject.get(row.id as string) ?? [],
  }));
}

// In-memory cache: project data only changes on `npm run db:seed`, so avoid
// re-hitting remote Turso on every navigation. Persists for the server process.
let _projectsCache: { at: number; data: Promise<Project[]> } | null = null;
const PROJECTS_TTL_MS = 10 * 60 * 1000;

export function getAllProjects(): Promise<Project[]> {
  const now = Date.now();
  if (_projectsCache && now - _projectsCache.at < PROJECTS_TTL_MS) {
    return _projectsCache.data;
  }
  const data = getAllProjectsUncached();
  _projectsCache = { at: now, data };
  // On failure, drop the cache so the next request retries instead of caching the error.
  data.catch(() => {
    if (_projectsCache?.data === data) _projectsCache = null;
  });
  return data;
}

export async function getRoleProjects(role: Role["key"]): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => {
    if (!p.skills) return false;
    if (role === "design") {
      return (
        p.category === "design" ||
        p.skills.some((s) => s === "Photoshop" || s === "Illustrator")
      );
    }
    if (role === "fe") return p.skills.some((s) => FE_SKILLS.has(s));
    if (role === "ui") {
      if (p.category === "design") return false;
      return p.skills.some((s) => UI_SKILLS.has(s));
    }
    if (role === "pm") return p.skills.some((s) => PM_SKILLS.has(s));
    return false;
  });
}
