"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { trackLinkClick, trackProjectView, trackProjectDwell } from "@/lib/analytics";
import { FaGithub, FaApple, FaGooglePlay } from "react-icons/fa";
import { MdOutlineWebAsset } from "react-icons/md";
import { PiStarFourFill } from "react-icons/pi";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { Project as GlobalProject } from "@/lib/types";
type Project = GlobalProject;

type Skill = {
  name: string;
  icon: string;
};

type CategorizedSkills = Record<string, Skill[]>;

interface ProjectProps {
  projects: Project[];
  skills: CategorizedSkills;
  role: string;
}

gsap.registerPlugin(ScrollTrigger);

export default function Project({
  projects,
  skills: categorizedSkills,
  role,
}: ProjectProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const t = useTranslations("projects");

  const containerRef = useRef<HTMLDivElement>(null);

  const activeProject = projects[activeIndex];
  // 大螢幕（此元件僅在 md+ 顯示）只要該作品有影片就播放，不再限制 category。
  const activeVideo = activeProject?.video || null;

  // GA：追蹤使用者停在哪個作品（切換時送 view + 上一個作品的停留秒數）
  const dwellRef = useRef({ index: 0, since: 0 });
  useEffect(() => {
    if (dwellRef.current.since === 0) dwellRef.current.since = Date.now();
    const prev = dwellRef.current;
    if (prev.index !== activeIndex) {
      const prevProject = projects[prev.index];
      if (prevProject) {
        trackProjectDwell({
          project_id: prevProject.id,
          role,
          seconds: Math.round((Date.now() - prev.since) / 1000),
        });
      }
      dwellRef.current = { index: activeIndex, since: Date.now() };
    }
    const cur = projects[activeIndex];
    if (cur) {
      trackProjectView({
        project_id: cur.id,
        project_title: t(`${cur.id}.title`),
        role,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  // 技能分類篩選邏輯
  const filteredCategories = Object.entries(categorizedSkills).filter(
    ([category]) => {
      if (role === "fe") {
        return !["UI", "UX", "Project Management"].includes(category);
      }
      return true;
    },
  );

  // 安全取得翻譯陣列的方法，避免因為 key 不存在導致 next-intl 拋出錯誤造成白畫面
  const getOutcomes = (projectId: string, currentRole: string) => {
    try {
      const items = t.raw(`${projectId}.${currentRole}.outcomes.items`);
      return Array.isArray(items) ? items : [];
    } catch (error) {
      return [];
    }
  };

  // 安全取得「目標使用者」描述，缺少時回傳空字串（區塊自動隱藏）
  const getUser = (projectId: string) => {
    try {
      const v = t.raw(`${projectId}.overview.user`);
      return typeof v === "string" ? v : "";
    } catch (error) {
      return "";
    }
  };

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // 每張作品分配 100vh 的捲動範圍；最後 +50vh 緩衝避免 pin 釋放時與下一段疊在一起
        const totalScroll = projects.length * 100 + 50;
        ScrollTrigger.create({
          trigger: containerRef.current,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          start: "top top",
          end: () => `+=${totalScroll}%`,
          scrub: 0.2,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const newIndex = Math.min(
              Math.floor(self.progress * projects.length),
              projects.length - 1,
            );
            if (newIndex !== currentIndexRef.current) {
              currentIndexRef.current = newIndex;
              setActiveIndex(newIndex);
            }
          },
        });

        // 背景文字視差
        gsap.to(".bg-text", {
          y: -100,
          opacity: 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${totalScroll}%`,
            scrub: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [projects] },
  );

  // 移除切換動畫，避免白畫面問題
  // 內容直接切換，不做任何動畫

  if (!activeProject) return null;

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-hidden bg-white relative flex items-center"
    >
      {/* 背景裝飾 */}
      <div className="bg-text absolute top-10 left-10 z-0 opacity-10 pointer-events-none select-none">
        <h2 className="text-[100px] font-bold leading-none uppercase tracking-tighter">
          Projects
        </h2>
      </div>

      <div className="w-full h-full md:grid md:grid-cols-12 gap-12 p-10 relative z-10 pt-16 md:pt-20">
        {/* 左側：技能欄位（PM 頁不顯示） */}
        <div
          className={`hidden md:col-span-5 flex-col gap-4 h-full pr-4 overflow-visible relative z-20 ${
            role === "pm" ? "md:hidden" : "md:flex"
          }`}
        >
          <div className="space-y-4">
            {filteredCategories.map(([category, skills]) => (
              <div key={category} className="space-y-2">
                <div className="text-[9px] font-bold text-gray-600 uppercase border-b border-gray-200 pb-1">
                  {category}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => {
                    const isUsed = activeProject.skills?.includes(skill.name);
                    return (
                      <div
                        key={skill.name}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-500 ${
                          isUsed
                            ? "opacity-100 bg-white/80 shadow-sm ring-1 ring-gray-300 scale-105"
                            : "opacity-40 grayscale-[50%]"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <Image
                            src={skill.icon}
                            alt={skill.name}
                            width={14}
                            height={14}
                            className="object-contain"
                          />
                        </div>
                        <span className="text-[8px] font-bold text-gray-600 whitespace-nowrap">
                          {skill.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右側：作品展示與說明 - 限制最大寬度避免在大螢幕上過寬 */}
        <div
          className={`col-span-12 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 h-full ${
            role === "pm" ? "md:col-span-12" : "md:col-span-7"
          }`}
        >
          {/* 左：作品媒體視窗 - 固定 16:9 */}
          <div className="project-content w-full lg:w-[58%] lg:max-w-[58%] self-center aspect-video bg-white/40 backdrop-blur-xl rounded-2xl border-2 border-white/50 shadow-2xl overflow-hidden relative group flex-shrink-0">
            <div className="absolute top-0 left-0 w-full h-7 bg-white/80 flex items-center px-4 gap-1.5 z-20 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full bg-[#FF5F56]" />
              <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
              <div className="w-2 h-2 rounded-full bg-[#27C93F]" />
              <span className="ml-4 text-[9px] text-gray-400 font-mono tracking-widest uppercase truncate font-bold">
                {activeProject.id}
              </span>
            </div>

            <div className="w-full h-full pt-7">
              <div className="relative w-full h-full bg-gray-50">
                {/* 效能：只掛載當前 ±1 的作品媒體，避免首屏一次載入全部縮圖（造成首頁→作品頁卡 10 秒） */}
                {projects.map((p, idx) => {
                  if (Math.abs(idx - activeIndex) > 1) return null;
                  const visibility = `transition-opacity duration-200 ${
                    idx === activeIndex ? "opacity-100 z-10" : "opacity-0"
                  }`;

                  // app 類：三個手機畫面並排，中間那支抬高
                  if (p.category === "app") {
                    const phones = (
                      p.images && p.images.length ? p.images : [p.thumbnail]
                    ).slice(0, 3);
                    return (
                      <div
                        key={p.id}
                        className={`absolute inset-0 flex items-end justify-center gap-2 md:gap-4 px-4 pb-2 bg-gradient-to-br from-gray-100 to-gray-200 ${visibility}`}
                      >
                        {phones.map((src, i) => (
                          <div
                            key={i}
                            className={`relative aspect-[9/19] rounded-[1.4rem] border-[6px] border-gray-900 bg-gray-900 shadow-2xl overflow-hidden ${
                              i === 1 ? "h-[94%] z-10" : "h-[82%]"
                            }`}
                          >
                            <Image
                              src={src}
                              alt={p.id}
                              fill
                              sizes="(max-width: 768px) 30vw, 15vw"
                              quality={75}
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    );
                  }

                  return (
                    <Image
                      key={p.id}
                      src={p.thumbnail}
                      alt={p.id}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={75}
                      {...(idx === activeIndex
                        ? { priority: true }
                        : { loading: "lazy" as const })}
                      className={`object-cover ${visibility}`}
                    />
                  );
                })}
                {/* 當前 project 若有影片，蓋在縮圖上層自動播放 */}
                {activeVideo && (
                  <video
                    key={activeProject.id}
                    src={activeVideo}
                    poster={activeProject.thumbnail}
                    className="absolute inset-0 w-full h-full object-cover z-20"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                  />
                )}
              </div>
            </div>
          </div>

          {/* 右：作品解說 */}
          <div className="flex-1 lg:w-[42%] flex flex-col gap-5 overflow-hidden lg:max-h-full lg:py-2">
            <div className="flex justify-between items-end gap-3 flex-shrink-0">
              <div>
                <div className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                  {activeProject.year} Project
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-800 tracking-tighter leading-tight">
                  {t(`${activeProject.id}.title`)}
                </h3>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {activeProject.links?.map((link) => (
                  <a
                    key={link.type}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackLinkClick({
                        link_type: link.type,
                        project_id: activeProject.id,
                        role,
                        url: link.url,
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-[10px] font-bold hover:bg-black transition-all"
                  >
                    {link.type === "GitHub" && <FaGithub size={14} />}
                    {link.type === "Web" && <MdOutlineWebAsset size={14} />}
                    {link.type === "App Store" && <FaApple size={14} />}
                    {link.type === "Google Play" && <FaGooglePlay size={14} />}
                    {link.type}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 lg:pr-3">
              {/* Overview */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-l-2 border-gray-300 pl-2">
                  Overview · 專案概述
                </h5>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {t(`${activeProject.id}.overview.goal`)}
                </p>
              </div>

              {/* 目標使用者 */}
              {getUser(activeProject.id) && (
                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-l-2 border-gray-300 pl-2">
                    Target User · 目標使用者
                  </h5>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    {getUser(activeProject.id)}
                  </p>
                </div>
              )}

              {/* Key Outcomes */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-l-2 border-gray-300 pl-2">
                  Key Outcomes · 關鍵成果
                </h5>
                <ul className="space-y-2.5">
                  {getOutcomes(activeProject.id, role)
                    .slice(0, 4)
                    .map((item, i) => (
                      <li
                        key={i}
                        className="text-[13px] text-gray-600 leading-relaxed flex items-start gap-2"
                      >
                        <PiStarFourFill
                          className="text-gray-400 flex-shrink-0 mt-1"
                          size={12}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 導覽指示器 */}
      <div className="absolute bottom-10 right-10 flex items-center gap-6">
        <div className="flex flex-col items-end">
          <div className="text-xs font-mono text-gray-400 font-bold mb-1">
            PAGE_PROGRESS
          </div>
          <div className="w-32 h-[2px] bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-300"
              style={{
                width: `${((activeIndex + 1) / projects.length) * 100}%`,
              }}
            />
          </div>
        </div>
        <div className="text-5xl font-bold tabular-nums text-gray-200">
          0{activeIndex + 1}
        </div>
      </div>
    </div>
  );
}
