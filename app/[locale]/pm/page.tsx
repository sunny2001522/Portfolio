import RolePage from '@/components/page/RolePage';
import { getRoleData } from '@/lib/getRoleData';

export default async function PMPage() {
  const data = await getRoleData('pm');
  return <RolePage role="pm" data={data} />;
}
