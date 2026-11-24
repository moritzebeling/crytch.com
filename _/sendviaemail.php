<?php
if(!isset($config)){
	require_once('../_config.php');
}
if(SUMMAERY != 1){
	echo 'no summaery auth';
	exit;
}

function throwError($incident){
	echo $incident;
	exit;
}





$DATA = openDatabase();


$in = array(
	'client' => CLIENT,
	'url' => "",
	'email' => ""
);

if(isset($_POST['messageurl'])){
	$in['msgurl'] = $_POST['messageurl'];
	if(!$in['msgurl']){ throwError('no url'); }
} else {
	throwError('no url');
}
if(isset($_POST['sendtoemail'])){
	$in['email'] = $_POST['sendtoemail'];
	if(!$in['email']){ throwError('no email'); }
} else {
	throwError('no email');
}



$insert = $DATA->prepare('INSERT INTO SentViaMail (client, msgurl, email) VALUES (?, ?, ?)');

if ($insert && $insert->execute([$in['client'], $in['msgurl'], $in['email']])) {
	$return["status"] = "success";
	$return["url"] = $in["msgurl"];
} else {
	$return["status"] = "error";
	$return["report"] = "DB insert failed";
}




$mailmessage = "Hey there,\n".
	"You've got a secret message via ".BASEDOMAIN."\n".
	"The sender will probably get in touch with you and give you the password.\n\n".
	"You find the message at:\n".
	$return["url"]."\n\n\n".
	"Crytch is a online tool for creating, encrypting and decrypting digital messages.";
$headers = "From: alice@crytch.com" ;

mail($in["email"],'New secret message on crytch.com', $mailmessage, $headers);





echo "[";
echo json_encode($return);
echo "]";
exit;
?>