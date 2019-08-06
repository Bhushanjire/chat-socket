const mysql = require('mysql');

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database : "chatApp",
  charset : 'utf8mb4'
});

connection.connect(function(err) {
  if (err) throw err;
  //console.log("Connected!");
});
module.exports = connection;
