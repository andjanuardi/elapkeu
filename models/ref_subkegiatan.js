"use server";
import query from "@/lib/db";

const table = "ref_subkegiatan";

export async function selectAll() {
  const sql = await query({
    query: `SELECT * FROM ${table}`,
    values: [],
  });
  return sql;
}

export async function selectByColl(coll, value) {
  const sql = await query({
    query: `SELECT * FROM v_subkegiatan WHERE ${coll}=?`,
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

export async function update(data) {
  const sql = await query({
    query: `UPDATE ${table} SET kode=?,subkegiatan=? WHERE kode=?`,
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
