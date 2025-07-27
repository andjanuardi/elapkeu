import { getDashboardGrafikTahap } from '@/models/dashboard';

export async function GET() {
  try {
    const sql = await getDashboardGrafikTahap();
    return Response.json({ status: true, data: sql });
  } catch (error) {
    return Response.json(
      { status: false, data: error.message },
      { status: 500 }
    );
  }
}
