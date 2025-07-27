import { getSession } from '@/app/components/auth';
import TableTahap from './table';

export default async function Page() {
  const session = await getSession();
  return (
    <div>
      <TableTahap session={session} />
    </div>
  );
}
