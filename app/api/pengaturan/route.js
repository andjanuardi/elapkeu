import { getWaktu, resetWaktu, updateOne } from '@/models/ref_pengaturan';

export async function POST(request) {
  try {
    const { a, data } = await request.json();
    let sql = [];
    switch (a) {
      case 'waktu':
        sql = await getWaktu();
        break;
      case 'resetWaktu':
        sql = await resetWaktu();
        break;
      case 'ubahitem':
        sql = await updateOne(data);
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
