// import { NextApiRequest, NextApiResponse } from 'next';
// import db from '../../config/db';

// type QueryResult = {
//   courseID: number;
//   courseName: string;
//   startTime: string;
//   endTime: string;
//   dayName: string;
//   fullname: string;
//   courseDesc: string;
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const { rows }: { rows: QueryResult[] } = await (db.execute as any)(`
//       SELECT 
//         course.courseID, 
//         course.courseName, 
//         course.startTime, 
//         course.endTime, 
//         days.dayName, 
//         professor.fullname, 
//         course.courseDesc 
//       FROM course 
//       INNER JOIN course_days ON course.courseID = course_days.courseID 
//       INNER JOIN days ON course_days.dayID = days.dayID 
//       INNER JOIN professor ON course.profID = professor.profID 
//       INNER JOIN enrollment ON course.courseID = enrollment.courseID 
//       INNER JOIN student ON enrollment.studentID = student.studentID 
//       INNER JOIN users ON student.userID = users.userID 
//       WHERE users.userType='student' AND users.userID=1 
//       GROUP BY course.courseID 
//       ORDER BY course.startTime
//     `);
    
//     const events = rows.map((row: QueryResult) => ({
//       id: row.courseID,
//       text: row.courseName,
//       start: row.startTime,
//       end: row.endTime,
//       backColor: '#3d85c6', // Adjust as needed or fetch from the database
//     }));

//     res.status(200).json(events);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }
