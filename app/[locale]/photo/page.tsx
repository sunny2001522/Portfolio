import RolePage from "@/components/page/RolePage";
import { getRoleData } from "@/lib/getRoleData";

export default async function PhotoPage() {
  return <RolePage role="photo" data={await getRoleData("photo")} />;
}
