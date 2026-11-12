import RolePage from "@/components/page/RolePage";
import { getRoleData } from "@/lib/getRoleData";

export default async function FilmPage() {
  return <RolePage role="film" data={await getRoleData("film")} />;
}
