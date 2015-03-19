var redessiner = 1;

$(document).ready(function(){
		
});

function proposer_coup(idj){
	$.ajax({
	  url: "chercher_coup.php?partie="+p_encours,
	  async: false,
	  success: function(data) {
		var t = data.split(',');
		if(t[0]==idj){
			//afficher('POS ENREG : '+t[4],1);
			// tableau obtenu
			var dep_fait = new Array();
			dep_fait.push(t[1]);
			dep_fait.push(t[2]);
			var pos = tableau_suivant(t[4].split(';'),dep_fait);
			//afficher('POS OBTENUE : '+pos,1);
			// liste des coups à jouer :
			
			var depl = lister_deplacements_poss(pos);
			
			max = -1000;
			for(ind_pc=0;ind_pc<depl.length;ind_pc++){
				var dp2 = depl[ind_pc].split(',');
				var ts = tableau_suivant(pos,dp2);
				ev = evaluer_pos(ts,-idj);
				//afficher(dp2+'|'+ev,1);
				if(ev[0] > max){
					var tb_max = new Array();
					max = ev[0];
					tb_max.push(dp2);
				}else{
					if(ev[0] == max){
						tb_max.push(dp2);
					}
				}
				//afficher("<b>DEP "+dp2+": </b>"+ts+' ('+ev+')',1);
			}
			afficher(tb_max.length+" POSSIBILITES MAX",0);
			var i = Math.floor((Math.random() * (tb_max.length-1)));//randomInt(0, tb_max.length-1);
			afficher("CHOIX "+tb_max[i],1);
			//t = tb_max[i].split(',');
			v = joueur_actif+','+tb_max[i].join(',')+','+coup_schany;
			afficher("v="+v,1);
			pos = pos2tab(2);
			afficher("pos="+pos,1);
			avancer_boule(tb_max[i][0],tb_max[i][1]);
			$.ajax({
			  url: "enregistrer_coup.php?c="+v+"&pos="+pos+"&partie="+p_encours,
			  async: false,
			  success: function(data) {
			  }
			});
		}else{
			afficher('Probleme',1);
		}
	  }
	});
}