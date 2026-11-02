import { Contact, Resume, Role } from "./types";

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
    key: "pm",
    labelKey: "pm.title",
    color: "bg-violet-200",
    img: "/character/pm.webp",
  },
];

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
} = {
  fe: ["introduction", "contact", "project"],
  pm: ["introduction", "contact", "project"],
  ui: ["introduction", "contact", "project"],
  design: ["introduction", "contact", "project"],
};
