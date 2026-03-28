"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaGithub } from "react-icons/fa";
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

  // 預載下一張圖片，讓切換更順暢
  const nextProject = projects[activeIndex + 1];

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

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          pin: true,
          start: "top top",
          end: () => `+=${projects.length * 100}%`,
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress;
            const newIndex = Math.min(
              Math.floor(progress * projects.length),
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
            end: () => `+=${projects.length * 100}%`,
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
        {/* 左側：技能欄位 */}
        <div className="hidden md:flex md:col-span-5 flex-col gap-4 h-full pr-4 overflow-visible relative z-20">
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
        <div className="col-span-12 md:col-span-7 flex flex-col gap-6 h-full">
          {/* 作品媒體視窗 - 16:9 Aspect Ratio */}
          <div className="project-content w-full aspect-video max-h-[55vh] bg-white/40 backdrop-blur-xl rounded-2xl border-2 border-white/50 shadow-2xl overflow-hidden relative group flex-shrink-0">
            <div className="absolute top-0 left-0 w-full h-7 bg-white/80 flex items-center px-4 gap-1.5 z-20 border-b border-gray-100">
              <div className="w-2 h-2 rounded-full bg-[#FF5F56]" />
              <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
              <div className="w-2 h-2 rounded-full bg-[#27C93F]" />
              <span className="ml-4 text-[9px] text-gray-400 font-mono tracking-widest uppercase truncate font-bold">
                {activeProject.id}
              </span>
            </div>

            <div className="w-full h-full pt-7">
              {activeProject.video && activeProject.category !== "web" ? (
                <video
                  key={activeProject.id}
                  src={activeProject.video}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <div className="relative w-full h-full bg-gray-50">
                  <Image
                    key={activeProject.id}
                    src={activeProject.thumbnail}
                    alt={activeProject.id}
                    fill
                    priority
                    className="object-cover"
                  />
                  {/* 預載下一張圖片 */}
                  {nextProject && (
                    <Image
                      src={nextProject.thumbnail}
                      alt=""
                      fill
                      className="opacity-0 pointer-events-none"
                      aria-hidden="true"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 作品說明文字 - 佔滿剩餘高度 */}
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">
                  {activeProject.year} Project
                </div>
                <h3 className="text-4xl font-bold text-gray-800 tracking-tighter">
                  {t(`${activeProject.id}.title`)}
                </h3>
              </div>
              <div className="flex gap-2">
                {activeProject.links?.map((link) => (
                  <a
                    key={link.type}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-[10px] font-bold hover:bg-black transition-all"
                  >
                    {link.type === "GitHub" && <FaGithub size={14} />}
                    {link.type === "Vercel" && <MdOutlineWebAsset size={14} />}
                    {link.type}
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full overflow-y-auto custom-scrollbar pr-4">
              <div className="space-y-3">
                <h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest border-l-2 border-gray-300 pl-2">
                  Overview
                </h5>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  {t(`${activeProject.id}.overview.goal`)}
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest border-l-2 border-gray-300 pl-2">
                  Key Outcomes
                </h5>
                <ul className="space-y-2">
                  {getOutcomes(activeProject.id, role)
                    .slice(0, 3)
                    .map((item, i) => (
                      <li
                        key={i}
                        className="text-[11px] text-gray-500 flex items-start gap-2"
                      >
                        <PiStarFourFill
                          className="text-gray-400 flex-shrink-0 mt-0.5"
                          size={12}
                        />
                        {item}
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
