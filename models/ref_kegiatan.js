"use server";
import query from "@/lib/db";

const table = "ref_kegiatan";

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
  const conditions = columns.map((col) => `${col} LIKE ?`).join(" OR ");
  let values = Array(columns.length).fill(`%${value}%`);

  let sqlQuery = `SELECT * FROM v_kegiatan WHERE ${conditions}`;

  if (value === "") {
    sqlQuery = `SELECT * FROM v_kegiatan`;
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
    query: `INSERT INTO ${table} VALUES(?,?)`,
    values: data,
  });
  return sql;
}

export async function update(data) {
  const sql = await query({
    query: `UPDATE ${table} SET kode=?,kegiatan=? WHERE kode=?`,
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
