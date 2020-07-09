<?php
  error_reporting(E_ALL);
  ini_set( 'display_errors','1');

  session_start();
  if (isset($_SESSION['user']) && ($_SESSION['password'])) {
    header('Location: events.php');
    die();
  }

  $login='';
  $error='';

  if (!empty($_POST)) { //check to make see if login form was submitted

    //validate the input...
    $login = trim($_POST['login']);
	$password = trim($_POST['password']);
    if (($login == '') or ($password == ''))
		$error .= 'Invalid Credentials.<br />';

    if ($error == '') {
      //load Database credentials from a file
      // *** SECURITY TIP *** good practice is to place this file outside of web folder
      include_once 'database.php';

      //connect to mySQL
      // Create connection
      $conn = new mysqli($db_servername, $db_username, $db_password, $db_name);

      // Check connection
      if ($conn->connect_error) {
        $error .= $db_servername.'MYSQL ERROR: '.$conn->connect_error.'<br />';
      }  else {
        //Query Database for login name, note you can do this entire
		//check more efficiently using a query that checks
		//for a match with a login and a hashed password.
        $sql_query = 'SELECT acc_id, acc_name, acc_login, acc_password FROM tbl_accounts WHERE acc_login=\''.$login.'\' LIMIT 1;';
        // note, the \' escapes single quote (') so it is included in the
		// query string assigned to $sql_query
        $result = $conn->query($sql_query);
        //  echo $result->num_rows; // debug check, could use var_dump as well
        if ($result->num_rows == 1) {

            //Get the Password
            if ($row = $result->fetch_assoc()) {
                $hashed_password = $row['acc_password'];
                $error="";
                //hash the FORM password and compare with hashed password
				// stored in the DB
                if (base64_encode(hash("sha256",$password,True)) == ($hashed_password)) {
                  //everything is good, set the session variable and redirect the user
                  $_SESSION['user'] = $login;
				  $_SESSION['password'] = $hashed_password;

                  //close connection
                  $conn->close();

                  //redirect user
                  header('Location: events.php');
                  exit();
                } else {
                  $error .= 'Invalid Credentials';
                
                }
            } // end get password
        } // match found
		else {
            $error .= 'Invalid Credentials'; // no match found in db
         
        }

        //close connection
        $conn->close();
      }// connection to database check
    } // form validation check
  }// $_POST check
?>
<!-- You should provide your own html for the login form, we have
 included a placeholder below, you are free to use/change it - note
 you must provide your own style file -->
<!DOCTYPE html>
<html>
<head>
 <meta charset="utf-8">
  <link rel="stylesheet" type="text/css" href="myStyles.css">
  <link rel="stylesheet" type="text/css" href="style.css">
  <title>Log In</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

</head>
<body>


  <body>
     <div id = "header" class ="loginSection">
        <h1>Login Page</h1>
        <p><?php echo $error; ?></p>
        <p>Please enter your user name and password. Both are case sensitive.</p>
    </div>

  <div id="errorMessage" style="display:none">
    <h2>Error:  COULD NOT AUTHENTICATE USERNAME OR PASSWORD </h2>
  </div>




  <form id="login" method="post">
      <table style="margin:1em auto;">
            <tr col>
              <td>
                <label for "login" > User:</label>
              </td>
              <td>
                <input class = "login" type="text" id="user" name="login" placeholder="Enter your username" required>
              </td>
            </tr>

            <tr>
              <td>
                <label for "password">Password:</label>
              </td>

              <td>
                <input type="password" id = "password" name="password" placeholder="Enter your password"  class= "login" required>
              </td>
            </tr>
            <tr>
              <td colorspan = "2">
                <input type="submit" value="Submit" class="btn btn-primary btn-block">
              </td>
         
            </tr>

          </table>
        </form>
</body>
</html>

