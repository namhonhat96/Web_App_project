// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT

// include the express module
var express = require("express");

// create an express application
var app = express();

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// fs module - provides an API for interacting with the file system
var fs = require("fs");

// helps in managing user sessions
var session = require('express-session');

// native js function for hashing messages with the SHA-1 algorithm
var crypto = require('crypto');

// include the mysql module
var mysql = require("mysql");

// XML parser
var xmlparser = require("xml2js");

// apply the body-parser middleware to all incoming requests
app.use(bodyparser());

// use express-session
// in mremory session is sufficient for this assignment
app.use(session({
  secret: "csci4131secretkey",
  saveUninitialized: true,
  resave: false}
));

fs.readFile(__dirname + '/dbconfig.xml', function(err, data) {
	if (err) throw err;
    xmlparser.parseString(data, function (err, result) {
		if (err) throw err;
    theinfo = result;
    connection = mysql.createConnection({
      host: theinfo.dbconfig.host[0],
      user: theinfo.dbconfig.user[0], // replace with the database user provided to you
      password: theinfo.dbconfig.password[0], // replace with the database password provided to you
      database: theinfo.dbconfig.database[0], // replace with the database user provided to you
      port: parseInt(theinfo.dbconfig.port[0])
    });
    connection.connect(function (err) {
      if (err) {
        throw err;
      }
      console.log("Connected");
    });
  });
});



// server listens on port 9007 for incoming connections
app.listen(9007, () => console.log('Listening on port 9007!'));

app.get('/',function(req, res) {
  console.log("welcome");
	res.sendFile(__dirname + '/client/welcome.html');
});

app.get('/admin',function(req, res) {
  if(req.session.user) {
    res.sendFile(__dirname + '/client/admin.html');
  }
  else {
    return res.redirect('/login');
  }
});

// // GET method route for the schedule page.
// It serves schedule.html present in client folder
app.get('/schedule',function(req, res) {
  if(req.session.user) {
    res.sendFile(__dirname + '/client/schedule.html');
  }
  else {
    return res.redirect('/login');
  }
});

// GET method route for the addEvents page.
// It serves addSchedule.html present in client folder
app.get('/addSchedule',function(req, res) {
  if(req.session.user) {
    res.sendFile(__dirname + '/client/addSchedule.html');
  }
  else {
    return res.redirect('/login');
  }
});

app.get('/stock',function(req, res) {
  if(req.session.user) {
    res.sendFile(__dirname + '/client/stock.html');
  }
  else {
    return res.redirect('/login');
  }
});


// GET method route for the login page.
// It serves login.html present in client folder
app.get('/login',function(req, res) {
  if(req.session.user) {
    res.sendFile(__dirname + '/client/schedule.html');
  }
  else {
    res.sendFile(__dirname + '/client/login.html');
  }
});

// GET method to return the name of the user logged in
// The function queries the table events for the list of places and sends the response back to client
app.get('/getUserName', function(req, res) {
  connection.query('SELECT acc_name FROM tbl_accounts WHERE acc_id = ?', req.session.user , function(err,field) {

  if (err) throw err;
  // upon successful completion
  if (field.length > 0) {
    res.setHeader('Content-type', 'application/json');
    res.status(200).send(field);
  }
  else {
    // no events
    return res.status(404).send();
  }
  });
});

// GET method to return the list of events
// The function queries the table events for the list of places and sends the response back to client
app.get('/getListOfEvents', function(req, res) {
  connection.query('SELECT * FROM tbl_events', function(err,field) {

    if (err) throw err;
    // upon successful completion
    if (field.length > 0) {
      res.setHeader('Content-type', 'application/json');
      res.status(200).send(field);
    }
    else
    {
      // no events
      return res.status(404).send();
    }

    });
});

// GET method to return the list of events
// The function queries the table events for the list of places and sends the response back to client
app.get('/getListOfUsers', function(req, res) {
  connection.query('SELECT * FROM tbl_accounts', function(err,field) {

    if (err) throw err;
    // upon successful completion
    if (field.length > 0) {
      res.setHeader('Content-type', 'application/json');
      res.status(200).send(field);
    }
    else
    {
      return res.status(404).send();
    }

    });
});

// POST method to insert details of a new user to tbl_accounts table
app.post('/postEvent', function(req, res) {
  var newEvent = {
    event_name: req.body.eventName,
    event_location: req.body.location,
    event_date: req.body.date
  }

  connection.query('INSERT tbl_events SET ?', newEvent, function(err, result) {  //Parameterized insert
      if(err) throw err;
      res.redirect('/schedule');
    });
});

// POST method to insert details of a new event to tbl_events table
app.post('/postUser', function(req, res) {
  var rowToBeInserted = {
    acc_name: req.body.accname, // replace with acc_name chosen by you OR retain the same value
    acc_login: req.body.acclogin, // replace with acc_login chosen by you OR retain the same vallue
    acc_password: crypto.createHash('sha256').update(req.body.accpassword).digest('base64') // replace with acc_password chosen by you OR retain the same value
  };

  connection.query('SELECT acc_name FROM tbl_accounts WHERE acc_login = ?', [req.body.acclogin] , function(err,field) {

    if (err) throw err;
  	if (field.length > 0) {
      // there is another user in the database with the login
      return res.status(422).send();
     
    }
    else {
    
      var sql = ``;
      connection.query('INSERT tbl_accounts SET ?', rowToBeInserted, function(err, result) {
          if(err) {
            throw err;
          }
    
          return res.status(200).send();
        });
      }
    });
});

// POST method to insert details of a new event to tbl_events table
app.post('/editUser', function(req, res) {

  var originalusername = req.body.originalusername;


  var rowToBeUpdated = {
    acc_name: req.body.accname, // replace with acc_name chosen by you OR retain the same value
    acc_login: req.body.acclogin, // replace with acc_login chosen by you OR retain the same vallue
    acc_password: crypto.createHash('sha256').update(req.body.accpassword).digest('base64')  // replace with acc_password chosen by you OR retain the same value
  };

  connection.query('SELECT acc_name FROM tbl_accounts WHERE acc_login = ?', [req.body.acclogin] , function(err,field) {

    if (err) throw err;
  	if ((field.length > 0) && (new String(originalusername).valueOf() != new String(req.body.acclogin).valueOf()) ) {
      
      // there is another user in the database with the login
      return res.status(422).send();
    }
    else {
    
      var sql = ``;

        if (req.body.accpassword){
          connection.query(`UPDATE tbl_accounts SET acc_name = '${rowToBeUpdated['acc_name']}', acc_login = '${rowToBeUpdated['acc_login']}', acc_password = '${rowToBeUpdated['acc_password']}' WHERE acc_id = ${req.body.accid}`, function(err, result) {
            if(err) {
              throw err;
            }
           
            return res.status(200).send();
          });
        }
        else {
          // password is empty so don't update her
          connection.query(`UPDATE tbl_accounts SET acc_name = '${rowToBeUpdated['acc_name']}', acc_login = '${rowToBeUpdated['acc_login']}' WHERE acc_id = ${req.body.accid}`, function(err, result) {
            if(err) {
              throw err;
            }
            return res.status(200).send();
          });
        }
      }
    });
});

// POST method to insert details of a new event to tbl_events table
app.post('/deleteUser', function(req, res) {
  var accid = req.body.accid;

  connection.query('SELECT acc_name FROM tbl_accounts WHERE acc_id = ?', accid , function(err,field) {

    if (err) throw err;
  	if (field.length > 0) {
      // there is another user in the database with the login
      if (req.session.user == accid) {
        return res.status(422).send();
      } else {
        connection.query('DELETE FROM tbl_accounts WHERE acc_id = ?', accid, function(err, result) {
            if(err) {
              throw err;
            }
            return res.status(200).send();
          });
        }
      }
    });
});

// POST method to validate user login
// upon successful login, user session is created
app.post('/sendLoginDetails', function(req, res) {
  var username = req.body.user;
  var password = crypto.createHash('sha256').update(req.body.password).digest('base64');

  connection.query('SELECT acc_name, acc_password, acc_id FROM tbl_accounts WHERE acc_login = ? and acc_password = ?', [username, password] , function(err,field) {

    if (err) throw err;
  	if (field.length > 0) {
      req.session.user = field[0].acc_id;
      req.session.value = 1;
      return res.status(200).send();
    }
    else {
      req.session.value = 0;
    
      return res.status(404).send();
    }
    });
});

// log out of the application
// destroy user session
app.get('/logout', function(req, res) {
  if(!req.session.value) {
		res.send('Session not started, can not logout!');
	} else {
	req.session.destroy();
    res.sendFile(__dirname + '/client/login.html');
	}
});

// middle ware to serve static files
app.use('/client', express.static(__dirname + '/client'));


// function to return the 404 message and error to client
app.get('*', function(req, res) {
  // add details
  res.status(404).sendFile(__dirname + '/client/404.html');
});
