import RolePage from '@/components/page/RolePage';
import { getRoleData } from '@/lib/getRoleData';

export default async function FEPage() {
  const data = await getRoleData('fe');
  return <RolePage role="fe" data={data} />;
}
