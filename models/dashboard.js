'use server';
import { getSession } from '@/app/components/auth';
import query from '@/lib/db';

export async function getDashboardIndikator() {
  const { tahun, level, kode_opd } = await getSession();
  const sql = await query({
    query: `SELECT SUM(rencana_anggaran) AS rencana_anggaran, SUM(penyaluran) AS penyaluran, SUM(realisasi) AS realisasi FROM v_dahsboard_indikator WHERE tahun=? ${level <= 1 ? '' : `AND kode_opd=?`} GROUP BY tahun`,
    values: [tahun, kode_opd],
  });
  return sql;
}

export async function getDashboardGrafikTahap() {
  const { tahun, level, kode_opd } = await getSession();
  const sql = await query({
    query: `SELECT tahap, SUM(rencana_anggaran) AS rencana_anggaran, SUM(penyaluran) AS penyaluran, SUM(realisasi) AS realisasi FROM v_dahsboard_pertahap WHERE tahun=? ${level <= 1 ? '' : `AND kode_opd=?`} GROUP BY tahap`,
    values: [tahun, kode_opd],
  });
  return sql;
}

export async function getDashboardGrafikBidang() {
  const { tahun, level, kode_opd } = await getSession();
  const sql = await query({
    query: `SELECT bidang,  SUM(realisasi) AS realisasi FROM v_realisasi_bidang WHERE tahun=? ${level <= 1 ? '' : `AND kode_opd=?`} GROUP BY kode_bidang`,
    values: [tahun, kode_opd],
  });
  return sql;
}
