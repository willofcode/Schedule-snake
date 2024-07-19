import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../config/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed!' });
    }
    // accepted parameters:
    const { table } = req.query;
    const categories = Array.isArray(req.query.category) ? req.query.category : [req.query.category];
    const values = Array.isArray(req.query.value) ? req.query.value : [req.query.value];


    if (categories.length != values.length) {
        res.status(404).json({ message: 'Inequality in categories & values, check syntax:', categories, values });
    } else {
        res.status(200).json({ message: 'Received the following categories & values:', categories, values });
    }
    if (!table) {
        return res.status(400).json({ message: 'This query requires a table'});
    }

    try {
        const results = await new Promise((resolve, reject) => {
            const listCategories = categories.join(', ');
            const listValues = values.join(', ');
            db.query(`INSERT INTO ${table} (${listCategories}) VALUES (${listValues});`, (err: any, results: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        console.log("INSERT INTO statement request successful", results);
        res.status(500).json({ message: 'INSERT INTO request successful', results});
    } catch (error) {
        console.error(`Error inserting into ${table} table:`, error);
        if (error instanceof Error) {
            res.status(500).json({ message: `Could not insert into ${table}`, error: error.message});
        } else {
            res.status(500).json({ message: `Could not insert into ${table}`, error: "An unknown error occurred"});
        }
    }

}
