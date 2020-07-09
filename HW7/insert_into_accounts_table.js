/*
TO DO:
-----
READ ALL COMMENTS AND REPLACE VALUES ACCORDINGLY
*/

var mysql = require("mysql");
var crypto = require('crypto');

var con = mysql.createConnection({
  host: "cse-curly.cse.umn.edu",
  user: "C4131S19G51", // replace with the database user provided to you
  password: "2631", // replace with the database password provided to you
  database: "C4131S19G51", // replace with the database user provided to you
  port: 3306
});
con.connect(function(err) {
  if (err) {
    throw err;
  };
  console.log("Connected!");

   var value = {
    acc_name: 'nam', // replace with acc_name chosen by you OR retain the same value
    acc_login: 'nam', // replace with acc_login chosen by you OR retain the same vallue
    acc_password: crypto.createHash('sha256').update("nam").digest('base64') // replace with acc_password chosen by you OR retain the same value
  };

   var sql = ``;
  con.query('INSERT tbl_accounts SET ?', value, function(err, result) {
    if(err) {
      throw err;
    }
    console.log("Value inserted");
  });


  var value2 = {
    acc_name: 'legend', // replace with acc_name chosen by you OR retain the same value
    acc_login: 'legend', // replace with acc_login chosen by you OR retain the same vallue
    acc_password: crypto.createHash('sha256').update("legend").digest('base64') // replace with acc_password chosen by you OR retain the same value
  };

  var sql = ``;
  con.query('INSERT tbl_accounts SET ?', value2, function(err, result) {
    if(err) {
      throw err;
    }
    console.log("Value inserted");
  });
});
