// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT

// include the express module
var express = require("express");

// create an express application
var app = express();

var path = require('path');

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// fs module - provides an API for interacting with the file system
var fs = require("fs");

// helps in managing user sessions
var session = require('express-session');

// native js function for hashing messages with the SHA-256 algorithm
var crypto = require('crypto');

// include the mysql module
var mysql = require('mysql');

var db = require('./db.js');

var test;
// apply the body-parser middleware to all incoming requests
app.use(bodyparser());

app.use(session({
  secret: "csci4131secretkey",
  saveUninitialized: true,
  resave: false}
));

var con = mysql.createConnection({
    host: "cse-curly.cse.umn.edu",
    user: "C4131S19G51",
    password: "2631", // replace with the database password provided to you
    database: "C4131S19G51", // replace with the database user provided to you
    port: 3306
  });

// server listens on port 9007 for incoming connections
app.listen(9022, () => console.log('Listening on port 9022!'));

app.get('/',function(req, res) {
  req.session.values = 0;
	res.sendFile(__dirname + '/client/welcome.html'); 
});

// GET method route for the events page.
// It serves schedule.html present in client folder
app.get('/schedule',function(req, res) {
    if (req.session.values > 0) {
        //req.session.values += 1;
       res.sendFile(__dirname + '/client/schedule.html');
    } else {
        res.sendFile(__dirname + '/client/login.html');
    }
});

// GET method route for the addEvents page.
// It serves addSchedule.html present in client folder
app.get('/addSchedule',function(req, res) {
    if (req.session.values >0 ) {
        res.sendFile(__dirname + '/client/addSchedule.html');
    } else {
        res.sendFile(__dirname + '/client/login.html');
    }
});

//GET method for stock page
app.get('/stock', function (req, res) {
    if (req.session.values>0) {   
         res.sendFile(__dirname + '/client/stock.html');
    } else {
       res.sendFile(__dirname + '/client/login.html');
    }
});

// GET method route for the login page.
// It serves login.html present in client folder
app.get('/login',function(req, res) {
	if(req.session.values >0){
    res.sendFile(__dirname + '/client/schedule.html');
  }else{
    res.sendFile(__dirname + '/client/login.html');
  }
});

// GET method to return the list of events
app.get('/getListOfEvents', function(req, res) {
  var sql = "SELECT * FROM tbl_events;";
  db.get().query(sql, function (err, rows) {
    if (err) throw err;
    res.send(rows);
  });
});

// POST method to insert details of a new event to tbl_events table
app.post('/postEvent', function(req, res) {
  var sql = `INSERT INTO tbl_events (event_name, event_location, event_day, event_start_time, event_end_time)
               VALUES ('${req.body.eventName}', '${req.body.location}', '${req.body.date}', '${req.body.stime}', '${req.body.etime}');`;
    db.get().query(sql, function (err, rows) {
        if (err) throw err;
        console.log("Successfully inserted 1 row")
    });
   res.sendFile(__dirname + '/client/schedule.html');
});


// POST method to validate user login
// upon successful login, user session is created
app.post('/sendLoginDetails', function(req, res) {
	var username = req.body.username;
	var pass = crypto.createHash('sha256').update(req.body.password).digest('base64');

  var sql = `SELECT count(*) FROM tbl_accounts WHERE acc_login='${username}' AND acc_password='${pass}';`;
  var valid = db.get().query(sql, function (err, field) {
        if (err) throw err;
        const counter = Object.values(field[0])[0];
        if (counter > 0) {
          req.session.values = 1;
          res.sendFile(__dirname + '/client/schedule.html');
        }else{
          console.log("Invalid data");
          res.sendFile(__dirname + '/client/login.html');
        }
  });
   
});

// log out of the application
// destroy user session
app.get('/logout', function(req, res) {
    console.log("Successful Logged Out session!");
    req.session.destroy();
    //req.session.values = 0;
    res.sendFile(__dirname + '/client/login.html');
});

// middle ware to serve static files
app.use('/client', express.static(__dirname + '/client'));


// function to return the 404 message and error to client
app.get('*', function(req, res) {
  // add details
    res.sendFile(__dirname + '/client/404.html'); 
});
