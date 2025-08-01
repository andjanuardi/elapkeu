import { getSession } from '@/app/components/auth';
import Waktu from './waktu';
import { permanentRedirect } from 'next/navigation';

export default async function Page() {
  const { level } = await getSession();
  level > 1 && permanentRedirect('/');
  return (
    <div className="grid grid-cols-3 gap-3 ">
      <Waktu />
    </div>
  );
}
