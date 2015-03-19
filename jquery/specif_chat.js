var timer_aff;

$(document).ready(function(){
	$('#bt_chat').click(function(event){
		var idu2 = $(this).attr('idu2');
		var txt = $('#dial_chat').val();
		txt = txt.replace(/\r\n|\r|\n/g,"<br>");
		$.ajax({
		  url: "enregistrer_chat.php?texte="+txt+'&idu2='+idu2,
		  async: false,
		  success: function(data) {
			$('#dial_chat').val('');
			affficher_chat(idu2);
		  }
		});
	});
	reinitialiser_chat();
});

function affficher_chat(idu2,dl){
	if(dl != undefined){
		var txt_url = "chercher_chat.php?idu2="+idu2+"&dl="+dl;
	}else{
		var txt_url = "chercher_chat.php?idu2="+idu2;
	}
	$.ajax({
		  url: txt_url,
		  async: false,
		  success: function(data) {
			$('#bulles').html(data);
			reinitialiser_chat();
		  }
		});
}

function reinitialiser_chat(){
	$( "#fermer_chat").unbind( "click" );
	$('#fermer_chat').click(function(event){
		$("#chat").hide(400);
		clearInterval(timer_aff);
	});
	$( ".chat_prec_suiv").unbind( "click" );
	$('.chat_prec_suiv').click(function(event){
		clearInterval(timer_aff);
		var idu2 = $('#bt_chat').attr('idu2');
		var dl = $(this).attr('dl');
		affficher_chat(idu2,dl);
		timer_aff=setInterval(function(){ affficher_chat(idu2,dl); }, 3000);
	});
	$( ".app_chat").unbind( "click" );
	$('.app_chat').click(function(event){
		var idu2 = $(this).attr('idu2');
		$("#chat").show(400);
		$('#bt_chat').attr('idu2',idu2);
		//tf = "affficher_chat("+idu2+")";
		affficher_chat(idu2);
		clearInterval(timer_aff);
		timer_aff = setInterval(
		function(){ 
			affficher_chat(idu2); 
		}, 3000);
	});
	$("#dial_chat").unbind( "keypress" );
	$("#dial_chat").keypress(trait_chat);
}

function trait_chat(evenement){
	shifted = evenement.shiftKey;
	var w2 = evenement.which + shifted;
    if(evenement.which == 13 && w2 == 13){
			$('#bt_chat').click();
			evenement.preventDefault();
	}
}
