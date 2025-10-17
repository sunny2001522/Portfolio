"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaGithub } from "react-icons/fa";
import { MdOutlineWebAsset } from "react-icons/md";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// 型別定義
type ProjectLink = {
  type: string;
  url: string;
};

import type { Project as GlobalProject } from "@/lib/types";
import { FaRightLeft } from "react-icons/fa6";
import { BiLeftArrowAlt, BiRightArrow, BiRightArrowAlt } from "react-icons/bi";
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

export default function Project({
  projects,
  skills: categorizedSkills,
  role,
}: ProjectProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeProject = projects[activeIndex];
  const t = useTranslations("projects");
  // get current locale from t (next-intl)
  // @ts-ignore
  const locale: "zh" | "en" = t.locale === "en" ? "en" : "zh";
  const contentRef = useRef<HTMLDivElement>(null);

  if (!activeProject) return null;

  return (
    <div className="w-full h-full  my-4  md:grid md:grid-cols-12 gap-8 p-8 text-black">
      <h2 className="text-[60px] md:text-[96px] absolute z-0 top-0 ">
        Projects
      </h2>
      {/* 左側縮圖列表 */}
      <div className="md:col-span-1 flex my-6 md:mt-0 md:flex-col  gap-4 justify-center">
        {projects.map((project: Project, index: number) => (
          <button
            key={project.id}
            onClick={() => setActiveIndex(index)}
            className={`relative w-30  aspect-video rounded-lg overflow-hidden transition-all duration-300 transform-gpu ${
              activeIndex === index
                ? "scale-80 ring-4 ring-gray-500 shadow-2xl"
                : "scale-100 opacity-60 hover:opacity-100 hover:scale-105"
            }`}
          >
            <Image
              src={project.thumbnail}
              alt={project.id}
              fill
              className="object-cover"
            />
          </button>
        ))}
        <div className="flex">
          <BiLeftArrowAlt
            className="w-8 cursor-pointer"
            onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
          />
          <BiRightArrowAlt
            className="w-8 cursor-pointer"
            onClick={() =>
              setActiveIndex((prev) => Math.min(prev + 1, projects.length - 1))
            }
          />
        </div>
      </div>

      <div className="md:col-span-1"></div>

      {/* 中間專案內容 */}
      <div className="col-span-7 flex flex-col justify-center gap-4 h-full">
        <div className=" flex flex-col items-center justify-center  bg-white/50 shadow-md  backdrop-blur rounded-lg z-50 border-blue-200 border-2 overflow-hidden">
          <div className="flex  gap-2 bg-gradient-to-r from-cyan-500 to-violet-200 px-4 py-2  w-full ">
            <span className="rounded-full bg-white w-3 h-3"></span>
            <span className="rounded-full bg-white w-3 h-3"></span>
            <span className="rounded-full bg-white w-3 h-3"></span>
          </div>
          {activeProject.video && activeProject.category !== "web" ? (
            <video
              src={activeProject.video}
              width={800}
              height={450}
              className="w-full h-auto aspect-video object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <Image
              src={activeProject.thumbnail}
              alt={t(`${activeProject.id}.title`)}
              width={800}
              height={450}
              className="w-full h-auto aspect-video object-cover"
            />
          )}
        </div>
        <div className=" justify-start  rounded-2xl overflow-x-scroll ">
          <div className="space-y-1 flex md:flex-wrap">
            {Object.entries(categorizedSkills).map(
              ([category, skills]: [string, Skill[]]) => (
                <div className="flex gap-1 items-end" key={category}>
                  {skills.map((skill: Skill) => {
                    const isUsed =
                      Array.isArray(activeProject.skills) &&
                      activeProject.skills.includes(skill.name);
                    return (
                      <div
                        key={skill.name}
                        className={`flex flex-col w-20 items-center gap-1 p-1 rounded-lg transition-all duration-300 ${
                          isUsed
                            ? "opacity-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                            : "opacity-20 grayscale"
                        }`}
                        title={skill.name}
                      >
                        <Image
                          src={skill.icon}
                          alt={skill.name}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                        <div className=" flex items-center  text-xs">
                          {skill.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </div>
        {/* 右側技能表 */}
        {/* <div className="hidden md:block    justify-start bg-white/50 backdrop-blur-sm p-4 rounded-2xl shadow-inner border overflow-y-scroll h-70">
          <div className="space-y-1 flex gap-1">
            {Object.entries(categorizedSkills).map(
              ([category, skills]: [string, Skill[]]) => (
                <div key={category}>
                  <h5 className="text-sm font-semibold text-gray-600 mb-2 border-b pb-1">
                    {category}
                  </h5>
                  <div className="flex gap-1 flex-wrap items-end">
                    {skills.map((skill: Skill) => {
                      const isUsed =
                        Array.isArray(activeProject.skills) &&
                        activeProject.skills.includes(skill.name);
                      return (
                        <div
                          key={skill.name}
                          className={`flex flex-col items-center gap-1 p-1 w-15  transition-all duration-300 ${
                            isUsed
                              ? "opacity-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                              : "opacity-20 grayscale"
                          }`}
                          title={skill.name}
                        >
                          {skill.icon ? (
                            <>
                              <Image
                                src={skill.icon}
                                alt={skill.name}
                                width={32}
                                height={32}
                                className="object-contain"
                              />
                              <span className="text-xs text-center font-medium text-gray-600">
                                {skill.name}
                              </span>
                            </>
                          ) : (
                            <div className=" flex items-center rounded-full justify-center px-2 py-1 border border-gray-500 bg-gray-700 text-white text-sm">
                              {skill.name}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        </div> */}
      </div>

      <div
        key={activeProject.id}
        className="bg-white/70 backdrop-blur-md col-span-3 overflow-hidden p-6  rounded-xl shadow-lg border border-gray-200 max-md:h-80 md:h-full"
      >
        <div className="max-md:flex lg:flex justify-between items-baseline mb-4 ">
          <h3 className="text-2xl font-bold text-gray-800">
            {t(`${activeProject.id}.title`)}
          </h3>
          <span className="text-sm font-mono text-gray-500">
            {activeProject.year}
          </span>
          <div className="flex gap-2 ">
            {activeProject.links?.map((link: ProjectLink) => (
              <a
                key={link.type}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xl p-1 bg-gray-800 text-white rounded-full hover:bg-gray-500 transition-colors animate-pulse"
              >
                {link.type === "GitHub" && <FaGithub />}
                {link.type === "Vercel" && <MdOutlineWebAsset />}
              </a>
            ))}
          </div>
        </div>
        <div className="text-base text-gray-700 gap-2 h-full pb-12 space-y-4 overflow-y-scroll">
          <>
            <div className="">
              <h4 className="text-sm font-semibold text-gray-600 mb-2 border-b pb-1">
                {t(`${activeProject.id}.overview.title`)}
              </h4>
              <p className="mb-2 text-base">
                {t(`${activeProject.id}.overview.goal`)}
              </p>
            </div>
            <div>
              <h5 className=" text-sm font-semibold text-gray-600 mb-2 border-b pb-1 mt-2">
                {t(`${activeProject.id}.overview.users_title`)}
              </h5>
              <ul className="list-disc pl-5 space-y-1">
                {(t.raw(`${activeProject.id}.overview.users`) as string[]).map(
                  (item: string, index: number) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-2 border-b pb-1 ">
                {t(`${activeProject.id}.${role}.implementation.title`)}
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                {(
                  t.raw(
                    `${activeProject.id}.${role}.implementation.stack`
                  ) as string[]
                ).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-2 border-b pb-1 ">
                {t(`${activeProject.id}.${role}.challenges.title`)}
              </h4>
              <ul className="list-disc pl-5 space-y-2">
                {(
                  t.raw(`${activeProject.id}.${role}.challenges.items`) as {
                    title: string;
                    solution: string[];
                  }[]
                ).map((item, index: number) => (
                  <li key={index}>
                    <strong>{item.title}:</strong> {item.solution.join(" ")}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-2 border-b pb-1 ">
                {t(`${activeProject.id}.${role}.outcomes.title`)}
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                {(
                  t.raw(
                    `${activeProject.id}.${role}.outcomes.items`
                  ) as string[]
                ).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </>
        </div>
      </div>
    </div>
  );
}
