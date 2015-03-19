var redessiner = 1;
var dernier_coup = 0;
var pt1 = 0;
var pt2 = 0;
$(document).ready(function(){
	if(ailleur!=1){
		var xc = 0;
		var yc = 0;
		if(iam != -1){
			$(".sens1").draggable({ 
				containment: '#plateau',
				revert: 'invalid'
			 });
		 }
		 if(iam != 1){
			 $(".sens2").draggable({ 
				containment: '#plateau',
				revert: 'invalid'
			 });
		 }
		$( ".case" ).droppable({
			activate: function( event, ui ) {
				$(this).addClass('case_ok');
			},
			deactivate: function( event, ui ) {
				$( ".case" ).removeClass('case_ok');
			},
			accept: function(el) {
				xb = el.attr('X');
				yb = el.attr('Y');
				n_bj = Number(xb) + (Number(yb)-1)*9;
				xc = $(this).attr('X');
				yc = $(this).attr('Y');
				pas_bj = xc - xb;
				//$("#footer").html('XB='+xb+',YB='+yb+',XC='+xc+',YC='+yc);
				s = el.attr('sens');
				return (yc==Number(yb)+Number(s) 
				&& (xc == xb || xc == Number(xb)+1 || xc == Number(xb)-1)
				&& !$(this).hasClass('occupe')
				&& joueur_actif == s
				&& el.hasClass('b_active')
				);
			},
			drop: function( event, ui ) {   // Action effectuée lorsqu'on dépose un élément
				// on enregistre la position
				pos = pos2tab(2);
				// ui.draggable désigne l'élément déplacé
				ui.draggable.appendTo( $(this) ) // On place le personnage dans la voiture (au niveau du DOM)
					.css({   // Positionnement CSS 
						left: '0px',
						top:  '0px'
					})
				ui.draggable.attr('X',xc);
				ui.draggable.attr('Y',yc);
				// enregistrement du coup :
				v = joueur_actif+','+n_bj+','+pas_bj+','+coup_schany;
				$.ajax({
				  url: "enregistrer_coup.php?c="+v+"&pos="+pos+"&partie="+p_encours,
				  async: false,
				  success: function(data) {
				  }
				});
				boule_pose();
			}
		});
		//chercher_cases_occupees();
		//verifier_position();
		if(iam != 0){
			if(i_a != 1){
				setInterval(chercher_coup, 500);
			}else{
				chercher_coup();
			}
		}else{// on recherche le dernier coup :
			chercher_coup();
		}
		verif_points();
	}
	$('#notifs').click(function(event){
		$.ajax({
		  url: 'chercher_notifs.php?det=1',
		  async: false,
		  success: function(data) {
			$('#notifications').html(data);
			reinitialiser_chat();
		  }
		});
		$("#notifications").toggle(400);
	});
	$('#notifications').mouseleave(function(event){
		$("#notifications").hide(400);
	});
	
	chercher_notifs(); 
	setInterval(chercher_notifs,1000);
});

function chercher_notifs(){
	$.ajax({
	  url: 'chercher_notifs.php',
	  async: false,
	  success: function(data) {
		$('#notifs').html(data);
	  }
	});
}
function chercher_cases_occupees(){
	$(".case").removeClass('occupe');
	$( ".boule" ).each(function( index ) {
	  X = $(this).attr('X');
	  Y = $(this).attr('Y');
	  $("#case_"+X+Y).addClass('occupe');
	});
}

function verifier_position(){
	afficher("verif pos",1);
	s1 = 0;
	s2 = 0;
	var BarresPoints = new Array(0,0,0,0,0,0,0,0,0,0);
	var poids_g = new Array(0,-4,-3,-2,-1,0,1,2,3,4);
	var poids_d = new Array(0,4,3,2,1,0,-1,-2,-3,-4);
	for(var j=1;j<9;j++){
		pd = 0;
		for(var i=1;i<10;i++){			
			if($("#case_"+i+j).hasClass('occupe')){
				if(j%2 == 0){// Si pair, penche à gauche
					pd = pd + poids_g[i];
				}else{
					pd = pd + poids_d[i];
				}
			}
		}
		BarresPoints[j] = pd;
		if(pd < 0){
			basculer(j);
		}
		if(pd == 0){
			tremblotter(j);
		}
	}
	cds = false;
	if(s1>0 && s2==0 && coup_schany != -1 && joueur_actif==1){
		cds = true;
		setTimeout(function() {coup_de_schany(-1,s1);},2000);
	}
	if(s2>0 && s1==0 && coup_schany != 1 && joueur_actif==-1){
		cds = true;
		setTimeout(function() {coup_de_schany(1,s2);},2000);
	}
	pos2tab();
	if(!cds){
		verif_points();
	}
}
function tab2points(tab){
	var pts = new Array(0,0);
	for(i=1;i<73;i++){
		if(tab[i]==-1){
			pts[0]++;
			if((i > 0 && i < 4) || (i > 6 && i < 10)){
				ps = i-5;
				ps = Math.abs(ps);
				pts[0] = pts[0] + ps -1;
			}
		}
		if(tab[i]==1){
			pts[1]++;
			if((i > 63 && i < 67) || (i > 69 && i < 73)){
				ps = i-68;
				ps = Math.abs(ps);
				pts[1] = pts[1] + ps -1;
			}
		}
	}	
	return pts;
}
function verif_points(){
	pt1 = 0;
	pt2 = 0;
	$( ".boule" ).each(function( index ) {
		Y = Number($(this).attr('Y'));
		X = Number($(this).attr('X'));
		S = Number($(this).attr('sens'));
		if(S == 1 && X > 0){
			pt1++;
			if(Y==8){
				if(X > 6 || X < 4){
					ps = 5-X;
					ps = Math.abs(ps);
					pt1 = pt1 + ps-1;
				}
			}
		}
		if(S == -1 && X > 0){
			pt2++;
			if(Y==1){
				if(X > 6 || X < 4){
					ps = 5-X;
					ps = Math.abs(ps);
					pt2 = pt2 + ps-1;
				}
			}
		}
	});
	$("#pt1").html(pt1);
	$("#pt2").html(pt2);
	// NB COUPS POSSIBLES
	var pos_act = pos2tab();
	var tab_dep = lister_deplacements_poss(pos_act);
	var n = tab_dep.length;
	// AFFICHAGE JOUEUR
	if(n == 0){
		partie_finie();
	}else{
		//afficher("Nombre de coups restants : "+n,0);
		p_d = '';
		for(var i=1;i<73;i++){
			p_d = p_d + pos_act[i];
		}
		//afficher('Pos depart '+p_d,1);
		diff = false;
		for(var i=0;i < n ;i++){
			if(!diff){
				//afficher(tab_dep[i],1);
				pt_2 = tableau_suivant(pos_act,tab_dep[i].split(','));
				p_a = '';
				for(var j=1;j<73;j++){
					p_a = p_a + pt_2[j];
				}
				if(p_a != p_d){
					diff = true;
				}
				//afficher(p_a,1);
			}
		}
		if(diff==false){
			//afficher("PAS DE DIFFERENCES",1);
			// la même chose pour le coup de l'adversaire (on prend le premier)
			//pos_act[0] = -pos_act[0];
			tab_dep = lister_deplacements_poss(pt_2[0]);
			var n = tab_dep.length;
			if(n == 0){
				partie_finie();
			}else{
				//afficher("ADV : Nombre de coups restants : "+n,0);
				//afficher('ADV Pos depart '+p_d,1);
				for(var i=0;i < n ;i++){
					if(!diff){
						//afficher(tab_dep[i],1);
						pt_2 = tableau_suivant(pos_act,tab_dep[i].split(','));
						p_a = '';
						for(var j=1;j<73;j++){
							p_a = p_a + pt_2[j];
						}
						if(p_a != p_d){
							diff = true;
						}
						//afficher(p_a,1);
					}
				}
			}
			if(diff==false){
				partie_finie();
			}
		}
		if(coup_schany==1){
			$("#cptsch1").hide();
			$("#cptsch2").show();
		}
		if(coup_schany==-1){
			$("#cptsch2").hide();
			$("#cptsch1").show();
		}
		if(joueur_actif==1){
			if(iam==1){jj='<span class="vous">vous</span>';}else{jj=joueur1;}
			if(!$("#aquiletour").hasClass('terminee')){
				$("#aquiletour").html("C'est &agrave; "+jj+" de jouer <img src='images/elt/boule_bleuepm.png' width='32' align='absmiddle'>");
			}
			if(i_a==1 && iam==-1){
				proposer_coup(iam);
			}
		}else{
			if(iam==-1){jj='<span class="vous">vous</span>';}else{jj=joueur2;}
			if(!$("#aquiletour").hasClass('terminee')){
				$("#aquiletour").html("C'est &agrave; "+jj+" de jouer <img src='images/elt/boule_rougepm.png' width='32' align='absmiddle'>");
			}
			if(i_a==1 && iam==1){
				proposer_coup(iam);
			}
		}
	}
}

function partie_finie(){
	$("#aquiletour").html("La partie est termin&eacute;e");
	$("#aquiletour").addClass('terminee');
	$("#ligne_cds").hide();
	$.ajax({
		  url: "terminer_partie.php?partie="+p_encours+"&pt1="+pt1+"&pt2="+pt2,
		  async: false,
		  success: function(data) {
		  }
	});
}

function coup_de_schany(qui,combien){
	chercher_cases_occupees();
	coup_schany = qui;
	//afficher("Coup de schany : "+combien+" boules.",1);
	if(pasdeson==0){
		ion.sound.play("bell_ring", {
			volume: 0.6
		});
	}
	if(qui==1){
		$("#cptsch1").hide();
		$("#cptsch2").show();
	}else{
		$("#cptsch2").hide();
		$("#cptsch1").show();
	}
	for(i=0;i<combien;i++){
		trouv = 0;
		$( ".boule" ).each(function( index ) {
		      Y = $(this).attr('Y');
			  X = $(this).attr('X');
			  S = $(this).attr('sens');
			  
			  if(trouv == 0 && Y==0 && X == 0 && S == qui){
				trouv = 1;
					
				trouv2 = 0;
				for(j=1;j<10;j++){
					if(qui==1){ // première barre, penche à droite
						ind = j;
						ligne = 1;
					}else{
						ligne = 8;
						ind = 10 - j;
					}
					case_s = "#case_"+ind+ligne;
					//alert(X+Y);
					if(trouv2 == 0 && !$(case_s).hasClass('occupe')){
						//alert("case_1"+j);
						trouv2 = 1;
						$(this).attr('X',ind);
						$(this).attr('Y',ligne);
						$(this).appendTo(case_s);
						$(case_s).addClass('occupe');
						$(this).draggable( "enable" );
						$(this).attr('width',larg_boule);
						$(this).attr('height',larg_boule);
					}
				}
			  }
		});
	}
	verif_points();
}


function afficher(t,cons){
	p = ''
	if(cons==1){
		p = $("#msg_debug").html()+'<br>';
	}
	$("#msg_debug").html(p+t);
}
function tremblotter(j){
	if(j%2 == 0){
		//$("#barre"+j).css('background-image','url(images/elt/barre1_p1.png)').delay(500).css('background-image','url(images/elt/barre2.png)').delay(500);
	}else{
		//$("#barre"+j).css('background-image','url(images/elt/barre2_p2.png)');
	}
}
function basculer(j){
	if(pasdeson==0){
		ion.sound.play("metal_plate_2", {
			volume: 0.6
		});
	}
	$( ".boule" ).each(function( index ) {
	  Y = $(this).attr('Y');
	  X = $(this).attr('X');
	  S = $(this).attr('sens');
	  if(Y==j){
		if(S==-1){s1++;}
		if(S==1){s2++;}
		if(j%2 == 0){
			d = X*80+10;
			$("#barre"+j).css('background-image','url(images/elt/barre1_p2.png)');
		}else{
			d = -((10-X)*80+10);
			$("#barre"+j).css('background-image','url(images/elt/barre2_p2.png)');
		}
		$(this).attr('Y',0);
		$(this).attr('X',0);
		//$(this).appendTo("#conteneur");
		$(this).animate({
			opacity: 0.90,
			left: "-="+d,
		  }, 1000, function() {
			// Animation complete.
			//$(this).appendTo("#plateau");
			// CACHER
			//$(this).hide('300');
			// REDUIRE
			$(this).attr('width',30);
			$(this).attr('height',30);
			// ALLER EN BAS
			$(this).appendTo("#boules_perdues");
			$(this).css('left',0);
			$(this).css('rigth',0);
			$(this).removeClass('sens1');
			$(this).removeClass('sens2');
			$(this).draggable( "disable" );
			// ALLER SUR UNE CASE :
			/* $(this).appendTo("#case_33");
			$(this).css('left',0);
			$(this).css('rigth',0); */
			// remetre la barre
			if(j%2 == 0){
				$("#barre"+j).css('background-image','url(images/elt/barre2.png)');
			}else{
				$("#barre"+j).css('background-image','url(images/elt/barre1.png)');
			}
		  });
	  }
	});
	chercher_cases_occupees();
}

function pos2tab(tab_ou_texte){
	tab = new Array();
	for(i=0;i<73;i++){
		tab[i]=0;
	}
	tab[0] = joueur_actif;
	$( ".boule" ).each(function( index ) {
	  Y = Number($(this).attr('Y'));
	  X = Number($(this).attr('X'));
	  S = Number($(this).attr('sens'));
	  if(Y!=0 && X!=0){
		i = X+(Y-1)*9;
		tab[i] = S;
	  }
	});
	tab.push(coup_schany);
	if(tab_ou_texte==2){
		txt = tab.join(';');
		//txt = '<a href="?pos='+txt+'">pos</a><br>';
		return txt;
	}else{
		return tab;
	}
}

function tab2pos(tab,jc){
	joueur_actif = tab[0];
	//alert(tab[73]);
	coup_schany = tab[73];
	// on commence par mettre les boules de coté
	$( ".boule" ).each(function( index ) {
		$(this).attr('Y',0);
		$(this).attr('X',0);
		$(this).attr('width',30);
		$(this).attr('height',30);
		$(this).appendTo("#boules_perdues");
		$(this).css('left',0);
		$(this).css('rigth',0);
		$(this).removeClass('sens1');
		$(this).removeClass('sens2');
		$(this).draggable( "disable" );
	});
	// on les met sur le plateau
	c1 = 1;
	c2 = 1;
	for(i=1;i<73;i++){
		//afficher('('+i+')'+tab[i],1);
		if(tab[i]!=0){
			if(tab[i]==1){
				elt = $("#boule1_"+c1);
				c1++;
			}else{
				elt = $("#boule2_"+c2);
				c2++;
			}
			Y = Math.ceil(i / 9);
			X = i - (Y-1)*9;
			elt.attr('Y',Y);
			elt.attr('X',X);
			elt.draggable( "enable" );
			elt.appendTo("#case_"+X+Y);
			elt.attr('width',larg_boule);
			elt.attr('height',larg_boule);
		}
	}
	if(jc != ''){
		t = jc.split(',');
		window.setTimeout(avancer_boule(t[0],t[1]), 2000);
	}
}

function boule_pose(){
	if(pasdeson==0){
		ion.sound.play("pop_cork", {
			volume: 0.6
		});
	}
	$(".case").removeClass('case_ok');
	joueur_actif = - joueur_actif;
	if(joueur_actif == 1){
		$(".sens1").draggable( "enable" );
		$(".sens2").draggable( "disable" );
	}else{
		$(".sens2").draggable( "enable" );
		$(".sens1").draggable( "disable" );
	}
	chercher_cases_occupees();
	verifier_position();
}

function avancer_boule(n,pas){
	//yabouge = false;
	$( ".boule" ).each(function( index ) {
	  Y = Number($(this).attr('Y'));
	  X = Number($(this).attr('X'));
	  S = Number($(this).attr('sens'));
	  if(Y!=0 && X!=0){
		//alert(larg_c);
		if((X+(Y-1)*9) == n){
			Y2 = Y + S;
			X2 = X + Number(pas);
			dt = S * larg_b;
			dl = pas * larg_c;
			$(this).animate({
				top: "+="+dt,
				left: "+="+dl,
			  }, 1000, function() {
					$(this).attr('X',X2);
					$(this).attr('Y',Y2);
					$(this).appendTo( "#case_"+X2+Y2 ).css({   // Positionnement CSS 
						left: '0px',
						top:  '0px'
					});
					boule_pose();
			  });
		};
	  }
	});
}
function avancer_boule_simulation(n,pas){
	//yabouge = false;
	$( ".boule" ).each(function( index ) {
	  Y = Number($(this).attr('Y'));
	  X = Number($(this).attr('X'));
	  S = Number($(this).attr('sens'));
	  if(Y!=0 && X!=0){
		if((X+(Y-1)*9) == n){
			Y2 = Y + S;
			X2 = X + Number(pas);
			dt = S * larg_b;
			dl = pas * larg_c;
			$(this).animate({
			top: "+="+dt,
			left: "+="+dl,
		  }, 1000, function() {
				$(this).animate({
					top: "-="+dt,
					left: "-="+dl,
				  }, 1000, function() {
			  });
		  });
		};
	  }
	});
}

function chercher_coup(){
	$.ajax({
	  url: "chercher_coup.php?partie="+p_encours,
	  async: false,
	  success: function(data) {
		var t = data.split(',');
		if(dernier_coup != t[5]){
			dernier_coup = t[5]
			if(redessiner==1){
				//afficher(data);
				if(t[0] != 0){
					c = t[1]+','+t[2]; //"-1,15,-1"
					//coup_schany = t[3];
					pos = t[4];
					//alert(pos);
					tb = pos.split(";");
					tab2pos(tb,c);
				}else{
					chercher_cases_occupees();
					verifier_position();
				}
				redessiner = 0;
			}else{
				if(t[0] != iam && t[0] != 0){
					avancer_boule(t[1],t[2]);
				}else{
					chercher_cases_occupees();
					verifier_position();
				}
			}
		}
	  }
	});
}
///////////////////////////////////////
// I A
// Tableau des déplacements possibles à partir d'une position
function lister_deplacements_poss(pos){
	qui = pos[0];
	poss = new Array();
	for(i=1;i<73;i++){
		if(pos[i]==qui){
			fc = i + 9*qui; // position en face
			f1 = fc - 1;
			f2 = fc + 1;
			qi = - qui;
			if(fc < 73 && fc > 0){
				if(pos[fc]==0){
					poss.push(i+',0');
				}
				if(i%9==0){
					if(pos[f1]==0){
						poss.push(i+',-1');
					}
				}else{
					if((i-1)%9==0){
						if(pos[f2]==0){
							poss.push(i+',1');
						}
					}else{
						if(pos[f1]==0){
							poss.push(i+',-1');
						}
						if(pos[f2]==0){
							poss.push(i+',1');
						}
					}
				}
			}
		}
	}
	return poss;
}
//////////////////////////////////////////////////
// nouvelle position obtenue à partir d'un tableau
// et d'un déplacement 
function tableau_suivant(tab,depl){
	//afficher(depl,1);
	// copie des tableau
	var tab_i = new Array;
	for (var i = 0; i < tab.length; i++){
     tab_i[i] = tab[i];
    }
	var depl_i = new Array;
	for (var i = 0; i < depl.length; i++){
     depl_i[i] = depl[i];
    }
	// level
	if(tab_i.length==74){
		tab_i[74]=1;
	}
	i1 = Number(depl_i[0]);
	// on repère le type de boule
	t = Number(tab_i[i1]);
	// on elève la boule
	tab_i[i1] = 0;
	// on la remet plus loin
	i2 = i1 + 9*t + Number(depl_i[1]);
	tab_i[i2] = t;
	// basculage, coup de schany ...
	// tab_i[73] = le dernier QUI A FAIT le cdschany
	// Basculage
	y1 = 0;
	y2 = 0;
	for(j=0;j<8;j++){
		if(j%2==0){s=1;}else{s=-1;}
		p = 0;
		for(i=1;i<5;i++){
			ind = i + j*9;
			if(tab_i[ind]!=0){
				p = p + (5-i)*s;
			}
		}
		for(i=6;i<10;i++){
			ind = i + j*9;
			if(tab_i[ind]!=0){
				p = p + (i-5) * -s;
			}
		}
		if(p < 0){
			//afficher('bascule : '+j,1);
			for(i=1;i<10;i++){
				ind = i + j*9;
				if(tab_i[ind]==1){y1++;}
				if(tab_i[ind]==-1){y2++;}
				tab_i[ind]=0;
			}
		}
	}
	// coup de schany
	//afficher("cpt schany : "+tab_i[73],1);
	if(y1 > 0 && tab_i[73]!=1 && y2==0 && tab_i[0]==1){
		// coup de schany 1 (en haut)
		cpt = 0;
		for(i=1;i<10;i++){
			if(tab_i[i]==0 && cpt < y1){
				tab_i[i]=1;
				cpt++;
			}
		}
		// on inverse le CS
		tab_i[73] = 1;
	}
	if(y2>0 && tab_i[73]!=-1 && y1==0 && tab_i[0]==-1){
		// coup de schany 2 (en bas)
		cpt = 0;
		for(i=72;i>63;i--){
			if(tab_i[i]==0 && cpt < y2){
				tab_i[i]=-1;
				cpt++;
			}
		}
		// on inverse le CS
		tab_i[73] = -1;
	}
	// on inverse le joueur actif
	tab_i[0] = - tab_i[0];
	// on augmente le level
	tab_i[74] = tab_i[74]+1;
	return tab_i;
}

function evaluer_pos(pos,pourqui){
	pts = new Array();
	pts[0] = 0;
	for(var ii=1;ii<73;ii++){
		if(pos[ii]==pourqui){
			pts[0]++;
		}
		if(pos[ii]==-pourqui){
			pts[0]--;
		}
	}
	pts[1] = pos[73];
	if(pts[1]==pourqui){
		pts[0]=pts[0]-0.5;
	}else{
		if(pts[1]==-pourqui){
			pts[0]=pts[0]+0.5;
		}
	}
	return pts;
}