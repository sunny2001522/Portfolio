import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAwards } from "@/lib/works-server";
import AwardList from "@/components/page/AwardList";
import PageIntro from "@/components/page/PageIntro";
import HirePanel from "@/components/page/HirePanel";
import { pageMetadata } from "@/lib/portfolio";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Portfolio" });
  return pageMetadata(locale, "literature", t("pages.literature.title"), t("pages.literature.bio"));
}
export default async function LiteraturePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Portfolio");
  const tLiterature = await getTranslations("Literature");
  const awards = await getAwards(locale, "literature");
  const publications = tLiterature.raw("publications") as string[];
  return <><PageIntro pageKey="literature" /><section id="selected-work" className="page-shell editorial-section"><h2 className="section-title">{t("awards")}</h2><AwardList awards={awards} /><p className="editorial-note">{t("translatedTitles")}</p></section><section className="page-shell editorial-section"><h2 className="section-title">{t("publications")}</h2><ul className="publication-list">{publications.map((publication) => <li key={publication}>{publication}</li>)}</ul><div className="editorial-callout"><h3>{t("writingBridge")}</h3><p>{t("writingBridgeBody")}</p><Link className="text-link" href={`/${locale}/product-builder#project-ai-co-writing`}>{t("writingLink")} ↗</Link></div></section><HirePanel /></>;
}
