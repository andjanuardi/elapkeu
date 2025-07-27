import { getSession } from '@/app/components/auth';
import query from '@/lib/db';

export async function POST(request) {
  const { kode_opd, kode_bidang } = await request.json();
  const { tahun } = await getSession();
  try {
    const sql = await query({
      query: `SELECT * FROM v_laporan_rincian WHERE tahun=? AND subkegiatan IS NOT NULL ${kode_opd === 'semua' ? '' : 'AND kode_opd=?'} ${kode_bidang === 'semua' ? '' : 'AND kode_bidang=?'}`,
      values: [tahun, kode_opd, kode_bidang],
    });

    return Response.json({ status: true, data: sql });
  } catch (error) {
    return Response.json(
      { status: false, data: error.message },
      { status: 500 }
    );
  }
}
