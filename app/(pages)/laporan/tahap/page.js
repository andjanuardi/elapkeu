import { getSession } from '@/app/components/auth';
import ControlLaporan from './table';

export default async function Page() {
  const session = await getSession();
  return <ControlLaporan session={session} />;
}
