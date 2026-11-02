import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { loadContentMessages } from "@/lib/content-server";
import messagesEn from "@/db/messages.en.json";
import messagesZh from "@/db/messages.zh.json";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested === "en" || requested === "zh" ? requested : routing.defaultLocale;
  const messages = locale === "en" ? messagesEn : messagesZh;
  return { locale, messages: { ...messages, ...(await loadContentMessages(locale)) } };
});
