import RolePage from "@/components/page/RolePage";
import { getRoleData } from "@/lib/getRoleData";

export default async function AIPage() {
  const data = await getRoleData("ai");
  return <RolePage role="ai" data={data} />;
}
