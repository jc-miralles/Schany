<?php
if (!isset($_SESSION)) {
  session_start();
}
error_reporting(E_ALL & ~E_NOTICE);
include("config.php");

if(isset($_POST['adversaire_c']) and $_POST['adversaire_c'] > 0){
	// création de la partie :
	mysql_query("insert into sch_parties(id_j1,id_j2,date_crea,date_derniere_action) 
	values($_POST[adversaire_c],$_SESSION[idu],NOW(),NOW())");
	$_SESSION['id_partie'] = mysql_insert_id();
	header("Location: $adresse_site/plateau");
}
if(isset($_POST['partie']) and $_POST['partie'] > 0){
	// accés à la partie :
	$_SESSION['id_partie'] = $_POST['partie'];
	header("Location: $adresse_site/plateau");
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Schany- Règles du jeu</title>
<link href="css/style.css" rel="stylesheet" type="text/css" />
<link href="css/styles_bt.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.12/jquery-ui.min.js"></script> 
<script type="text/javascript" src="jquery_ui/jquery.ui.touch-punch.min.js"></script>
<script type="text/javascript" src="jquery/specif_schany.js"></script>
<script type="text/javascript" src="jquery/specif_chat.js"></script>
<script type="text/javascript">
var ailleur = 1;
</script>
</head>

<body>
<div id="topitop">
	<div id="topitop_int">
	<?php include('header.php'); ?>
	</div>
</div>
<div id="conteneur">
	<div id="notifications"></div>
	<div id="regles" class="block_parties">
	<p align="center"><img src="images/schany.gif" width="200">
	<br><br><strong>SCHANY</strong></p>
<p><br />
</p>
<h1>REGLES DU JEU</h1>
<p><br />
</p>
<h1>Le jeu comporte:</h1>
<p><br />
</p>
<p> 1 plateau compos&eacute; de 8 barres  mobiles autour d'un axe poss&eacute;dant chacune une partie stable et une  partie instable (rouge)</p>
<p> 9 billes bleut&eacute;es.</p>
<p> 9 billes argent&eacute;es.</p>
<h1>Nombre de joueurs: 2</h1>
<p><br />
</p>
<p>D&eacute;but de la partie:</p>
<p>Les 9 billes de chaque couleur sont placées sur les premi&egrave;res barres du plateau situ&eacute;e devant chaque joueur qui  constitueront leur camp.</p>
<h1>But du jeu:</h1>
<p>Finir la partie avec plus de points que  son adversaire. Les billes arriv&eacute;es dans le camp adverse valent les  points marqu&eacute;s sur le rebord du jeu situ&eacute;s face &agrave; elles </p>
<p>(de 1 &agrave; 4). Les autres billes rest&eacute;es  sur le plateau valent 1 point.</p>
<h1>R&egrave;gles du jeu:</h1>
<p><br />
</p>
<p> Les boules argentées commencent, puis tour &agrave; tour, chaque joueur avance une de ses  billes d'un trou soit tout droit, soit en diagonale. Une bille ne  peut revenir en arri&egrave;re ni se d&eacute;placer sur la m&ecirc;me barre.</p>
<p> Une bille ne peut sauter par  dessus une autre.</p>
<p> Lorsque le poids de la partie  instable de la barre est sup&eacute;rieur &agrave; celui de la partie stable, la  barre bascule et toutes les billes qui &eacute;taient sur cette barre sont  perdues (sauf coup de Schany). ATTENTION: Ce poids d&eacute;pend du nombre  de billes MAIS AUSSI de la position de celles-ci par rapport &agrave; l'axe  central.</p>
<p> On peut donc faire tomber des  billes de deux fa&ccedil;ons diff&eacute;rentes: Soit en rajoutant une bille sur  la partie instable de la barre suivante, soit en enlevant une bille  qui faisait contrepoids sur une partie stable.</p>
<p> Coup de Schany: Lorsqu'un joueur  ne fait tomber sur un coup QUE des billes de sa propre couleur, il  doit les replacer sur son camp en partant de la partie stable et en  remontant vers la partie instable.</p>
<p> (Un coup de Schany ne peut &ecirc;tre  r&eacute;alis&eacute; 2 fois de suite par un m&ecirc;me joueur, autrement dit, Si un  joueur a fait un coup de Schany, il faut que le deuxi&egrave;me joueur en  fasse un pour que le premier puisse en refaire un.)</p>
<h1>Fin de la partie:</h1>
<p>Lorsqu'aucun des deux joueurs ne peut plus  jouer, ou lorsque tous les mouvements possibles aboutissent à la même position de jeu (enchaînements de coups de schany) la  partie s'arr&ecirc;te.</p>
	</div>
	<div id="footer">
	<?php include("footer.php"); ?>
	</div>
	<?php include("chat.php"); ?>
</div>
</body>
</html>
