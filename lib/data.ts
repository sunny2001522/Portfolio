import { Project, Skills, Contact, Resume, RoleData, Role } from "./types";

export const roles: Role[] = [
  {
    key: "fe",
    labelKey: "fe.title",
    color: "bg-blue-200",
    img: "/character/fe.webp",
  },
  {
    key: "ui",
    labelKey: "ui.title",
    color: "bg-rose-200",
    img: "/character/ui.webp",
  },
  {
    key: "pm",
    labelKey: "pm.title",
    color: "bg-violet-200",
    img: "/character/pm.webp",
  },
];

export const skills: Skills = {
  "Front-end": [
    { name: "React", icon: "/skills/react.webp" },
    { name: "Next.js", icon: "/skills/next.webp" },
    { name: "TailwindCSS", icon: "/skills/tail.webp" },
    { name: "Shadcn", icon: "/skills/shadcn.webp" },
    { name: "Redux", icon: "/skills/redux.webp" },
    { name: "TanStack", icon: "/skills/tanstack.webp" },
    { name: "i18n", icon: "/skills/intl.webp" },
    { name: "Git", icon: "/skills/git.webp" },
    { name: "Swiper", icon: "/skills/swiper.webp" },
  ],
  Animation: [
    { name: "GSAP", icon: "/skills/gsap.webp" },
    { name: "Lottie", icon: "/skills/lottie.webp" },
    { name: "Spline", icon: "/skills/spline.webp" },
  ],
  Database: [
    { name: "Supabase", icon: "/skills/supabase.webp" },
    { name: "MongoDB", icon: "/skills/mongodb.webp" },
    { name: "Restful API", icon: "/skills/api.webp" },
  ],
  Testing: [{ name: "Playwright", icon: "/skills/playwright.webp" }],
  UI: [
    { name: "Figma", icon: "/skills/figma.webp" },
    { name: "Photoshop", icon: "/skills/ps.webp" },
    { name: "Illustrator", icon: "/skills/ai.webp" },
  ],
  UX: [
    { name: "使用者故事", icon: "/shape/shape6.webp" },
    { name: "易用性測試", icon: "/shape/shape9.webp" },
  ],
  "Project Management": [
    { name: "泳道圖", icon: "/shape/shape2.webp" },
    { name: "流程圖", icon: "/shape/shape5.webp" },
  ],
  Tool: [
    { name: "Jira", icon: "/skills/jira.webp" },
    { name: "Notion", icon: "/skills/notion.webp" },
  ],
  AI: [
    { name: "Gemini", icon: "/skills/gemini.webp" },
    { name: "Cursor", icon: "/skills/cursor.webp" },
  ],
};

export const projects: Project[] = [
  {
    id: "gamified-weight-loss",
    year: "2025",
    video: "/web/gobetgoal.webm",
    thumbnail: "/web/gamified-weight-loss.webp",
    category: "",
    links: [
      { type: "GitHub", url: "https://github.com/TooruTW/GoBetGoal" },
      { type: "Vercel", url: "https://gobetgoal.vercel.app/" },
    ],
    skills: [
      "React",
      "Redux",
      "TanStack",
      "Shadcn",
      "GSAP",
      "Lottie",
      "Swiper",
      "TailwindCSS",
      "Figma",
      "Playwright",
      "Supabase",
      "UI/UX",
      "Git",
      "Jira",
      "Notion",
      "Swimlane",
      "Confluence",
      "Photoshop",
      "Illustrator",
      "使用者故事",
      "易用性測試",
      "Gemini",
      "Cursor",
    ],
  },
  {
    id: "hotel-website",
    year: "2025",
    video: "/web/hotelbooking.webm",
    thumbnail: "/web/hotel-website.webp",
    category: "",
    links: [
      { type: "GitHub", url: "https://github.com/sunny2001522/Hotel-booking" },
      { type: "Vercel", url: "https://iceverse-hotel-booking.vercel.app/" },
    
    ],
    skills: ["React", "TailwindCSS", "MongoDB", "Restful API", "Figma", "Git", "Photoshop", "Illustrator", "UI/UX"],
  },
  {
    id: "portfolio",
    year: "2025",
    thumbnail: "/web/portfolio.webp",
    video: "/web/portfolio.webm",
    category: "",
    links: [
      { type: "GitHub", url: "https://github.com/sunny2001522/Portfolio" },
      { type: "Vercel", url: "https://exuan-website-dev.vercel.app/zh" },
    ],
    skills: ["Next.js", "TailwindCSS", "GSAP", "i18n", "Git", "Figma", "Swiper", "Spline", "Photoshop", "Illustrator", "UI/UX"],
  },
  {
    id: "metro-app",
    year: "2025",
    thumbnail: "/web/metro-app.webp",
    category: "web",
    links: [],
    skills: ["Figma", "Photoshop", "Illustrator", "UI/UX"],
  },
];

export const contact: Contact[] = [];

export const resume: Resume = {
  en: "SoniaResumeFeEn.pdf",
  zh: "SoniaResumeFeZh.pdf",
};

// 動態路由頁面名稱清單
export const rolePages: { fe: string[]; pm: string[]; ui: string[] } = {
  fe: ["introduction", "contact", "project"],
  pm: ["introduction", "contact", "project"],
  ui: ["introduction", "contact", "project"],
};

export const getRoleData = (role: string): RoleData | undefined => {
  const roleKey = role as Role["key"];
  const filteredProjects = projects.filter((p) => {
    // 根據角色篩選技能
    if (!p.skills) return false;
    // 技能陣列中有該角色相關技能就顯示
    return p.skills.some((skill) => {
      if (roleKey === "fe") {
        return ["React", "Next.js", "Redux", "TanStack", "Shadcn", "GSAP", "Lottie", "Swiper", "TailwindCSS", "i18n", "Git", "MongoDB", "Restful API", "Supabase", "Playwright"].includes(skill);
      }
      if (roleKey === "ui") {
        return ["Figma", "Photoshop", "Illustrator", "UI/UX", "GSAP", "Lottie", "Spline", "Swiper"].includes(skill);
      }
      if (roleKey === "pm") {
        return ["Jira", "Notion", "Swimlane", "Confluence"].includes(skill);
      }
      return false;
    });
  });
  return {
    projects: filteredProjects,
    skills: skills,
    contact: contact,
    resume: resume,
  };
};