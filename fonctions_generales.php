<?php
function envoie_mail_jc($message,$sujet='Evenement sur www.jeanchris.com'){
	$to  = 'jean.chris34@gmail.com';
	$Headers = "From: SCHANY <jean.chris34@gmail.com>\n";
	$Headers .= "MIME-Version: 1.0\n";
	$Headers .= "Content-Type:text/html;charset=iso-8859-1\n";
	return mail($to,$sujet,$message,$Headers); 
}
?>