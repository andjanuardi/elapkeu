'use server';
import { getSession } from '@/app/components/auth';
import query from '@/lib/db';

const table = 'trx_realisasi';

export async function selectAll() {
  const { tahun } = await getSession();
  const sql = await query({
    query: `SELECT * FROM v_realisasi WHERE tahun=?`,
    values: [tahun],
  });
  return sql;
}

export async function getTahap() {
  const { tahun, kode_opd, level } = await getSession();
  console.log(tahun, kode_opd, level);
  const sql = await query({
    query: `SELECT * FROM v_tahap WHERE tahun=? ${level <= 1 ? '' : 'AND kode_opd=?'}`,
    values: [tahun, kode_opd],
  });
  return sql;
}

export async function getBidang(tahap) {
  const { tahun, kode_opd, level } = await getSession();

  const sql = await query({
    query: `SELECT * FROM v_realisasi_bidang WHERE tahun=? AND tahap=? ${level <= 1 ? '' : 'AND kode_opd=?'}`,
    values: [tahun, tahap, kode_opd],
  });
  return sql;
}

export async function getRincian() {
  const { tahun, kode_opd } = await getSession();
  const sql = await query({
    query: `SELECT * FROM v_realisasi_rekap WHERE tahun=? AND kode_opd=? ORDER BY kode_subkegiatan`,
    values: [tahun, kode_opd],
  });
  return sql;
}

export async function getByTahap(data) {
  const { tahun, kode_opd, level } = await getSession();
  const sql = await query({
    query: `SELECT * FROM v_realisasi_detail WHERE tahap=? AND tahun=?  AND kode_bidang=?  ${level <= 1 ? '' : 'AND kode_opd=?'}`,
    values: [data.tahap, tahun, data.bidang, kode_opd],
  });
  return sql || [];
}

export async function selectByColl(coll, value) {
  const { tahun } = await getSession();
  const sql = await query({
    query: `SELECT * FROM v_realisasi WHERE ${coll}=? AND tahun=${tahun}`,
    values: [value],
  });

  return sql;
}

export async function insert(data) {
  const sql = await query({
    query: `INSERT INTO ${table} VALUES(?,?)`,
    values: data,
  });
  return sql;
}

export async function insertUpload(data) {
  const columns = [
    'kode_opd',
    'kode_subkegiatan',
    'rencana_anggaran',
    'realisasi',
    'tahap',
    'tahun',
    'kode_user',
  ];

  // Bentuk query
  const { kode_opd } = await getSession();

  const placeholders = data.map(() => '(?,?,?,?,?,?,?)').join(',');

  const values = data.flatMap((item) => [
    kode_opd,
    item.kode_subkegiatan,
    item.rencana_anggaran,
    item.realisasi,
    item.tahap,
    item.tahun,
    item.kode_user,
  ]);

  const sql = await query({
    query: `INSERT INTO ${table} (${columns.join(',')}) VALUES ${placeholders}`,
    values,
  });
  return sql;
}

export async function update(data) {
  const sql = await query({
    query: `UPDATE ${table} SET kode=?,opd=? WHERE kode=?`,
    values: data,
  });
  return sql;
}

export async function updateOne(data) {
  await query({
    query: `UPDATE ${table} SET ${data.c}=? WHERE kode=?`,
    values: [data.val, data.id],
  });

  const sql = await query({
    query: `SELECT * FROM v_realisasi WHERE kode=?`,
    values: [data.id],
  });

  return sql;
}

export async function updatePenyaluran(data) {
  const { tahun } = await getSession();
  await query({
    query: `CALL UpdatePenyaluran(?,?,?,?,?)`,
    values: [
      data.tahap,
      tahun,
      data.kode_opd,
      data.kode_bidang,
      data.penyaluran,
    ],
  });

  const sql = await query({
    query: `SELECT * FROM v_realisasi WHERE kode=?`,
    values: [data.id],
  });

  return sql;
}

export async function selectByColumns(columns, value, limit = null) {
  const { tahun } = await getSession();

  const conditions = columns.map((col) => `${col} LIKE ?`).join(' OR ');
  let values = Array(columns.length).fill(`%${value}%`);

  let sqlQuery = `SELECT * FROM v_realisasi WHERE ${conditions} AND tahun=${tahun}`;

  if (value === '') {
    sqlQuery = `SELECT * FROM v_realisasi WHERE tahun=${tahun}`;
    values = [];
  }

  if (limit !== null && !isNaN(limit)) {
    sqlQuery += ` LIMIT ?`;
    values.push(limit);
  }

  const sql = await query({
    query: sqlQuery,
    values: values,
  });

  return sql;
}

export async function del(data) {
  const sql = await query({
    query: `DELETE FROM ${table} WHERE kode=?`,
    values: data,
  });
  return sql;
}

export async function delTahap(data) {
  console.log(data);
  const sql = await query({
    query: `DELETE FROM ${table} WHERE kode_opd=? AND tahap=? AND  tahun=?`,
    values: data,
  });

  return sql;
}
