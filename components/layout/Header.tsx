"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { portfolioPages } from "@/lib/portfolio";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const locale = useLocale();
  const t = useTranslations("Portfolio");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = portfolioPages.find((page) => pathname === `/${locale}/${page.slug}`);
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">{t("skip")}</a>
      <div className="header-inner">
        <Link className="brand" href={`/${locale}`} onClick={() => setOpen(false)} aria-label={t("name")}>
          <Image src="/shape/shape1.webp" alt="" width={32} height={32} sizes="32px" />
          <span>Sonia<span className="brand-dot">.</span></span>
        </Link>
        <nav aria-label={t("navLabel")} className="header-actions">
          <Link className="header-work" href={`/${locale}/#disciplines`} onClick={() => setOpen(false)}>{t("work")}</Link>
          <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="discipline-menu" onClick={() => setOpen(!open)}>
            {open ? t("closeMenu") : t("menu")} <span aria-hidden="true">{open ? "−" : "+"}</span>
          </button>
          <Link className="header-contact" href="#contact" onClick={() => setOpen(false)}>{t("contact")} <span aria-hidden="true">↗</span></Link>
          <LanguageSwitcher />
        </nav>
      </div>
      {open && <nav id="discipline-menu" className="discipline-menu" aria-label={t("menu")}>
        {portfolioPages.map((page, index) => <Link key={page.key} href={`/${locale}/${page.slug}`} aria-current={active?.key === page.key ? "page" : undefined} onClick={() => setOpen(false)}>
          <span className="menu-number" style={{ backgroundColor: page.accent }}>{String(index + 1).padStart(2, "0")}</span>
          {t(`pages.${page.key}.title`)} <span aria-hidden="true">↗</span>
        </Link>)}
      </nav>}
    </header>
  );
}
