import { NextApiRequest, NextApiResponse } from "next";
import db from '@/../config/db';
import { QueryError, ResultSetHeader } from 'mysql2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed, must be a POST request' });
  }

  const { table, values } = req.body; // accepted parameters
  if (!table || !values) {
    return res.status(400).json({ message: 'This query requires a table and values' });
  }

  try {
    const result: ResultSetHeader = await new Promise((resolve, reject) => {
      const query = `INSERT INTO ${table} SET ?`;
      db.query(query, values, (err: QueryError, results: ResultSetHeader) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    console.log("INSERT statement successful", result);
    res.status(200).json({ message: 'INSERT statement successful', insertId: result.insertId });
  } catch (error: any) {
    console.error(`Error inserting into ${table}:`, error);
    res.status(500).json({ message: `Could not insert into ${table}`, error: error.message });
  }
}
