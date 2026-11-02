import { getLocale, getTranslations } from "next-intl/server";

export default async function HirePanel() {
  const locale = await getLocale();
  const t = await getTranslations("Portfolio");
  return <section id="contact" className="contact-panel page-shell" aria-labelledby="contact-title">
    <div><p className="eyebrow">{t("contact")}</p><h2 id="contact-title" className="section-title">{t("contactTitle")}</h2><p className="body-copy">{t("contactBody")}</p></div>
    <div className="contact-actions"><a className="button-primary" href="mailto:yishiuan522@gmail.com">{t("email")} <span aria-hidden="true">↗</span></a><a className="button-secondary" href={locale === "en" ? "/SoniaResumeEn.pdf" : "/SoniaResumeZh.pdf"} download>{t("resume")} <span aria-hidden="true">↓</span></a><a className="contact-address" href="mailto:yishiuan522@gmail.com">yishiuan522@gmail.com</a></div>
  </section>;
}
