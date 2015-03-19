<?php
if (!isset($_SESSION)) {
  session_start();
}
include('config.php');
$res = mysql_query("select derniere_activite from sch_users where id='$_SESSION[idu]'");
$tab = mysql_fetch_assoc($res);
echo "Derniere act : ".$tab['derniere_activite'];
echo "<br>Ya 2 min :";
echo date('Y-m-d H:i',strtotime('- 2 min'));
echo "<br>T dernier act : ";
echo strtotime($tab['derniere_activite']);
echo "<br>T Ya 2 min : ";
echo strtotime('- 2 min');
echo "<br>DA - YA2 : ";
echo strtotime($tab['derniere_activite']) - strtotime('- 2 min');
?>