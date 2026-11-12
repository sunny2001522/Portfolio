import RolePage from "@/components/page/RolePage";
import { getRoleData } from "@/lib/getRoleData";

export default async function ProductBuilderPage() {
  const data = await getRoleData("product-builder");
  return <RolePage role="product-builder" data={data} />;
}
