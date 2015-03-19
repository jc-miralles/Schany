<?php
if (!isset($_SESSION)) {
  session_start();
}
include('config.php');

if($cbd){
    include('bd/bd_chercher_coup.php');    
}else{
   if(isset($_SESSION['last_play'])){
		echo $_SESSION['last_play'];
		echo ",".$_SESSION['last_pos'];
		echo ",".$_SESSION['id_coup'];
	}else{
		echo 0;
	} 
}
?>