import { getSession } from '@/app/components/auth';
import Tambah from './form';

export default async function Page() {
  const session = await getSession();
  return <Tambah session={session} />;
}
