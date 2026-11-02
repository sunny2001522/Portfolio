import PageIntro from "./PageIntro";
import Project from "./role/Project";
import RoleSelect from "../ui/RoleSelect";
import HirePanel from "./HirePanel";
import { getTranslations } from "next-intl/server";
import type { Role, RoleData } from "@/lib/types";

export default async function RolePage({ role, data }: { role: Role["key"]; data: RoleData }) {
  const t = await getTranslations("Portfolio");
  return <>
    <PageIntro pageKey={role} />
    <Project projects={data.projects} skills={data.skills} role={role} />
    <section className="page-shell related-disciplines"><h2 className="section-title">{t("allWork")}</h2><RoleSelect role={role} /></section>
    <HirePanel />
  </>;
}
