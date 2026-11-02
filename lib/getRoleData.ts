import { getRoleProjects } from "./projects-server";
import { contact, resume } from "./data";
import { getSkills } from "./content-server";
import type { Role, RoleData } from "./types";

export async function getRoleData(role: Role["key"]): Promise<RoleData> {
  const [projects, skills] = await Promise.all([getRoleProjects(role), getSkills()]);
  return { projects, skills, contact, resume };
}
