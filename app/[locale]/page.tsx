import RoleSelect from "@/components/ui/RoleSelect";

import { getTranslations } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = await getTranslations("HomePage");

  return (
    <div className="flex flex-col items-center gap-6 mt-10">
      <h2 className="absolute z-0 text-[96px] left-2 ">Buy a</h2>
      <h2 className="absolute z-0 text-[96px] right-2 "> Sonia?</h2>
      <div className=" w-full relative z-0 pt-[64px]">
        <RoleSelect role="fe" />
      </div>
    </div>
  );
}
