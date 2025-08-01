'use server';
import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
});

export default async function query({ query, values }) {
  // console.log(query, values);
  try {
    const results = await db.query(query, values).then();
    await db.end();
    return results;
  } catch (error) {
    throw Error(error.message);
  }
}
