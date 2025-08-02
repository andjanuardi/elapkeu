'use server';
import { getSession } from '@/app/components/auth';
import query from '@/lib/db';

const table = 'ref_pejabat';

export async function selectAll() {
  const sql = await query({
    query: `SELECT * FROM v_pejabat`,
    values: [],
  });
  return sql;
}

export async function selectByColl(coll, value) {
  const sql = await query({
    query: `SELECT * FROM v_pejabat WHERE ${coll}=?`,
    values: [value],
  });

  return sql;
}

export async function selectByColumns(columns, value, limit = null) {
  const { kode_opd, level } = await getSession();
  const conditions = columns.map((col) => `${col} LIKE ?`).join(' OR ');
  let values = Array(columns.length).fill(`%${value}%`);

  let sqlQuery = `SELECT * FROM ref_pejabat WHERE (${conditions}) AND aktif=1`;

  if (value === '') {
    sqlQuery = `SELECT * FROM ref_pejabat WHERE aktif=1`;
    values = [];
  }

  if (level === 2 || level === 3) {
    sqlQuery += ` AND kode_opd=?`;
    values.push(kode_opd);
  }

  if (limit !== null && !isNaN(limit)) {
    sqlQuery += `  LIMIT ?`;
    values.push(limit);
  }

  const sql = await query({
    query: sqlQuery,
    values: values,
  });

  return sql;
}

export async function insert(data) {
  const sql = await query({
    query: `INSERT INTO ${table} VALUES(?,?,?,?,?,?,?,?)`,
    values: data,
  });
  return sql;
}

export async function update(data) {
  const sql = await query({
    query: `UPDATE ${table} SET kode_opd=?,nama=?,nip=?,pangkat=?,golongan=?,jabatan=?,aktif=? WHERE kode=?`,
    values: data,
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
