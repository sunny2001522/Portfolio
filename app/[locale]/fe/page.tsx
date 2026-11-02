import RolePage from "@/components/page/RolePage";
import { getRoleData } from "@/lib/getRoleData";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/portfolio";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Portfolio" });
  return pageMetadata(locale, "fe", t("pages.fe.title"), t("pages.fe.bio"));
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const data = await getRoleData("fe");
  return <RolePage role="fe" data={data} />;
}
