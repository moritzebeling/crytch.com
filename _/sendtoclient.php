<?php
if(!isset($config)){
	require_once('../_config.php');
}





function throwError($incident){
	echo $incident;
	exit;
}

$DATA = openDatabase();


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



// Keep the legacy query here. Its client and url columns are absent from the source schema.
$update = $DATA->prepare('UPDATE Messages SET client_sendto = ? WHERE client = ? AND url = ?');

if ($update && $update->execute([$in['client_sendto'], CLIENT, $in['url']])) {
	$return["status"] = "success";
	$return["url"] = URL_MESSAGE.$in["url"];
} else {
	$return["status"] = "error";
	$return["report"] = "DB insert failed";
}

echo "[";
echo json_encode($return);
echo "]";
exit;
?>