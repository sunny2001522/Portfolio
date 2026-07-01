import RolePage from '@/components/page/RolePage';
import { getRoleData } from '@/lib/getRoleData';

export default async function DesignPage() {
  const data = await getRoleData('design');
  return <RolePage role="design" data={data} />;
}
