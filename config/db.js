const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "sql5.freesqldatabase.com",
    user: "sql5718026",
    port: "3306",
    password: "gRWvxFll4p",
    database: "sql5718026"
});

db.connect(err => {
   if (err) {
       console.error("Error connecting", err);
   } else {
       console.log("Connected Successfully");
   }
});

module.exports = db;
