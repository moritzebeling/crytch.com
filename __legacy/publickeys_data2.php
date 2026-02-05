<?php
if(!isset($config)){
	require_once('_config.php');
}

$DATA = new mysqli(DBHOST,DBUSER,DBPASS,DBDATA);
if($DATA->connect_error){ throwError('DB connect_error'); }
if(!$DATA->set_charset("utf8")){ throwError('no UTF-8'); }

$find = "SELECT * FROM Messages WHERE public_key IS NOT NULL ORDER BY created DESC"; 
$open = $DATA->query($find);

$all_messages = [];
$i = 0;
while($row = $open->fetch_assoc()) {
	$settings = json_decode( $row['settings'], true );
	$message = json_encode($row['message'],JSON_NUMERIC_CHECK);
	$message = trim($message,'"');
	// $message = str_replace("\"", "-", $message);
	// $message = htmlspecialchars($message);
	// $message = str_replace('"', "'", $message);

	$all_messages[$i] = [
		'url' => $row['message_url'],
		'grid_size' => $row['grid_size'],
		'grid_width' => $row['grid_width'],
		'grid_height' => $row['grid_height'],
		'public_key' => $row['public_key'],
		'settings' => $settings,
		'message' => "#####[".$message."]#####"
	];
	$i++;
}

$DATA->close();


$json = json_encode($all_messages,JSON_NUMERIC_CHECK);
$json = str_replace('"#####', '', $json);
$json = str_replace('#####"', '', $json);
$json = str_replace('\\\\\\', '', $json);
echo "var messages = ";
echo $json;
echo ";";
exit;