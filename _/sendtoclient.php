<?php
if(!isset($config)){
	require_once('../_config.php');
}





function throwError($incident){
	echo $incident;
	exit;
}

$DATA = new mysqli(DBHOST,DBUSER,DBPASS,DBDATA);
if($DATA->connect_error){ throwError('DB connect_error'); }
if(!$DATA->set_charset("utf8")){ throwError('no UTF-8'); }


$in = array(
	'client' => CLIENT,
	'client_sendto' => CLIENTOTHER,
	'url' => ""
);

if(isset($_POST['messageurl'])){
	$in['url'] = $_POST['messageurl'];
	$in['url'] = str_replace(URL_MESSAGE, "", $in['url']);
	$in['url'] = htmlspecialchars($in['url']);
	if(!$in['url']){ throwError('no url'); }
} else {
	// throwError('no url');
}



$update = "UPDATE Messages SET client_sendto = '".$in['client_sendto']."' WHERE client = '".CLIENT."' AND url = '".$in['url']."' ";


if ($DATA->query($update) === true) {
	$return["status"] = "success";
	$return["url"] = URL_MESSAGE.$in["url"];
} else {
	$return["status"] = "error";
	$return["report"] = "DB insert failed";
}
$DATA->close();

echo "[";
echo json_encode($return);
echo "]";
exit;
?>