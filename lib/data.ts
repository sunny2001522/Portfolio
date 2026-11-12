import { Skills, Contact, Resume, Role } from "./types";

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
    key: "design",
    labelKey: "design.title",
    color: "bg-orange-200",
    img: "/character/design.webp",
  },
  {
    key: "ai",
    labelKey: "ai.title",
    color: "bg-cyan-200",
    img: "/character/ai.webp",
  },
  {
    key: "product-builder",
    labelKey: "product-builder.title",
    color: "bg-emerald-200",
    img: "/character/product-builder.webp",
  },
  {
    key: "pm",
    labelKey: "pm.title",
    color: "bg-violet-200",
    img: "/character/pm.webp",
  },
  {
    key: "film",
    labelKey: "film.title",
    color: "bg-purple-200",
    img: "/character/design.webp",
  },
  {
    key: "photo",
    labelKey: "photo.title",
    color: "bg-sky-200",
    img: "/character/design.webp",
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
    { name: "ChatGPT", icon: "/skills/claude.webp" },
    { name: "Cursor", icon: "/skills/cursor.webp" },
    { name: "AI Art", icon: "/skills/ai.webp" },
    { name: "AI Video", icon: "/skills/ai.webp" },
    { name: "AI Writing", icon: "/skills/claude.webp" },
    { name: "Suno", icon: "/skills/ai.webp" },
  ],
  Deploy: [
    { name: "Web", icon: "/skills/next.webp" },
    { name: "Render", icon: "/skills/docker.webp" },
  ],
};

export const contact: Contact[] = [];

export const resume: Resume = {
  en: "SoniaResumeFeEn.pdf",
  zh: "SoniaResumeFeZh.pdf",
};

export const rolePages: {
  fe: string[];
  pm: string[];
  ui: string[];
  design: string[];
  ai: string[];
  "product-builder": string[];
  film: string[];
  photo: string[];
} = {
  fe: ["introduction", "contact", "project"],
  pm: ["introduction", "contact", "project"],
  ui: ["introduction", "contact", "project"],
  design: ["introduction", "contact", "project"],
  ai: ["introduction", "contact", "project"],
  "product-builder": ["introduction", "contact", "project"],
  film: ["introduction", "contact", "project"],
  photo: ["introduction", "contact", "project"],
};
