'use client';
import { getRoleData } from '@/lib/data';
import RolePage from '@/components/page/RolePage';

export default function DesignPage() {
  const data = getRoleData('design');
  if (!data) {
    return <div>Role not found</div>;
  }
  return (
    <>
      <RolePage role="design" data={data} />
    </>
  );
}
