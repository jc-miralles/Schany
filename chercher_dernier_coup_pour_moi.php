<?php
if (!isset($_SESSION)) {
  session_start();
}
include('config.php');
if($cbd){
    include('bd/bd_chercher_dernier_coup_pour_moi.php');
}
?>