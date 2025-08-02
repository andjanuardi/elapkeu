import { protectPage } from '@/lib/db';
import {
  del,
  insert,
  selectAll,
  selectByColl,
  selectByColumns,
  update,
} from '@/models/ref_kegiatan';

export async function GET() {
  await protectPage();
  try {
    const sql = await selectAll();
    return Response.json({ status: true, data: sql });
  } catch (error) {
    return Response.json(
      { status: false, data: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await protectPage();
  try {
    const { a, data, limit } = await request.json();
    let sql = [];
    switch (a) {
      case 'tambah':
        await insert(data);
        break;
      case 'ubah':
        await update(data);
        break;
      case 'hapus':
        await del(data);
        break;
      case 'cari':
        sql = await selectByColl('kode', data);
        break;
      case 'carisemua':
        sql = await selectByColumns(['kode', 'kegiatan'], data, limit);
        break;
      default:
        sql = 'error';
        break;
    }
    return Response.json({ status: true, data: sql });
  } catch (error) {
    return Response.json(
      { status: false, data: error.message },
      { status: 500 }
    );
  }
}
