import { getTranslations, setRequestLocale } from "next-intl/server";
import PageIntro from "@/components/page/PageIntro";
import Project from "@/components/page/role/Project";
import HirePanel from "@/components/page/HirePanel";
import { getAllProjects } from "@/lib/projects-server";
import { pageMetadata } from "@/lib/portfolio";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Portfolio" });
  return pageMetadata(locale, "ai-art", t("pages.ai.title"), t("pages.ai.bio"));
}
export default async function AIArtPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Portfolio");
  const projects = (await getAllProjects()).filter((project) => ["ai-co-writing", "ai-video-content-generation"].includes(project.id));
  return <><PageIntro pageKey="ai" /><div className="page-shell"><p className="editorial-note">{t("aiNote")}</p></div><Project projects={projects} role="ai" heading={t("aiSection")} /><HirePanel /></>;
}
