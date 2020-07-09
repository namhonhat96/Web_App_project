<?php
  include_once 'database.php';
  session_start();

  echo "destroying session";
  
  	  unset($_SESSION['user']);
  		session_destroy();
 

  header("Location: login.php");
  exit();
?>