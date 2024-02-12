import mysql from 'serverless-mysql';
const db = mysql({
  config: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
});
export default async function dbPost(query, values) {
  try {
    const req = await db.query(query, values);
    await db.end();
    return req;
  } catch (error) {
    return { error };
  }
}