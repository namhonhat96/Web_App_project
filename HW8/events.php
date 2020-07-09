<?php
          error_reporting(E_ALL);
          ini_set( 'display_errors','1');
          include_once 'database.php';
          session_start();
         $usersName = '';
                 if (!isset($_SESSION['user'])) {
            header('Location: login.php');
                   die();
                   }else{
               $usersName = $_SESSION['user'];
           
            } 
 
             
            ?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <link rel="stylesheet" type="text/css" href="myStyles.css">
  	<link rel="stylesheet" type="text/css" href="style.css">
  </head>
  <body>
    <nav class="navbar navbar-default">
        <div class="container-fluid">
          <ul class="nav navbar-nav">
            <li><a href='/~hoxxx395/events.php'> Events Page </a></li>
            <li><a href='/~hoxxx395/logout.php'><span class="glyphicon glyphicon-log-out"></span></a></li>
          </ul>
          <ul class="nav navbar-nav navbar-right">

            <li><a href='/admin'><b>Welcome <span id='loggedinuser'>
              <?php   
                  echo $usersName;
            ?>
            
          </span></b></a></li>
          </ul>
        </div>
      </nav>
    <br><br>
    <div class="container">
        <table class="table">
         
          <tbody id="calendarTable">

     
            <?php
             $con= new mysqli($db_servername, $db_username, $db_password, $db_name );
              // Check connection
             if ($con->connect_error) {
        $error .= $db_servername.'MYSQL ERROR: '.$conn->connect_error.'<br />';
      }  else {
              // Default query
              $myQuery = "SELECT * FROM tbl_events";
              
              // Dynamically change QUERY
              if(isset($_POST['dropbox'])){
              	$order = $_POST['dropbox'];
                $value = trim($_POST['filter']);

                if ($order == 'event_name'){
                   $myQuery = 'SELECT * FROM tbl_events WHERE event_name LIKE \'%'.$value.'%\' ORDER BY '.$order.' ASC;';
                }else if ($order == 'event_location') { 
                  	$myQuery = 'SELECT * FROM tbl_events WHERE event_location LIKE \'%'.$value.'%\' ORDER BY '.$order.' ASC;';
                 }else if($order == 'event_day') {
                  	$myQuery = 'SELECT * FROM tbl_events WHERE event_day LIKE \'%'.$value.'%\' ORDER BY '.$order.' ASC;';
                }else if($order == 'event_start_time'){
                	$myQuery = 'SELECT * FROM tbl_events WHERE event_start_time LIKE \''.$value.'%\' ORDER BY '.$order.' ASC;';
                }else if($order == 'event_end_time'){
                	$myQuery = 'SELECT * FROM tbl_events WHERE event_end_time LIKE \''.$value.'%\' ORDER BY '.$order.' ASC;';
                }
          
              }
              // Execute query
              if($result = mysqli_query($con, $myQuery)){
                if(mysqli_num_rows($result) > 0){
              
                    echo "<tr>"; 
                      echo "<th>Event Name</th>"; 
                      echo "<th>Location</th>"; 
                      echo "<th>Date</th> &nbsp; &nbsp;"; 
                      echo "<th>Start Time</th> &nbsp; &nbsp;"; 
                      echo "<th>End Time</th>"; 
                    echo "</tr>"; 
                  while($row = mysqli_fetch_array($result)){
                    echo "<tr>";
                      echo "<td>" . $row['event_name'] . "</td>"; 
                      echo "<td>" . $row['event_location'] . "</td>"; 
                      echo "<td>" . $row['event_day'] . "</td> &nbsp; &nbsp;"; 
                      echo "<td>" . $row['event_start_time'] . "</td> &nbsp; &nbsp; "; 
                      echo "<td>" . $row['event_end_time'] . "</td>"; 
                      echo "</tr>";  
                  }
               
                  mysqli_free_result($result); 
                } else{ 
                 echo "No Matching records are found."; 
                }
              } else{ 
                  echo "ERROR: Could not able to execute $sql. "  . mysqli_error($con); 
              } 
              
              mysqli_close($con);
            }
            ?>

            </tbody>
        </table>
        
             <form name ="filtering-form" method="post">
            <select id="dropbox" name = "dropbox">
              <option name = "event_name" value = "event_name" selected >Event Name</option>
              <option name = "event_location" value ="event_location"> Event Location</option>
              <option name = "event_day" value = "event_day">  Day of Week</option>
              <option name = "event_start_time" value ="event_start_time"> Event Start Time </option>
              <option name = "event_end_time" value = "event_end_time">Event End Time</option>
            </select>
           <br>
            Contains: <input type = "text" name = "filter" id = "filter" placeholder="Enter the keyword" > <br>
           <input type = "submit">
          </form>



      </div>
  </body>
</html>