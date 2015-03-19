<?php
if (!isset($_SESSION)) {
  session_start();
}
error_reporting(E_ALL & ~E_NOTICE);
if(isset($_GET['np'])){
	unset($_SESSION['last_play']);
	unset($_SESSION['last_pos']);
}
//echo $_COOKIE["id_u"];
include("config.php");

if($cbd){
    include('bd/bd_log.php');
}else{
    $_SESSION['idu'] = 9999999;
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Schany</title>
<link href="css/style.css" rel="stylesheet" type="text/css" />
<link href="css/styles_bt.css" rel="stylesheet" type="text/css" />
<!--<script type="text/javascript" src="jquery/jquery-1.6.4.js"></script> 
<script type="text/javascript" src="jquery/jquery_ui/jquery-ui.js"></script>-->
 <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.12/jquery-ui.min.js"></script> 
<script type="text/javascript" src="jquery_ui/jquery.ui.touch-punch.min.js"></script>
<script type="text/javascript">
var larg_c = 80;
var larg_b = 80;
var joueur_actif = -1;
var coup_schany = 0;
<?php if(isset($_GET['j1'])){ ?>
var iam = 1;
<?php }elseif(isset($_GET['j2'])){ ?>
var iam = -1;
<?php }else{ ?>
var iam = 0;
<?php } ?>
var pos_en_cours = '';
var larg_boule = 62;
var s1 = 0;
var s2 = 0;
</script>
<!-- <script type="text/javascript" src="jquery/specif_schany.js"></script>-->
<script type="text/javascript">
$(document).ready(function(){
	$('#bt_test').click(function(event){

	});
	$('#connect').click(function(event){
		if(verif_form()){
			$('#frm_connect').submit();
		}
	});
	 $(document).keypress(traitement);
});

function traitement(evenement){
    if(evenement.which==13){
		if(verif_form()){
			$('#frm_connect').submit();
		}
	}
}

function verif_form(){
	//alert($('#log').val());
	retour = false; 
	if($('#log').val()!=''){
	// log normal, vérif existence mdp seulement
		if($('#password').val() == ''){
			alert('Vous devez saisir un mot de passe.');
		}else{
			// on vide les champs de nouvelle inscription
			$('#log2').val('');
			$('#mail').val('');
			$('#password2').val('');
			retour = true;
		}
	}else{
		if(!verifiermail($('#mail').val())){
			alert('Le mail saisi n`\'est pas valide.');
		}else{
			st_psd = $('#password2').val();
			if(st_psd.length < 8){
				alert('Votre mot de passe doit être de 8 caractères minimum.');
			}else{
				st_pseudo = $('#log2').val();
				st_pseudo = st_pseudo.trim();
				if(st_pseudo.length < 3){
					alert('Votre pseudo doit être de 3 caractères minimum.');
				}else{
					var regex = new RegExp(/([^A-Za-z0-9 _\-])/);
					if (regex.test (st_pseudo)) {
						alert('Votre pseudo ne doit comporter que des lettres, des chiffres ou des espaces.');
					}else{
						retour = true;
					}
				}
			}
		}
	}
	return retour;
}

function verifiermail(mail) {
      if ((mail.indexOf("@")>=0)&&(mail.indexOf(".")>=0)) {
         return true 
      } else {
         return false
      }
   }
</script> 

</head>

<body>
<div id="topitop">
</div>
<div id="conteneur">
	<div id="top" class="top_i">
            <?php $titre =  $cbd ? 'Bienvenue sur le site du Schany en ligne' : 'Schany (local V 1.0.0)';?>
            <h5><?php echo $titre; ?></h5>
	<?php
	if($message != ''){
		echo "<div id='message_inscr'>$message</div>";
	}
        if(!$cbd){
            ?>
            <div id='message_inscr'>Version sans base de données du schany, dévellopée en php, javascript, jquery.
                <br>Vous pouvez découvrir les fonctionnalités du jeu, jouer contre Vladimir ...
                <br>La version en ligne est accessible ici : <a href='http://www.jeanchris.com/schany' target='_blank'>http://www.jeanchris.com/schany</a>
                </div><br>
            <?php
        }
	?>
        <?php if($cbd){ ?>
            <form method="POST" name="frm_connect" id="frm_connect">
            <div class="st_i">Se connecter</div>
            Login ou mail <input type="text" name="log" id="log" value="<?php echo $log; ?>">
            &nbsp;Mot de passe <input type="password" name="password" id="password">
            <br><br><input type="checkbox" name="restercon" id="restercon" value="1">Rester connecté
            <div class="st_i">S'inscrire</div>
            Login <input type="text" name="log2" id="log2" value="<?php echo $_POST['log2']; ?>">
            &nbsp;Mail <input type="text" name="mail" id="mail" value="<?php echo $_POST['mail']; ?>">
            &nbsp;Mot de passe <input type="password" name="password2" id="password2">
            <br>
            <br><a href="#" class="bouton violet small" id="connect">Envoyer</a>
            </form>
            <a href="main.php?np=1">Ou essayer une partie "libre" (à 2 sur le même écran ...)</a>
        <?php } ?>
	</div>
	<div id="center" class="center_i">
	<img src="images/schany.gif">
	</div>
	<div id="footer">
	<?php include("footer.php"); ?>
	</div>
</div>
</body>
</html>
