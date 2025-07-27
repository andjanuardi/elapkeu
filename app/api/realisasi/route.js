import { tahap } from '@/models/staticData';
import {
  del,
  insert,
  selectAll,
  selectByColl,
  update,
  selectByColumns,
  getTahap,
  insertUpload,
  delTahap,
  getByTahap,
  updateOne,
  getRincian,
  getBidang,
  updatePenyaluran,
} from '@/models/trx_realisasi';

export async function GET() {
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
  try {
    const { a, data, limit } = await request.json();
    let sql = [];
    switch (a) {
      case 'tambah':
        await insert(data);
        break;
      case 'tambahupload':
        await insertUpload(data);
        break;
      case 'hapustahap':
        await delTahap(data);
        break;
      case 'ubah':
        await update(data);
        break;
      case 'ubahitem':
        sql = await updateOne(data);
        break;
      case 'ubahpenyaluran':
        await updatePenyaluran(data);
        break;
      case 'hapus':
        await del(data);
        break;
      case 'cari':
        sql = await selectByColl('kode', data);
        break;
      case 'getTahap':
        sql = await getTahap();
        break;
      case 'getBidang':
        sql = await getBidang(data);
        break;
      case 'getRincian':
        sql = await getRincian();
        break;
      case 'getByTahap':
        sql = await getByTahap(data);
        break;
      case 'carisemua':
        sql = await selectByColumns(['kode', 'opd'], data, limit);
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
