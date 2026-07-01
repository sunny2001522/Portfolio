import type { Metadata } from "next";
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

const SITE_URL = "https://exuan-dev.vercel.app";

const META = {
  zh: {
    title: "Sonia 陳羿瑄 · 作品集",
    description:
      "陳羿瑄 Sonia 的線上作品集：前端工程、UI/UX 設計、產品經理與視覺設計，跨領域把想法做成能上線的產品。",
  },
  en: {
    title: "Sonia Chen · Portfolio",
    description:
      "Sonia's portfolio — frontend engineering, UI/UX design, product management and visual design. A cross-discipline builder turning ideas into shipped products.",
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
    keywords: [
      "Sonia",
      "陳羿瑄",
      "Sonia Chen",
      "作品集",
      "portfolio",
      "前端工程師",
      "frontend developer",
      "UI/UX",
      "產品經理",
      "product manager",
      "設計",
    ],
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

  // 啟用靜態渲染
  setRequestLocale(locale);

  // 提供消息給客戶端組件
  const messages = await getMessages();

  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang={locale}>
      <body
        className={`flex min-h-screen flex-col justify-between ${climateCrisis.variable}`}
      >
        <NextIntlClientProvider messages={messages}>
          <Header />

          <main className="flex-grow z-0 overflow-hidden w-full">
            {children}
          </main>

          <Footer />
        </NextIntlClientProvider>
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
