import { getLocale, getTranslations } from "next-intl/server";
import ProjectMedia from "../ProjectMedia";
import content from "@/db/content-seed.json";
import type { Project as ProjectData, Skills } from "@/lib/types";

interface Props { projects: ProjectData[]; skills?: Skills; role: string; heading?: string; }
interface ProjectCopy { title: string; overview: { goal: string; user?: string }; note?: string; [key: string]: unknown; }
const skillLabels: Record<string, string> = { "使用者故事": "User stories", "流程圖": "Flowcharts", "泳道圖": "Swimlanes", "易用性測試": "Usability testing" };

export default async function Project({ projects, role, heading }: Props) {
  const locale = await getLocale();
  const t = await getTranslations("Portfolio");
  const copies: Record<string, ProjectCopy> = content.projects[locale === "en" ? "en" : "zh"];
  const contribution = role === "builder" || role === "ai" ? "pm" : role;
  return <section id="selected-work" className="page-shell projects-section" aria-labelledby="projects-title">
    <div className="section-heading"><div><p className="eyebrow">{t("work")}</p><h2 id="projects-title" className="section-title">{heading || t("selectedWork")}</h2></div><span className="project-count">{String(projects.length).padStart(2, "0")}</span></div>
    <nav className="project-index" aria-label={t("projectIndex")}>{projects.map((project, index) => <a key={project.id} href={`#project-${project.id}`}><span>{String(index + 1).padStart(2, "0")}</span> {copies[project.id]?.title}</a>)}</nav>
    <div className="project-list">{projects.map((project, index) => {
      const copy = copies[project.id];
      if (!copy) return null;
      const details = copy[contribution] as { outcomes?: { items: string[] } } | undefined;
      const items = details?.outcomes?.items ?? [];
      return <article id={`project-${project.id}`} key={project.id} className="project-card" aria-labelledby={`title-${project.id}`}>
        <div className="project-left"><div className="project-meta"><span>{String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span><span>{project.year}</span></div><ProjectMedia image={project.thumbnail} video={project.video} title={copy.title} projectId={project.id} role={role} summary={copy.overview.goal} /></div>
        <div className="project-copy"><h3 id={`title-${project.id}`}>{copy.title}</h3><div><h4>{t("projectIntent")}</h4><p>{copy.overview.goal}</p></div>{copy.overview.user && <p className="project-audience"><span>{t("audience")}</span>{copy.overview.user}</p>}{items.length > 0 && <div><h4>{t("myContribution")}</h4><ul className="contribution-list">{items.map((item) => <li key={item}>{item}</li>)}</ul></div>}{copy.note && <p className="project-note">{copy.note}</p>}
          <ul className="skill-tags" aria-label={t("tools")}>{(project.skills ?? []).slice(0, 8).map((skill) => <li key={skill}>{locale === "en" ? skillLabels[skill] ?? skill : skill}</li>)}</ul>
          {project.links.length > 0 && <div className="project-links">{project.links.map((link) => <a key={`${link.type}-${link.url}`} className="text-link" href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`${copy.title} — ${link.type === "Web" ? t("viewProject") : link.type}`}>{link.type === "Web" ? t("viewProject") : link.type} <span aria-hidden="true">↗</span></a>)}</div>}
        </div>
      </article>;
    })}</div>
  </section>;
}
