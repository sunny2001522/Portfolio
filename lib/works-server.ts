import { filmCredits, literatureAwards } from "@/db/works-seed-data";
import type { Award, FilmCredit } from "./types";

export async function getFilmCredits(locale: string): Promise<FilmCredit[]> {
  const lang = locale === "en" ? "en" : "zh";
  return filmCredits.map((credit, index) => ({
    id: credit.id, year: credit.year,
    title: lang === "en" ? credit.titleEn : credit.title,
    format: credit.format[lang], role: credit.role[lang],
    awards: (credit.awards ?? []).map((award, i) => ({
      id: index * 100 + i, page: "film", creditId: credit.id,
      year: award.year ?? credit.year, name: award.name[lang],
      result: award.result?.[lang] ?? "", work: lang === "en" ? credit.titleEn : credit.title,
    })),
  }));
}

export async function getAwards(locale: string, page: Award["page"]): Promise<Award[]> {
  const lang = locale === "en" ? "en" : "zh";
  if (page === "film") return (await getFilmCredits(locale)).flatMap((credit) => credit.awards);
  if (page !== "literature") return [];
  return literatureAwards.map((award, index) => ({
    id: index, page, year: award.year ?? "", name: award.name[lang],
    result: award.result?.[lang] ?? "", work: award.work?.[lang] ?? "",
  }));
}
