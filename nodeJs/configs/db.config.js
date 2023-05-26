const mysql = require('mysql');


const conn = mysql.createConnection({
    host: "localhost",
    user: "dech",
    password: "dech@123",
    database: "testtni",
    multipleStatements: true,
  });
  
  // con.connect(function (err) {
  //   if (err) {
  //     return console.error("error: " + err.message);
  //   }
  
  //   console.log("Connected to the MySQL server.");
  // });
  
  module.exports = conn;