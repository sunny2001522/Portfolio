import Image from "next/image";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageIntro from "@/components/page/PageIntro";
import HirePanel from "@/components/page/HirePanel";
import { pageMetadata } from "@/lib/portfolio";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Portfolio" });
  return pageMetadata(locale, "photography", t("pages.photography.title"), t("pages.photography.bio"));
}
export default async function PhotographyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Portfolio");
  return <><PageIntro pageKey="photography" /><section id="selected-work" className="page-shell editorial-section"><h2 className="section-title">{t("photoTitle")}</h2><p className="body-copy">{t("photoBody")}</p><p className="editorial-note">{t("photographyNote")}</p><figure className="photography-work">{locale === "en" ? <div className="photography-summary english-preview"><p className="eyebrow">{t("summaryPreview")}</p><h3>{t("photoCaption")}</h3><p>{t("photoScope")}</p><a className="text-link" href="/design/taipei.webp" target="_blank" rel="noopener noreferrer">{t("openOriginal")} ↗</a></div> : <Image src="/design/taipei.webp" alt={t("photoCaption")} width={900} height={1200} sizes="(max-width: 760px) calc(100vw - 40px), 720px" className="photography-image" />}<figcaption>{t("photoCaption")}<br />{t("photoScope")}</figcaption></figure><Link className="text-link" href={`/${locale}/design#project-taipei`}>{t("pages.design.title")} ↗</Link></section><HirePanel /></>;
}
