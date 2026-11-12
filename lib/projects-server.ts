import { db } from "./db";
import { projects as seedProjects } from "../db/seed-data";
import type { Project, Role } from "./types";

const LOCAL_AI_PROJECTS = seedProjects.filter((p) => p.category === "ai");
const PRODUCT_BUILDER_PROJECT_IDS = [
  "birthday-calendar",
  "gamified-weight-loss",
  "hotel-website",
  "social-media-tool",
  "ai-co-writing",
  "ai-video-content-generation",
] as const;
const LOCAL_PRODUCT_BUILDER_PROJECTS = seedProjects.filter((p) =>
  PRODUCT_BUILDER_PROJECT_IDS.includes(
    p.id as (typeof PRODUCT_BUILDER_PROJECT_IDS)[number],
  ),
);

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
  let projectsRes;
  let linksRes;
  let skillsRes;
  let imagesRes;

  try {
    [projectsRes, linksRes, skillsRes, imagesRes] = await Promise.all([
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
  } catch {
    return seedProjects;
  }

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

  const remoteProjects = projectsRes.rows.map((row) => ({
    id: row.id as string,
    year: row.year as string,
    thumbnail: row.thumbnail as string,
    video: (row.video as string | null) ?? undefined,
    images: imagesByProject.get(row.id as string) ?? [],
    category: row.category as string,
    links: linksByProject.get(row.id as string) ?? [],
    skills: skillsByProject.get(row.id as string) ?? [],
  }));
  const remoteIds = new Set(remoteProjects.map((project) => project.id));

  return [
    ...remoteProjects,
    ...LOCAL_AI_PROJECTS.filter((project) => !remoteIds.has(project.id)),
  ];
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
  if (role === "ai") return LOCAL_AI_PROJECTS;
  if (role === "film" || role === "photo") {
    return seedProjects.filter((project) => project.category === role);
  }
  if (role === "product-builder") {
    const all = await getAllProjects();
    const projectsById = new Map<string, Project>();
    for (const project of LOCAL_PRODUCT_BUILDER_PROJECTS) {
      projectsById.set(project.id, project);
    }
    for (const project of all) {
      projectsById.set(project.id, project);
    }

    return PRODUCT_BUILDER_PROJECT_IDS.map((id) => projectsById.get(id)).filter(
      (project): project is Project => Boolean(project),
    );
  }

  const all = await getAllProjects();
  return all.filter((p) => {
    if (!p.skills) return false;
    if (role === "design") {
      return (
        p.category === "design" ||
        p.skills.some((s) => s === "Photoshop" || s === "Illustrator")
      );
    }
    if (role === "film") return p.category === "film";
    if (role === "photo") return p.category === "photo";
    if (role === "fe") return p.skills.some((s) => FE_SKILLS.has(s));
    if (role === "ui") {
      if (p.category === "design") return false;
      return p.skills.some((s) => UI_SKILLS.has(s));
    }
    if (role === "pm") return p.skills.some((s) => PM_SKILLS.has(s));
    return false;
  });
}
