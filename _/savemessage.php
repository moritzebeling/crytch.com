<?php
if(!isset($config)){
	require_once('../_config.php');
}

$DATA = new mysqli(DBHOST,DBUSER,DBPASS,DBDATA);
if($DATA->connect_error){ throwError('DB connect_error'); }
if(!$DATA->set_charset("utf8")){ throwError('no UTF-8'); }

$return["report"] = '';




$in = array(
	'version' => CRYTCH_VERSION,
	'client_id' => CLIENT,
	'message_url' => createUniqueID(),
	'grid_size' => '',
	'grid_width' => '',
	'grid_height' => '',
	'window_width' => '',
	'window_height' => '',
	'message' => '',
	'style_color' => '#000000',
	'style_background' => '#ffffff',
	'style_stroke' => 3,
	'language' => LANGUAGE,
	'public_key' => false,
	'settings' => false
);

if(isset($_POST['grid_size'])){
	$in['grid_size'] = valInt($_POST['grid_size'],4);
}
if(isset($_POST['grid_width'])){
	$in['grid_width'] = valInt($_POST['grid_width'],4);
}
if(isset($_POST['grid_height'])){
	$in['grid_height'] = valInt($_POST['grid_height'],4);
}
if(isset($_POST['window_width'])){
	$in['window_width'] = valInt($_POST['window_width'],6);
}
if(isset($_POST['window_height'])){
	$in['window_height'] = valInt($_POST['window_height'],6);
}
if(isset($_POST['message'])){
	$in['message'] = valText($_POST['message']);
} else {
	$return["report"] .= "no message in canvas. ";
}
if(isset($_POST['style_color'])){
	$in['style_color'] = valColor($_POST['style_color']);
}
if(isset($_POST['style_background'])){
	$in['style_background'] = valColor($_POST['style_background']);
}
if(isset($_POST['style_stroke'])){
	$in['style_stroke'] = valInt($_POST['style_stroke'],3);
}
if(isset($_POST['language'])){
	$in['language'] = valLang(valStr($_POST['language'],2));
}
if(isset($_POST['public_key'])){
	$in['public_key'] = valPW($_POST['public_key']);
}




// settings
$save_bounds = true;
if(isset($_POST['bounds'])){
	$bounds = array();
	$bounds['x'] = valInt($_POST['bounds']['x'],4);
	$bounds['y'] = valInt($_POST['bounds']['y'],4);
	$bounds['w'] = valInt($_POST['bounds']['w'],4);
	$bounds['h'] = valInt($_POST['bounds']['h'],4);
	$in['settings'] = $bounds;
}
if($in['settings']){
	$in['settings'] = json_encode($in['settings'],JSON_NUMERIC_CHECK);
}




$insert = "INSERT INTO Messages (";
foreach ($in as $key => $value) {
	if($value){
		$insert .= " ".$key.",";
	}
}
$insert = trim($insert,',');
$insert .= " ) VALUES (";
foreach ($in as $key => $value) {
	if($value){
		$insert .= " '".$value."',";
	}
}
$insert = trim($insert,',');
$insert .= " )";



if ($DATA->query($insert) === true) {
	$return["status"] = "success";
	$return["url"] = URL_MESSAGE.$in["message_url"];
	$return['color'] = $in['style_background'];
} else {
	$return["status"] = "error";
	// $return["report"] .= $DATA->error;
}
$DATA->close();

echo "[";
echo json_encode($return,JSON_NUMERIC_CHECK);
echo "]";
exit;
?>
