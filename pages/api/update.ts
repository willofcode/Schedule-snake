import { NextApiRequest, NextApiResponse } from "next";
import db from "@/../config/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Wrong method, must use PATCH for updating" });
  }

  const { table, column, value, condition } = req.query;

  if (!table || !column || !value || !condition) {
    return res.status(400).json({ message: "Table, column, value, and condition required" });
  }


  let setQuery = "";
  if (column && value) {
    const columns = Array.isArray(column)
      ? column
      : (column as string).split(",");
    const values = Array.isArray(value)
      ? value
      : (value as string).split(",");
    columns.forEach((col, index) => {
      if (index < columns.length - 1) {
        setQuery += `${col.trim()}='${values[index].trim()}', `;
      } else {  
      setQuery += `${col.trim()}='${value[index].trim()}'`;
    }
  });
  }

  const query = `UPDATE ${table} SET ${setQuery} WHERE ${condition};`;

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, (err: any, results: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    console.log("UPDATE successful", results);
    res.status(200).json({ message: "UPDATED", results });
  } catch (error) {
    console.log(`Error updating ${table} table`, error);
    res.status(500).json({ message: "Error updating the table", error });
  }
}
