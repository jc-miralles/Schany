<?php
if (!isset($_SESSION)) {
  session_start();
}
include('config.php');

if($cbd){
   include('bd/bd_enregistrer_coup.php'); 
}else{
    $_SESSION['last_play'] = $_GET['c'];
    $_SESSION['last_pos'] = $_GET['pos'];
    $_SESSION['id_coup']++;
}

?>