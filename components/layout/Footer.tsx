import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { portfolioPages } from "@/lib/portfolio";

export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("Portfolio");
  return <footer className="site-footer">
    <div className="page-shell footer-top">
      <Link className="brand" href={`/${locale}`}>Sonia.</Link>
      <nav aria-label={t("allWork")} className="footer-nav">
        {portfolioPages.map((page) => <Link key={page.key} href={`/${locale}/${page.slug}`}>{t(`pages.${page.key}.title`)}</Link>)}
      </nav>
    </div>
    <div className="page-shell footer-bottom"><p>© {new Date().getFullYear()} Sonia Chen. {t("rights")}</p><div><a href="https://github.com/sunny2001522" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/sonia-chen-dev/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></div></div>
  </footer>;
}
