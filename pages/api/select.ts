import { NextApiRequest, NextApiResponse } from "next";
import db from "@/../config/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    table,
    columns,
    condition,
    inner_join,
    on_inner,
    left_join,
    on_left,
    right_join,
    on_right,
    group_by,
    order_by,
  } = req.query;

  const validTables = ["student", "professor", "users", "course"];

  if (!table) {
    return res.status(400).json({ message: "This query requires a table" });
  }

  if (!validTables.includes(table as string)) {
    return res.status(400).json({ message: "Not a valid table" });
  }

  try {
    const results = await new Promise((resolve, reject) => {
      const requestedColumns = columns ? columns.toString() : "*";
      const requestedCondition = condition ? `WHERE ${condition}` : "";

      let innerJoinQuery = "";
      if (inner_join && on_inner) {
        const innerJoins = Array.isArray(inner_join)
          ? inner_join
          : (inner_join as string).split(",");
        const onInners = Array.isArray(on_inner)
          ? on_inner
          : (on_inner as string).split(",");
        innerJoins.forEach((join, index) => {
          innerJoinQuery += `INNER JOIN ${join.trim()} ON ${onInners[index].trim()} `;
        });
      }

      let leftJoinQuery = "";
      if (left_join && on_left) {
        const leftJoins = Array.isArray(left_join)
          ? left_join
          : (left_join as string).split(",");
        const onLefts = Array.isArray(on_left)
          ? on_left
          : (on_left as string).split(",");
        leftJoins.forEach((join, index) => {
          leftJoinQuery += `LEFT JOIN ${join.trim()} ON ${onLefts[index].trim()} `;
        });
      }

      let rightJoinQuery = "";
      if (right_join && on_right) {
        const rightJoins = Array.isArray(right_join)
          ? right_join
          : (right_join as string).split(",");
        const onRights = Array.isArray(on_right)
          ? on_right
          : (on_right as string).split(",");
        rightJoins.forEach((join, index) => {
          rightJoinQuery += `RIGHT JOIN ${join.trim()} ON ${onRights[index].trim()} `;
        });
      }
      const requestedGroupBy = group_by ? `GROUP BY ${group_by}` : "";
      const requestedOrderBy = order_by ? `ORDER BY ${order_by}` : "";

      const query = `
        SELECT ${requestedColumns}
        FROM ${table}
        ${innerJoinQuery}
        ${leftJoinQuery}
        ${rightJoinQuery}
        ${requestedCondition}
        ${requestedGroupBy}
        ${requestedOrderBy};
      `;

      db.query(query, (err: any, results: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    console.log("GET request successful:", results);
    res.status(200).json({ message: "GET request successful", results });
  } catch (error) {
    console.error(`Error querying ${table} table:`, error);
    res
      .status(500)
      .json({ message: `Could not query ${table}`, error: error.message });
  }
}
