const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || process.env.MYSQLHOST || "localhost",
    port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
    user: process.env.DB_USER || process.env.MYSQLUSER || "root",
    password: process.env.DB_PASSWORD ?? process.env.MYSQLPASSWORD ?? "",
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || "tradenova_db",
    ...(process.env.DB_SSL === "true" ? { ssl: { minVersion: "TLSv1.2" } } : {})
});

connection.connect((err) => {
    if (err) {
        console.log("Database Connection Failed!");
        console.log(err);
        return;
    }

    console.log("MySQL Connected Successfully!");
});

module.exports = connection;