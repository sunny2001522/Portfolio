import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import { portfolioPages, type PortfolioKey } from "@/lib/portfolio";

export default async function PageIntro({ pageKey }: { pageKey: PortfolioKey }) {
  const t = await getTranslations("Portfolio");
  const locale = await getLocale();
  const page = portfolioPages.find((item) => item.key === pageKey)!;
  const deliverables = t.raw(`pages.${pageKey}.deliverables`) as { title: string; body: string }[];
  return <>
    <section className="page-intro page-shell" style={{ "--page-accent": page.accent } as React.CSSProperties}>
      <div className="intro-copy"><Link className="breadcrumb" href={`/${locale}/#disciplines`}>← {t("allWork")}</Link><p className="eyebrow">{t("name")}</p><h1 className="page-title">{t(`pages.${pageKey}.title`)}</h1><p className="page-summary">{t(`pages.${pageKey}.summary`)}</p><p className="body-copy">{t(`pages.${pageKey}.bio`)}</p><div className="intro-actions"><a className="button-primary" href="#selected-work">{t("selectedWork")} <span aria-hidden="true">↓</span></a><a className="text-link" href="#contact">{t("contact")} ↗</a></div></div>
      <div className={`intro-visual ${["builder", "pm", "fe", "ui", "design"].includes(pageKey) ? "character-visual" : "work-visual"}`} aria-hidden="true"><span className="visual-orbit" /><Image src={locale === "en" && ["ai", "literature", "photography"].includes(pageKey) ? "/shape/shape13.webp" : page.image} alt="" fill sizes="(max-width: 700px) 40vw, 360px" priority className="intro-image" /><span className="visual-index">{String(portfolioPages.indexOf(page) + 1).padStart(2, "0")}</span></div>
    </section>
    <section className="page-shell capabilities" aria-labelledby="capabilities-title"><div><p className="eyebrow" id="capabilities-title">{t("contributions")}</p><p className="fit-copy">{t(`pages.${pageKey}.fit`)}</p></div><div className="capability-grid">{deliverables.map((item, index) => <div className="capability" key={item.title}><span className="item-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p></div>)}</div></section>
  </>;
}
