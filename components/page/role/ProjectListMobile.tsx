"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaGithub } from "react-icons/fa";
import { MdOutlineWebAsset } from "react-icons/md";
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

export default function ProjectListMobile({
  projects,
  skills: categorizedSkills,
  role,
}: ProjectProps) {
  const t = useTranslations("projects");

  // 安全取得翻譯陣列的方法，避免因為 key 不存在導致 next-intl 拋出錯誤造成白畫面
  const getOutcomes = (projectId: string, currentRole: string) => {
    try {
      const items = t.raw(`${projectId}.${currentRole}.outcomes.items`);
      return Array.isArray(items) ? items : [];
    } catch (error) {
      return [];
    }
  };

  return (
    <div className="flex flex-col w-full gap-8 p-4 z-20 md:hidden pb-24">
      <h2 className="text-4xl font-bold text-gray-800 opacity-20 text-center mb-2">
        Projects
      </h2>
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex flex-col"
        >
          {/* Top Bar */}
          <div className="flex gap-2 bg-gradient-to-r from-cyan-500 to-violet-200 px-4 py-2 w-full">
            <span className="rounded-full bg-white w-3 h-3"></span>
            <span className="rounded-full bg-white w-3 h-3"></span>
            <span className="rounded-full bg-white w-3 h-3"></span>
          </div>

          {/* Media */}
          {project.video && project.category !== "web" ? (
            <video
              src={project.video}
              className="w-full h-auto aspect-video object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <Image
              src={project.thumbnail}
              alt={project.id}
              width={800}
              height={450}
              className="w-full h-auto aspect-video object-cover"
            />
          )}

          <div className="p-5 space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {t(`${project.id}.title`)}
                </h3>
                <span className="text-sm font-mono text-gray-500">
                  {project.year}
                </span>
              </div>
              <div className="flex gap-2">
                {project.links?.map((link) => (
                  <a
                    key={link.type}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-lg p-2 bg-gray-800 text-white rounded-full hover:bg-gray-500 transition-colors"
                  >
                    {link.type === "GitHub" && <FaGithub />}
                    {link.type === "Vercel" && <MdOutlineWebAsset />}
                  </a>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {Object.values(categorizedSkills)
                .flat()
                .filter(
                  (skill) =>
                    Array.isArray(project.skills) &&
                    project.skills.includes(skill.name)
                )
                .map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded-md shadow-sm"
                  >
                    <Image
                      src={skill.icon}
                      alt={skill.name}
                      width={16}
                      height={16}
                      className="object-contain"
                    />
                    <span className="text-xs text-gray-700">{skill.name}</span>
                  </div>
                ))}
            </div>

            {/* Short Description */}
            <div className="text-sm text-gray-700">
              <p>{t(`${project.id}.overview.goal`)}</p>
            </div>

            {/* Outcomes */}
            {getOutcomes(project.id, role).length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Key Outcomes
                </h5>
                <ul className="space-y-1">
                  {getOutcomes(project.id, role).slice(0, 3).map((item, i) => (
                    <li key={i} className="text-[11px] text-gray-600 flex items-start gap-1">
                      <span className="text-blue-400 font-bold">/</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
