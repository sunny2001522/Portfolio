import type { Metadata } from "next";

export const portfolioPages = [
  { key: "builder", slug: "product-builder", accent: "#dccaf1", image: "/character/pm.webp" },
  { key: "pm", slug: "pm", accent: "#cdd5fa", image: "/character/pm.webp" },
  { key: "fe", slug: "fe", accent: "#b7edf0", image: "/character/fe.webp" },
  { key: "ui", slug: "ui", accent: "#ffcec1", image: "/character/ui.webp" },
  { key: "design", slug: "design", accent: "#ffe1a6", image: "/character/design.webp" },
  { key: "ai", slug: "ai-art", accent: "#e0d9fc", image: "/web/dreamake.webp" },
  { key: "literature", slug: "literature", accent: "#dce9c8", image: "/design/book.webp" },
  { key: "film", slug: "film", accent: "#ccdce9", image: "/shape/shape10.webp" },
  { key: "photography", slug: "photography", accent: "#f5d6d2", image: "/design/taipei.webp" },
] as const;

export type PortfolioKey = typeof portfolioPages[number]["key"];
export const siteUrl = "https://exuan-dev.vercel.app";

export function pageMetadata(locale: string, slug: string, title: string, description: string): Metadata {
  const path = slug ? `/${slug}` : "";
  return {
    title, description,
    alternates: { canonical: `/${locale}${path}`, languages: { "zh-TW": `/zh${path}`, en: `/en${path}` } },
    openGraph: { title: `${title} · Sonia Chen`, description, url: `${siteUrl}/${locale}${path}` },
    twitter: { title: `${title} · Sonia Chen`, description },
  };
}
