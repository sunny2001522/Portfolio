import { projects } from "@/db/seed-data";
import content from "@/db/content-seed.json";
import type { Project, Role } from "./types";

export async function getAllProjects(): Promise<Project[]> {
  return projects;
}

// A documented contribution determines placement; a tool tag alone does not
// prove authorship. This also keeps interface concepts in the UI/UX portfolio.
export async function getRoleProjects(role: Role["key"]): Promise<Project[]> {
  const contribution = role === "builder" ? "pm" : role;
  const priority = role === "pm"
    ? ["longterm-treasure-app", "longterm-treasure-web", "warrant-landing-page", "gamified-weight-loss"]
    : role === "builder" ? ["warrant-landing-page", "longterm-treasure-web", "ai-co-writing", "birthday-calendar"] : [];
  return projects.filter((project) => {
    const copy = content.projects.en[project.id as keyof typeof content.projects.en];
    if (!copy || !(contribution in copy)) return false;
    const section = (copy as Record<string, unknown>)[contribution] as
      { outcomes?: { items?: string[] } } | undefined;
    return Boolean(section?.outcomes?.items?.length);
  }).sort((a, b) => {
    const ai = priority.indexOf(a.id), bi = priority.indexOf(b.id);
    return (ai < 0 ? priority.length : ai) - (bi < 0 ? priority.length : bi);
  });
}
