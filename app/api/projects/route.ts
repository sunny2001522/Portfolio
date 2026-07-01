import { NextResponse } from "next/server";
import { getAllProjects, getRoleProjects } from "@/lib/projects-server";
import type { Role } from "@/lib/types";

const VALID_ROLES: ReadonlySet<Role["key"]> = new Set([
  "fe",
  "ui",
  "pm",
  "design",
]);

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const hasRole = params.has("role");
  const role = params.get("role");
  if (hasRole && !VALID_ROLES.has(role as Role["key"])) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  const projects = hasRole
    ? await getRoleProjects(role as Role["key"])
    : await getAllProjects();
  return NextResponse.json({ projects });
}
