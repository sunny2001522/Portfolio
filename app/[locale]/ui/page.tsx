import RolePage from '@/components/page/RolePage';
import { getRoleData } from '@/lib/getRoleData';

export default async function UIPage() {
  const data = await getRoleData('ui');
  return <RolePage role="ui" data={data} />;
}
