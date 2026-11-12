"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { FaPlay, FaTerminal } from "react-icons/fa";

const categories = [
  { key: "pastiche", label: "PASTICHE", image: "/ai/pastiche-01.webp" },
  { key: "video", label: "AI VIDEO", image: "/ai/true-self.webp" },
  { key: "comic", label: "COMIC", image: "/ai/comic-01.webp" },
  { key: "product", label: "PRODUCT", image: "/ai/product-01.webp" },
  { key: "generative", label: "GENERATIVE AI", image: "/ai/generative-01.webp" },
  { key: "song", label: "SONG", image: "/ai/suno-electric.webp" },
];

export default function AIShowcase() {
  const t = useTranslations("ai");
  const awards = t.raw("award") as string[];
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".ai-terminal-line", {
        opacity: 0,
        y: 12,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
      });
      gsap.from(".ai-category-card", {
        opacity: 0,
        y: 28,
        rotateX: -8,
        duration: 0.8,
        stagger: 0.08,
        delay: 0.35,
        ease: "power3.out",
      });
      gsap.to(".ai-pulse", {
        opacity: 0.35,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: "sine.inOut",
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative mx-auto w-full max-w-7xl px-4 py-16 md:px-8 md:py-24">
      <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-[#111]/[0.98] text-white shadow-2xl">
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3 font-mono text-xs text-white/50">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2">exuan@portfolio:~/ai</span>
        </div>
        <div className="grid gap-10 p-6 md:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="space-y-5">
            <div className="ai-terminal-line flex items-center gap-2 font-mono text-sm text-emerald-300">
              <FaTerminal className="text-xs" /> <span>./showcase --source wix --mode local</span>
            </div>
            <div className="ai-terminal-line space-y-2 font-mono text-sm leading-relaxed text-white/65">
              <p><span className="text-fuchsia-300">status</span>: synced</p>
              <p><span className="text-fuchsia-300">focus</span>: AI image · film · animation · song</p>
              <p><span className="text-fuchsia-300">signal</span>: <span className="ai-pulse text-emerald-300">● live</span></p>
            </div>
            <div className="ai-terminal-line border-l-2 border-fuchsia-400/60 pl-4">
              <h2 className="text-3xl font-black tracking-tight md:text-5xl">{t("title")}</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/65 md:text-base">{t("about.description")}</p>
            </div>
            <div className="ai-terminal-line flex flex-wrap gap-2 pt-2">
              {awards.slice(0, 4).map((award) => (
                <span key={award} className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] text-white/70">{award}</span>
              ))}
            </div>
          </div>
          <a href="https://www.youtube.com/watch?v=nVIFZ9jkByE" target="_blank" rel="noreferrer" className="ai-terminal-line group relative block overflow-hidden rounded-2xl border border-white/10 bg-black">
            <div className="aspect-video bg-[url('/ai/aiart-showreel.jpg')] bg-cover bg-center opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-xl transition group-hover:scale-110"><FaPlay className="ml-1" /></span>
            </div>
            <span className="absolute bottom-3 left-3 font-mono text-xs text-white/70">EXuan AI showreel · YouTube</span>
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-white/10 p-4 md:grid-cols-3 md:p-6">
          {categories.map((category) => (
            <div key={category.key} className="ai-category-card group relative overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <img src={category.image} alt={category.label} className="aspect-[4/3] w-full object-cover opacity-75 transition duration-500 group-hover:scale-110 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/50 to-transparent p-3 pt-8 font-mono text-[10px] tracking-[0.18em] text-white">{category.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
