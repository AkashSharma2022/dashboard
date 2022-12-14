const mysql = require("mysql2");

const db_connection = mysql
  .createConnection({
    host: "localhost", // HOST NAME
    user: "root", // USER NAME
    database: "mydb", // DATABASE NAME
    password: "root", // DATABASE PASSWORD
  })
  .on("error", (err) => {
    console.log("Failed to connect to Database - ", err);
  });

module.exports = db_connection;