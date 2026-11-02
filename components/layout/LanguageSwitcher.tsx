"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Portfolio");
  const otherLocale = locale === "en" ? "zh" : "en";
  return <Link className="language-switch" href={pathname} locale={otherLocale} aria-label={t("language")} hrefLang={otherLocale}>
    <span className="language-current">{locale.toUpperCase()}</span><span aria-hidden="true"> / </span>{otherLocale.toUpperCase()}
  </Link>;
}
