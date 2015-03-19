<?php
if (!isset($_SESSION)) {
  session_start();
}
include('config.php');
if($cbd){
   include('bd/bd_chercher_notifs.php'); 
}
?>