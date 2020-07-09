// establish connection to MYSQL database

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "cse-curly.cse.umn.edu",
  user: "C4131S19G51", // replace with the database user provided to you
  password: "2631", // replace with the database password provided to you
  database: "C4131S19G51", // replace with the database user provided to you
  port: 3306
});

connection.connect(function(err) {
  if (err) {
    throw err;
  };
  console.log("Connected to MYSQL database!");
});

// export the connection
exports.get = function() {
  return connection;
}
