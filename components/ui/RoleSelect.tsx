import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { portfolioPages } from "@/lib/portfolio";

export default async function RoleSelect({ role }: { role?: string }) {
  const locale = await getLocale();
  const t = await getTranslations("Portfolio");
  return <nav className="discipline-grid" aria-label={t("navLabel")}>
    {portfolioPages.filter((page) => page.key !== role).map((page) => <Link className="discipline-card" key={page.key} href={`/${locale}/${page.slug}`} style={{ "--card-accent": page.accent } as React.CSSProperties}>
      <div className="discipline-card-top"><span>{String(portfolioPages.indexOf(page) + 1).padStart(2, "0")}</span><span className="discipline-arrow" aria-hidden="true">↗</span></div><h3>{t(`pages.${page.key}.title`)}</h3><p>{t(`pages.${page.key}.summary`)}</p>
    </Link>)}
  </nav>;
}
