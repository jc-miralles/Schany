<?php
if(isset($_SESSION['idu'])){
	echo "<a href='partie_libre'>Partie libre (pour jouer à 2)</a>&nbsp;";
        if($cbd){
            echo "<a href='parties'>Mes parties</a>&nbsp;";
            $res = mysql_query("select * from sch_users where id=$_SESSION[idu]");
            if(mysql_num_rows($res) > 0){
                    $tab = mysql_fetch_assoc($res);
                    $monPseudo = $tab['pseudo'];
                    echo "<a href='profil'>$tab[pseudo]</a>";
                    if(isset($page) and $page=='main'){
                            echo "&nbsp;<span class='alien app_chat' idu2='$id_adversaire'>Chat</span>";
                    }
                    echo "&nbsp;<span class='alien' id='notifs'>0</span>";
                    echo "&nbsp;<a href='index.php?dc=1' style='color:red' title='Se déconnecter'>X</a>";
            }
        }else{
           echo "<a href='plateau?partie=1'>Contre Vladimir</a>&nbsp;"; 
        }
}
?>