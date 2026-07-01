import { getRoleProjects } from "./projects-server";
import { skills, contact, resume } from "./data";
import type { Role, RoleData } from "./types";

export async function getRoleData(role: Role["key"]): Promise<RoleData> {
  const projects = await getRoleProjects(role);
  return { projects, skills, contact, resume };
}
