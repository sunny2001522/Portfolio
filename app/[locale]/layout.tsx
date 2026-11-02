import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "../globals.css";
import { Climate_Crisis } from "next/font/google";

const climateCrisis = Climate_Crisis({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-climate", // 使用 CSS 變數
});

export function generateStaticParams() { return [{ locale: "en" }, { locale: "zh" }]; }

const SITE_URL = "https://exuan-dev.vercel.app";

const META = {
  zh: {
    title: "Sonia 陳羿瑄 · 作品集",
    description:
      "陳羿瑄 Sonia 的線上作品集：Product Builder、產品管理、前端、UI/UX、設計、AI 藝術、文學、影視與攝影。",
  },
  en: {
    title: "Sonia Chen · Portfolio",
    description:
      "Sonia Chen’s work in product building, product management, frontend, UI/UX, design, AI creative tools, literature, film, and photography.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale === "en" ? "en" : "zh"];
  const ogLocale = locale === "en" ? "en_US" : "zh_TW";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: m.title, template: "%s · Sonia" },
    description: m.description,
    applicationName: "Sonia Portfolio",
    keywords: locale === "en"
      ? ["Sonia Chen", "portfolio", "Product Builder", "frontend engineering", "UI/UX", "product management", "AI art", "literature", "film", "photography"]
      : ["Sonia Chen", "陳羿瑄", "作品集", "產品建構", "前端工程", "UI/UX", "產品管理", "AI 藝術", "文學", "影視", "攝影"],
    authors: [{ name: "Sonia Chen" }],
    alternates: {
      canonical: `/${locale}`,
      languages: { "zh-TW": "/zh", en: "/en" },
    },
    openGraph: {
      type: "website",
      siteName: "Sonia Portfolio",
      title: m.title,
      description: m.description,
      url: `${SITE_URL}/${locale}`,
      locale: ogLocale,
      images: [
        { url: "/og.png", width: 1200, height: 630, alt: "Sonia — Build Any Dream" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
      images: ["/og.png"],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // 等待 params
  const { locale } = await params;

  if (locale !== "en" && locale !== "zh") notFound();
  setRequestLocale(locale);

  // 提供消息給客戶端組件
  const messages = await getMessages();

  // GA4 Measurement ID — public (appears in page HTML), safe to commit.
  // Env var overrides the baked-in default if set.
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-ZYTWVNMS2Y";

  return (
    <html lang={locale}>
      <body
        className={`flex min-h-screen flex-col justify-between ${climateCrisis.variable}`}
      >
        <NextIntlClientProvider messages={{ Portfolio: messages.Portfolio }}>
          <Header />

          <main id="main-content" className="flex-grow w-full">
            {children}
          </main>

          <Footer />
        </NextIntlClientProvider>
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
