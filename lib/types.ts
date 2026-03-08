export interface ProjectLink {
  type: "GitHub" | "Vercel";
  url: string;
}

export interface Project {
  id: string;
  year: string;
  thumbnail: string;
  video?: string;
  category: string;
  links: ProjectLink[];
  skills?: string[] | undefined;
  description?: {
    zh?: {
      fe?: string;
      pm?: string;
      ui?: string;
    };
    en?: {
      fe?: string;
      pm?: string;
      ui?: string;
    };
  };
}

export interface Skill {
  name: string;
  icon: string;
}

export type Skills = Record<string, Skill[]>;

export interface Contact {
  icon: string;
  label: string;
  value: string;
  href: string;
}

export interface Resume {
  en: string;
  zh: string;
}

export interface RoleData {
  projects: Project[];
  skills: Skills;
  contact: Contact[];
  resume: Resume;
}

export interface Role {
  key: "fe" | "ui" | "pm" | "design";
  labelKey: string;
  color: string;
  img: string;
}

// Gallery types
export interface GallerySkill {
  img: string;
  title: string;
}


export interface GallerySlide {
  title: string;
  adj: string;
  character: string;
  skill: GallerySkill[];
  contentImg: React.ReactNode;
  color: string;
  award: string[];
  description: string[];
}

export type GallerySlides = GallerySlide[];