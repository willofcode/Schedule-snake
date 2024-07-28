import { NextApiRequest, NextApiResponse } from "next";
import db from '@/../config/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed, must be a DELETE request' });
    }
    const { table, condition } = req.query; // accepted parameters
    if (!table) {
        return res.status(400).json({ message: 'This query requires a table' });
    }
    try {
        const results = await new Promise((resolve, reject) => {
            const requestedCondition = condition ? `WHERE ${condition}` : '';
            db.query(`DELETE FROM ${table} ${requestedCondition};`, (err: any, results: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        console.log("DELETE statement successful", results);
        res.status(200).json({ message: 'DELETE statement successful', results });
    } catch (error: any) {
        console.error(`Error deleting row from ${table}:`, error);
        res.status(500).json({ message: `Could not delete row from ${table}`, error: error.message });
    }
}
