import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { db } from "@/lib/db";

// Messages only change on `npm run db:seed` — cache per locale for the server
// process so we don't re-query remote Turso on every page navigation.
const _messagesCache = new Map<
  string,
  { at: number; data: Promise<Record<string, unknown>> }
>();
const MESSAGES_TTL_MS = 10 * 60 * 1000;

function loadMessages(locale: string): Promise<Record<string, unknown>> {
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
  const res = await db.execute({
    sql: "SELECT content FROM messages WHERE locale = ? LIMIT 1",
    args: [locale],
  });
  if (res.rows.length === 0) {
    if (locale === routing.defaultLocale) {
      throw new Error(`No messages found for default locale '${locale}'`);
    }
    return loadMessages(routing.defaultLocale);
  }
  return JSON.parse(res.rows[0].content as string);
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "en" | "zh")) {
    locale = routing.defaultLocale;
  }
  const messages = await loadMessages(locale);
  return { locale, messages };
});
