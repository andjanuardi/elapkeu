'use server';
import { getSession } from '@/app/components/auth';
import query from '@/lib/db';

const table = 't_pengaturan';

export async function getWaktu() {
  const { tahun } = await getSession();
  const sql = await query({
    query: `SELECT * FROM ${table} WHERE tahun=?`,
    values: [tahun],
  });
  return sql;
}

export async function updateOne(data) {
  const { tahun } = await getSession();

  await query({
    query: `UPDATE ${table} SET ${data.c}=? WHERE tahun=?`,
    values: [data.val, tahun],
  });
}

export async function selectAll() {
  const sql = await query({
    query: `SELECT * FROM ${table}`,
    values: [],
  });
  return sql;
}

export async function selectByColl(coll, value) {
  const sql = await query({
    query: `SELECT * FROM ${table} WHERE ${coll}=?`,
    values: [value],
  });

  return sql;
}

export async function selectByColumns(columns, value, limit = null) {
  const conditions = columns.map((col) => `${col} LIKE ?`).join(' OR ');
  let values = Array(columns.length).fill(`%${value}%`);

  let sqlQuery = `SELECT * FROM ${table} WHERE (${conditions})`;

  if (value === '') {
    sqlQuery = `SELECT * FROM ${table}`;
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
export async function insert(data) {
  const sql = await query({
    query: `INSERT INTO ${table} VALUES(?)`,
    values: data,
  });
  return sql;
}

export async function update(data) {
  const sql = await query({
    query: `UPDATE ${table} SET satuan=? WHERE satuan=?`,
    values: data,
  });
  return sql;
}

export async function del(data) {
  const sql = await query({
    query: `DELETE FROM ${table} WHERE satuan=?`,
    values: data,
  });
  return sql;
}
