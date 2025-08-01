import { getSession } from '@/app/components/auth';
import TableData from './table';
import { permanentRedirect } from 'next/navigation';

export default async function Page() {
  const { level } = await getSession();
  level > 2 && permanentRedirect('/');
  return <TableData />;
}
