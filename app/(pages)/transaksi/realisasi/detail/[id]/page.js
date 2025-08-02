import { getSession } from '@/app/components/auth';
import Table from './table';
import Link from 'next/link';

export default async function Page({ searchParams, params }) {
  const { id } = await params;
  const { tahun, level } = await getSession();
  return (
    <div>
      <div className="flex place-content-between pb-2 place-items-center">
        <div className="font-bold">
          Detail Data Realisasi Tahap {id} Tahun {tahun}
        </div>
      </div>
      <Table level={level} />
    </div>
  );
}
