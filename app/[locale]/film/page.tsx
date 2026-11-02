import { getTranslations, setRequestLocale } from "next-intl/server";
import { getFilmCredits } from "@/lib/works-server";
import PageIntro from "@/components/page/PageIntro";
import HirePanel from "@/components/page/HirePanel";
import { pageMetadata } from "@/lib/portfolio";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Portfolio" });
  return pageMetadata(locale, "film", t("pages.film.title"), t("pages.film.bio"));
}
export default async function FilmPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Portfolio");
  const tFilm = await getTranslations("Film");
  const credits = await getFilmCredits(locale);
  const years = Array.from(new Set(credits.map((credit) => credit.year)));
  return <><PageIntro pageKey="film" /><section id="selected-work" className="page-shell editorial-section"><p className="eyebrow">{t("work")}</p><h2 className="section-title">{t("credits")}</h2><p className="editorial-note">{t("translatedTitles")}</p>{years.map((year) => <div key={year || "undated"}><h3 className="credit-year">{year || tFilm("undated")}</h3><ul className="credit-list">{credits.filter((credit) => credit.year === year).map((credit) => <li key={credit.id}><div className="credit-title"><h4>{credit.title}</h4><span>{credit.format}</span></div><p className="credit-role">{credit.role}</p>{credit.awards.length > 0 && <ul className="credit-awards">{credit.awards.map((award) => <li key={award.id}>{award.name}{award.result ? ` · ${award.result}` : ""}</li>)}</ul>}</li>)}</ul></div>)}</section><HirePanel /></>;
}
