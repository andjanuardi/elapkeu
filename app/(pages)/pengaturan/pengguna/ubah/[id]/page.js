import { getSession } from '@/app/components/auth';
import Ubah from './form';
import { permanentRedirect } from 'next/navigation';

export default async function Page({ params }) {
  const session = await getSession();
  const { id } = await params;
  parseInt(session.kode) !== parseInt(id) &&
    permanentRedirect(`/pengaturan/pengguna/ubah/${session.kode}`);
  return <Ubah session={session} />;
}
