import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { db } from "@/lib/db";
import enMessages from "@/db/messages.en.json";
import zhMessages from "@/db/messages.zh.json";

const LOCAL_MESSAGES: Record<string, Record<string, unknown>> = {
  en: enMessages,
  zh: zhMessages,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeLocalMessages(
  locale: string,
  remoteMessages: Record<string, unknown>,
): Record<string, unknown> {
  const localMessages = LOCAL_MESSAGES[locale];
  if (!localMessages) return remoteMessages;

  const remoteProjects = isRecord(remoteMessages.projects)
    ? remoteMessages.projects
    : {};
  const localProjects = isRecord(localMessages.projects)
    ? localMessages.projects
    : {};
  const aiProjects = Object.fromEntries(
    Object.entries(localProjects).filter(([id]) => id.startsWith("ai-")),
  );
  const productBuilderProjects = Object.fromEntries(
    Object.entries(localProjects).filter(([, project]) =>
      isRecord(project) && isRecord(project["product-builder"]),
    ),
  );
  const importedProjects = Object.fromEntries(
    Object.entries(localMessages).filter(([id]) =>
      /^(film|design|photo)-/.test(id),
    ),
  );

  return {
    ...remoteMessages,
    projects: {
      ...remoteProjects,
      ...aiProjects,
      ...productBuilderProjects,
      ...importedProjects,
    },
    ai: localMessages.ai ?? remoteMessages.ai,
    "product-builder":
      localMessages["product-builder"] ?? remoteMessages["product-builder"],
    film: localMessages.film ?? remoteMessages.film,
    photo: localMessages.photo ?? remoteMessages.photo,
  };
}

// Cache per locale for the server process so we don't re-query remote Turso on
// every page navigation. Local AI portfolio additions are merged after loading.
const _messagesCache = new Map<
  string,
  { at: number; data: Promise<Record<string, unknown>> }
>();
const MESSAGES_TTL_MS = 10 * 60 * 1000;

function loadMessages(locale: string): Promise<Record<string, unknown>> {
  if (process.env.NODE_ENV !== "production" && LOCAL_MESSAGES[locale]) {
    return Promise.resolve(mergeLocalMessages(locale, LOCAL_MESSAGES[locale]));
  }

  const cached = _messagesCache.get(locale);
  if (cached && Date.now() - cached.at < MESSAGES_TTL_MS) return cached.data;
  const data = loadMessagesUncached(locale);
  _messagesCache.set(locale, { at: Date.now(), data });
  data.catch(() => {
    if (_messagesCache.get(locale)?.data === data) _messagesCache.delete(locale);
  });
  return data;
}

async function loadMessagesUncached(
  locale: string,
): Promise<Record<string, unknown>> {
  let res;
  try {
    res = await db.execute({
      sql: "SELECT content FROM messages WHERE locale = ? LIMIT 1",
      args: [locale],
    });
  } catch {
    return LOCAL_MESSAGES[locale] ?? LOCAL_MESSAGES[routing.defaultLocale];
  }
  if (res.rows.length === 0) {
    if (locale === routing.defaultLocale) {
      throw new Error(`No messages found for default locale '${locale}'`);
    }
    return loadMessages(routing.defaultLocale);
  }
  return mergeLocalMessages(
    locale,
    JSON.parse(res.rows[0].content as string) as Record<string, unknown>,
  );
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "en" | "zh")) {
    locale = routing.defaultLocale;
  }
  const messages = await loadMessages(locale);
  return { locale, messages };
});
