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
  const { table, column, value, condition } = req.query;

  if (!table) {
    res.status(400).json({ message: "Table required" });
  }

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(
        `UPDATE ${table} SET ${column} = ${value} WHERE ${condition};`,
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
