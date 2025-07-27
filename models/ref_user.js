'use server';
import { getSession } from '@/app/components/auth';
import query from '@/lib/db';

const table = 'tbl_users';

export async function selectAll() {
  const { kode_opd, level } = await getSession();
  const sql = await query({
    query: `SELECT * FROM v_users ${level <= 1 ? '' : 'WHERE kode_opd=?'}`,
    values: [kode_opd],
  });
  return sql;
}

export async function selectByColl(coll, value) {
  const sql = await query({
    query: `SELECT * FROM v_users WHERE ${coll}=?`,
    values: [value],
  });

  return sql;
}

export async function selectByColumns(columns, value, limit = null) {
  const { kode_opd, level } = await getSession();
  const conditions = columns.map((col) => `${col} LIKE ?`).join(' OR ');
  let values = Array(columns.length).fill(`%${value}%`);

  let sqlQuery = `SELECT * FROM ref_pejabat WHERE ${conditions} AND aktif=1`;

  if (value === '') {
    sqlQuery = `SELECT * FROM ref_pejabat WHERE aktif=1`;
    values = [];
  }

  console.log(level);
  if (level > 1) {
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
  console.log(data);
  const sql = await query({
    query: `INSERT INTO ${table} VALUES(?,?,?,?,?,?,?,?,?)`,
    values: data,
  });
  return sql;
}

export async function update(data) {
  let queryStr = {};
  if (!data[6]) {
    data.splice(6, 1);
    queryStr = {
      query: `UPDATE ${table} SET nama=?, nip=?, jabatan=?, kode_opd=?, email=?, level=? WHERE kode=?`,
      values: data,
    };
  } else {
    queryStr = {
      query: `UPDATE ${table} SET nama=?, nip=?, jabatan=?, kode_opd=?, email=?, level=?, password=? WHERE kode=?`,
      values: data,
    };
  }

  const sql = await query(queryStr);
  return sql;
}

export async function del(data) {
  const sql = await query({
    query: `DELETE FROM ${table} WHERE kode=?`,
    values: data,
  });
  return sql;
}
