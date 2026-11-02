import seedContent from "@/db/content-seed.json";
import type { Skills } from "./types";

// Public copy is reviewed and versioned with the site. A read-only portfolio
// should never wait for a remote database before showing its content.
export async function loadContentMessages(locale: string): Promise<Record<string, unknown>> {
  const language = locale === "en" ? "en" : "zh";
  return { ...seedContent.roles[language], projects: seedContent.projects[language] };
}

export async function getSkills(): Promise<Skills> {
  return seedContent.skills;
}
