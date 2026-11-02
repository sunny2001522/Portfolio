import Image from "next/image";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import RoleSelect from "@/components/ui/RoleSelect";
import Project from "@/components/page/role/Project";
import HirePanel from "@/components/page/HirePanel";
import { getAllProjects } from "@/lib/projects-server";
import { pageMetadata } from "@/lib/portfolio";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Portfolio" });
  return pageMetadata(locale, "", t("name"), t("intro"));
}
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Portfolio");
  const evidence = t.raw("evidence") as { value: string; label: string }[];
  const experience = t.raw("experience") as { date: string; title: string; body: string }[];
  const all = await getAllProjects();
  const selected = ["warrant-landing-page", "gamified-weight-loss", "ai-co-writing"].flatMap((id) => all.filter((p) => p.id === id));
  return <>
    <section className="home-hero page-shell">
      <div className="home-hero-copy"><p className="eyebrow">{t("eyebrow")}</p><h1 className="home-title">{t("headline")}<br /><span>{t("headlineAccent")}</span></h1><p className="home-bio">{t("intro")}</p><div className="intro-actions"><a className="button-primary" href="#disciplines">{t("explore")} <span aria-hidden="true">↓</span></a><a className="text-link" href="#contact">{t("contact")} ↗</a></div></div>
      <div className="home-art" aria-hidden="true"><div className="home-art-circle" /><Image className="home-shape" src="/shape/shape10.webp" alt="" width={100} height={100} sizes="100px" /><div className="home-character home-character-back"><Image src="/character/design.webp" alt="" fill sizes="180px" /></div><div className="home-character home-character-front"><Image src="/character/pm.webp" alt="" fill sizes="260px" priority /></div><span className="art-label">Product Builder<br />Sonia Chen</span><span className="art-star">✳</span></div>
    </section>
    <div className="home-evidence page-shell">{evidence.map((item) => <div key={item.value}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div>
    <section id="disciplines" className="page-shell directory-section"><div className="section-heading"><div><p className="eyebrow">{t("work")}</p><h2 className="section-title">{t("directoryTitle")}</h2></div></div><p className="section-description">{t("directoryIntro")}</p><RoleSelect /></section>
    <Project projects={selected} role="builder" heading={t("homeWork")} />
    <section className="page-shell experience-section"><h2 className="section-title">{t("experienceTitle")}</h2><div className="experience-list">{experience.map((item) => <div key={item.title}><span>{item.date}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></div>)}</div><Link className="text-link" href={`/${locale}/product-builder`}>{t("pages.builder.title")} ↗</Link></section>
    <HirePanel />
  </>;
}
