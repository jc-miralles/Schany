<?php
if (!isset($_SESSION)) {
  session_start();
}
error_reporting(E_ALL & ~E_NOTICE);
$page = 'main';
if(isset($_GET['np'])){
	unset($_SESSION['last_play']);
	unset($_SESSION['last_pos']);
	unset($_SESSION['id_partie']);
}
include("config.php");
if(isset($_GET['partie'])){
	$partie=$_GET['partie'];
}else{
    if(isset($_SESSION['id_partie'])){
            $partie=$_SESSION['id_partie'];
    }else{
            $partie=0;
    }
}
// si on est sur une partie qui ne nous concerne pas : out
if($partie != 0 and $cbd){
	$res = mysql_query("select * from sch_parties where id=$partie");
	$tab = mysql_fetch_assoc($res);
	if($tab['id_j1']!=$_SESSION['idu'] AND $tab['id_j2']!=$_SESSION['idu']){
		header("Location: $adresse_site/accueil-$partie");
	}
}
$larg_boule = 62;
//print_r($_SESSION);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>Schany</title>
<link href="css/style.css" rel="stylesheet" type="text/css" />
<!--<script type="text/javascript" src="jquery/jquery-1.6.4.js"></script> 
<script type="text/javascript" src="jquery/jquery_ui/jquery-ui.js"></script>-->
 <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.12/jquery-ui.min.js"></script> 
<script type="text/javascript" src="jquery_ui/jquery.ui.touch-punch.min.js"></script>
<script type="text/javascript" src="jquery/ionsound/ion.sound.min.js"></script>
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
var i_a = 0;
<?php
// variables de session
if(isset($_SESSION['idu']) and isset($partie) and !empty($partie)){
	// recherche des donénes de la partie
        if($cbd){
            $res = mysql_query("select * from sch_parties where id=$partie");
            $tab = mysql_fetch_assoc($res);
            $id_j1 = $tab['id_j1'];
            $id_j2 = $tab['id_j2'];
        }else{
            $id_j1 = -1;
            $id_j2 = $_SESSION['idu'];
            $tab['id_j1'] = $id_j1;
            $tab['id_j2'] = $id_j2;
        }
	$tab_jv = array('-1'=>'Vladimir','-2'=>'Igor');
	if($tab['id_j1'] > 0){
                if($cbd){
                    $res2 = mysql_query("select * from sch_users where id=$tab[id_j1]");
                    $tab2 = mysql_fetch_assoc($res2);
                }else{
                    $tab2 = array();
                    $tab2['pseudo'] = 'Moi';
                }
		echo "var joueur1 = '$tab2[pseudo]';
		";
	}else{
		$j = $tab['id_j1'];
		echo "var joueur1 = '$tab_jv[$j]';
		";
		echo "i_a = 1;
		";
	}
	if($tab['id_j2'] > 0){
                if($cbd){
                    $res2 = mysql_query("select * from sch_users where id=$tab[id_j2]");
                    $tab2 = mysql_fetch_assoc($res2);
                }else{
                    $tab2 = array();
                    $tab2['pseudo'] = 'Moi';
                }
		echo "var joueur2 = '$tab2[pseudo]';
		";
	}else{
		$j = $tab['id_j2'];
		echo "var joueur2 = '$tab_jv[$j]';
		";
		echo "i_a = 1;
		";
	}
	if($tab['id_j1'] == $_SESSION['idu']){
		echo "iam = 1;
	";
		$id_adversaire = $tab['id_j2'];
	}
	if($tab['id_j2'] == $_SESSION['idu']){
		echo "iam = -1;
	";
		$id_adversaire = $tab['id_j1'];
	}
	// OPTIONS DU JOUEUR
        if($cbd){
            $res_j = mysql_query("select * from sch_users where id=$_SESSION[idu]");
            $tab_j = mysql_fetch_assoc($res_j);
            echo "var pasdeson = $tab_j[pasdeson];\n";
        }else{
            echo "var pasdeson = 0;\n";
        }
	
}else{
	echo "var joueur1 = 'Joueur 1';
	";
	echo "var joueur2 = 'Joueur 2';
	";
	echo "var pasdeson = 0;
	";
}
echo "var p_encours=".$partie.";
";
?>
var ailleur = 0;
</script>
<script type="text/javascript" src="jquery/specif_schany.js"></script>
<?php if(isset($j)){ ?>
<script type="text/javascript" src="jquery/ia_schany_<?php echo -$j ;?>.js"></script>
<?php } ?>
<script type="text/javascript" src="jquery/specif_chat.js"></script>
<script type="text/javascript">
$(document).ready(function(){
	$("#nom_j1").html("<img src='images/elt/boule_bleuepm.png' width='18' align='absmiddle'>&nbsp;"+joueur1);
	<?php $f = 'images/users/image_u_'.$id_j1.'.jpg';
		if(is_file ($f)){
			?>
			$("#nom_j1").html($("#nom_j1").html()+"&nbsp;<img src='<?php echo $f; ?>' width='28' height='28' align='absmiddle'>");
			<?php
		}
	?>
	$("#nom_j2").html("<img src='images/elt/boule_rougepm.png' width='18' align='absmiddle'>&nbsp;"+joueur2);
	<?php $f = 'images/users/image_u_'.$id_j2.'.jpg';
		if(is_file ($f)){
			?>
			$("#nom_j2").html($("#nom_j2").html()+"&nbsp;<img src='<?php echo $f; ?>' width='28' height='28' align='absmiddle'>");
			<?php
		}
	?>
	ion.sound({
		sounds: [
			{
				name: "metal_plate_2"
			},
			{
				name: "pop_cork"
			},
			{
				name: "bell_ring"
			}
		],
		volume: 0.5,
		path: "sounds/",
		preload: true
	});
	/* ion.sound.play("bell_ring", {
		volume: 0.6
	}); */
});
</script>

</head>

<body>
<div id="topitop">
	<div id="topitop_int">
	<?php include('header.php'); 
        //print_r($_SESSION);
        ?>
	</div>
</div>
<div id="conteneur">
	<div id="notifications"></div>
	<div id="top" style="min-height:115px;">
		<div id="param_parties"></div>
		<div class="noms_j"><table><tr><td valign="middle" id="nom_j1" height="28"></td></tr></table></div> 
		<div id="pt1" class="pts_j">0</div> 
		<div class="noms_j"><table><tr><td valign="middle" id="nom_j2" height="28"></td></tr></table></div> 
		<div id="pt2" class="pts_j">0</div> 
		<div id="aquiletour"></div> 
		<div colspan="4"  class="noms_j cpdesch" id="ligne_cds">
			Coup de Schany possible pour&nbsp; 
			<?php $f = 'images/users/image_u_'.$id_j1.'.jpg';
				if(is_file ($f)){
					$src = $f; $cl='img_j';
				}else{
					$src ="images/elt/boule_bleuepm.png"; $cl='';
				}
			?>
			<img src='<?php echo $src; ?>' id='cptsch1' width='32' align='absmiddle' class='<?php echo $cl; ?>'>
			<?php $f = 'images/users/image_u_'.$id_j2.'.jpg';
				if(is_file ($f)){
					$src = $f; $cl='img_j';
				}else{
					$src ="images/elt/boule_rougepm.png"; $cl='';
				}
			?>
			<img src='<?php echo $src; ?>' id='cptsch2' width='32' height='32' align='absmiddle' class='<?php echo $cl; ?>'>
		</div>
		<div id="msg_partie" style="display:none;"></div>
	</div>
	<div id="center">
		<div id="barre_p1">
		<div class="marques">4</div>
		<div class="marques">3</div>
		<div class="marques">2</div>
		<div class="marques">1</div>
		<div class="marques">1</div>
		<div class="marques">1</div>
		<div class="marques">2</div>
		<div class="marques">3</div>
		<div class="marques">4</div>
		</div>
		<div id="plateau">
			<?php
			$cl_b = "barre_paire";
			for($j=1;$j<9;$j++){
				$cl_b = $cl_b=="barre_impaire" ? "barre_paire" : "barre_impaire";
				echo "<div id='barre$j' class='barre $cl_b'>";
				for($i=1;$i<10;$i++){
					echo "<div id='case_$i$j' class='case' X='$i' Y='$j'>";
					if($j==8){
						echo "<img src='images/elt/boule_rougepm.png' width='$larg_boule' class='boule b_active sens2' sens='-1' X='$i' Y='$j' id='boule2_$i'/>";
					}
					if($j==1){
						echo "<img src='images/elt/boule_bleuepm.png' width='$larg_boule' class='boule b_active sens1' sens='1' X='$i' Y='$j' id='boule1_$i'/>";
					}
					echo "</div>";
				}
				echo "</div>";
			}
			?>
			
		</div>
		<div id="barre_p2">
		<div class="marques">4</div>
		<div class="marques">3</div>
		<div class="marques">2</div>
		<div class="marques">1</div>
		<div class="marques">1</div>
		<div class="marques">1</div>
		<div class="marques">2</div>
		<div class="marques">3</div>
		<div class="marques">4</div>
		</div>
	</div>
	<div id="boules_perdues" align="center"></div>
		<?php if(isset($_SESSION['idu']) and $_SESSION['idu']==1){ ?>
		<div id="debug">
			<img src='images/elt/boule_rouge.png' id='bt_test' width='24'>
			<div id="msg_debug">
			</div>
		</div>
		<?php } ?>
	<div id="footer">
	<?php include("footer.php"); ?>
	</div>
	<?php include("chat.php"); ?>
</div>
</body>
</html>
