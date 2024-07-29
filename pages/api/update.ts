import { NextApiRequest, NextApiResponse } from "next";
import db from "@/../config/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PATCH") {
    res
      .status(405)
      .json({ message: "Wrong method, must use PATCH for updating" });
  }
  const { table, condition } = req.query;
  const columns = req.query.column;
  const values = req.query.value;

  if (!table) {
    res.status(400).json({ message: "Table required" });
  }

  if (!Array.isArray(columns) || !Array.isArray(values) || columns.length !== values.length) {
    res.status(400).json({ message: "Columns and values must be same quantity" });
    return;
  }

  try {
    const updates = columns.map((col, index) => `${col} = '${values[index]}'`).join(", ");
    const results = await new Promise((resolve, reject) => {
      db.query(
          `UPDATE ${table} SET ${updates} WHERE ${condition};`,
          (err: any, results: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        },
      );
    });
    console.log("UPDATE successful", results);
    res.status(500).json({ message: "UPDATED", results });
  } catch (error) {
    console.log(`Error inserting into ${table} table`, error);
  }
}
