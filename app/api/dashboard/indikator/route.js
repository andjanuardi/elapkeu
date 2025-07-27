import { getDashboardIndikator } from '@/models/dashboard';

export async function GET() {
  try {
    const sql = await getDashboardIndikator();
    return Response.json({ status: true, data: sql[0] });
  } catch (error) {
    return Response.json(
      { status: false, data: error.message },
      { status: 500 }
    );
  }
}
