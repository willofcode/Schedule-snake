import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/../config/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    // accepted parameters: (to be updated)
    const { table, columns, condition} = req.query;

    // currently valid tables we'll use (to be updated also)
    const validTables = ['student', 'professor'];

    if (!table) {
        return res.status(400).json({ message: 'This query requires a table'});
    }

    if (!validTables.includes(table as String)) {
        return res.status(400).json({ message: 'Not a valid table' });
    }

    try {
        const results = await new Promise((resolve, reject) => {
            const requestedColumns = columns ? columns.toString() : '*';
            const requestedCondition = condition ? `WHERE ${condition}` : '';
            // only use WHERE above incase we receive nothing as a condition
            db.query(`SELECT ${requestedColumns} FROM ${table} ${requestedCondition};`, (err: any, results: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        console.log("GET request successful:", results);
        res.status(200).json({ message: 'GET request successful', results });
    } catch (error) {
        console.error(`Error querying ${table} table:`, error);
        res.status(500).json({ message: `Could not query ${table}`, error: error.message});
    }
}