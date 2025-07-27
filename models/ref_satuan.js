"use server";
import query from "@/lib/db";

const table = "ref_satuan";

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
