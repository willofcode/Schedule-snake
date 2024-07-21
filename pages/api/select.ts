
import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../config/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  // accepted parameters: (to be updated)
  const { table, columns, condition, join, on, inner_join, on_inner, left_join, on_left, right_join, on_right , group_by, order_by, limit, and, or} = req.query;

  // currently valid tables we'll use (to be updated also)
  const validTables = ["student", "professor", "users", "course", "course_days", "days", "enrollment"];

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
      const requestedJoin = join ? `JOIN ${join}` : "";
      const requestedOn = on ? `ON ${on}` : "";
      const requestedJoin1 = join ? `JOIN ${join}` : "";
      const requestedOn1 = on ? `ON ${on}` : "";
      const requestedJoin2 = join ? `JOIN ${join}` : "";
      const requestedOn2 = on ? `ON ${on}` : "";
      const requestedInnerJoin = inner_join ? `INNER JOIN ${inner_join}` : "";
      const requestedOnInner = on_inner ? `ON ${on_inner}` : "";
      const requestedInnerJoin1 = inner_join ? `INNER JOIN ${inner_join}` : "";
      const requestedOnInner1 = on_inner ? `ON ${on_inner}` : "";
      const requestedInnerJoin2 = inner_join ? `INNER JOIN ${inner_join}` : "";
      const requestedOnInner2 = on_inner ? `ON ${on_inner}` : "";
      const requestedLeftJoin = left_join ? `LEFT JOIN ${left_join}` : "";
      const requestedOnLeft = on_left ? `ON ${on_left}` : "";
      const requestedRightJoin = right_join ? `RIGHT JOIN ${right_join}` : "";
      const requestedOnRight = on_right ? `ON ${on_right}`: "";
      const requestedGroupBy = group_by ? `GROUP BY ${group_by}`: "";
      const requestedOrderBy = order_by ? `ORDER BY ${order_by}` : "";
      const requestedLimit = limit ? `LIMIT ${limit}` : "";
      const requestedAnd = and ? `AND ${and}` : ""; 
      const requestedOr = or ? `OR ${or}` : "";
      // only use WHERE above incase we receive nothing as a condition
      db.query(
        `SELECT ${requestedColumns} FROM ${table} ${requestedJoin} ${requestedOn} ${requestedJoin1} ${requestedOn1} ${requestedJoin2} ${requestedOn2} ${requestedInnerJoin} ${requestedOnInner} ${requestedInnerJoin} ${requestedOnInner} ${requestedInnerJoin1} ${requestedOnInner1} ${requestedInnerJoin2} ${requestedOnInner2} ${requestedLeftJoin} ${requestedOnLeft} ${requestedRightJoin} ${requestedOnRight} ${requestedCondition} ${requestedAnd} ${requestedOr} ${requestedGroupBy} ${requestedOrderBy} ${requestedLimit} $;`,
        (err: any, results: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
    console.log("GET request successful:", results);
    res.status(200).json({ message: "GET request successful", results });
  } catch (error) {
    console.error(`Error querying ${table} table:`, error);
    res
      .status(500)
      .json({ message: `Could not query ${table}`, error: (error as any).message });
  }
}