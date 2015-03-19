<?php
if (!isset($_SESSION)) {
  session_start();
}
include('config.php');

if(isset($_SESSION['idu']) and $cbd){
        include('bd/bd_chercher_chat.php');
}
?>