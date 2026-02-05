<?php
// make embedding external resources easier
function embedresource($res,$min=0){
	if($res == 'jquery' ){ echo "<script defer src=\"https://code.jquery.com/jquery-3.2.1.min.js\" integrity=\"sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=\" crossorigin=\"anonymous\"></script>"; }
	if($res == 'paperjs'){ echo "<script type=\"text/javascript\" src=\"".BASEURL."/_/paper-full.min.js\"></script>"; }
	if($res == 'roboto' ){ echo "<link href=\"https://fonts.googleapis.com/css?family=Roboto+Mono:400,700\" rel=\"stylesheet\" type=\"text/css\">"; }

	$debug = ''; $minify = '';
	if($min == 1){
		$minify = '.min';
	}
	if(DEBUG){
		$debug = '_debug';
		$minify = '';
	}
	if($res == 'crytch'){ echo "<script defer type=\"text/javascript\" src=\"".BASEURL."/v/".CRYTCH_VERSION."/crytch".$debug.$minify.".js?v=3\"></script>"; }
	if($res == 'decrypt'){ echo "<script defer type=\"text/javascript\" src=\"".BASEURL."/v/".CRYTCH_VERSION."/decrypt".$debug.$minify.".js?v=3\"></script>"; }
}



// val other client id
function valClientID($x){
	if($x == CLIENT){ return false; }
	if(strlen($x) == 32){
		$x = htmlspecialchars($x);
		return $x;
	}
	return false;
}
function valName($x){
	$x = trim($x);
	$x = htmlspecialchars($x);
	$x = ucwords($x);
	$x = substr($x,0,24);
	if($x == ''){ return false; }
	if($x == ' '){ return false; }
	if($x == '.'){ return false; }
	if($x == '-'){ return false; }
	if($x == '_'){ return false; }
	return $x;
}
function valBool($x){
	if( is_bool($x) ){ return $x; }
	if($x == 1){ return true; }
	if($x == 0){ return false; }
	if($x == 'true'){ return true; }
	if($x == 'false'){ return false; }
	return false;
}
function valColor($x){
	$x = trim($x);
	$x = str_replace(' ','',$x);
	$x = str_replace(' ','',$x);
	if($x == 'rgb(255,255,255)' || $x == 'rgb(255, 255, 255)'){ return '#ffffff'; }
	if($x == 'black' || $x == 'b'){ return '#000000'; }
	if($x == 'white' || $x == 'w'){ return '#ffffff'; }
	if($x == 'red'){ return '#ff0000'; }
	if($x == 'blue'){ return '#0000ff'; }
	if($x == 'green'){ return '#00ff00'; }
	if(substr_count($x, ',') == 2){
		$x = str_replace('rgba','',$x);
		$x = str_replace('rgb','',$x);
		$x = str_replace('(','',$x);
		$x = str_replace(')','',$x);
		$y = str_split(",",$x);
		return sprintf("#%02x%02x%02x", $y[0], $y[1], $y[2]);
	}
	if(strlen($x) == 6){ return '#'.$x; }
	if(strlen($x) == 3){
		$y = str_split('', $x);
		return '#'.$y[0].$y[0].$y[1].$y[1].$y[2].$y[2];
	}
	return $x;
}
function valInt($x,$length = 32){
	$x = preg_replace("/[^0-9]/","",$x);
	$x = substr($x,0,$length);
	return $x;
}
function valLang($x){
	global $languages_availible;
	$x = trim($x);
	$x = strtolower($x);
	if(in_array($x, $languages_availible)) {
		return $x;
	}
	return false;
}
function valPW($x){
	if($x == ''){ return false; }
	if(strlen($x) > 32){ return false; }
	if(ctype_alnum($x)){
		return $x;
	}
	return false;
}
function valStr($x,$length = 32){
	$x = trim($x);
	$x = stripslashes($x);
	$x = htmlspecialchars($x);
	$x = substr($x,0,$length);
	return $x;
}
function valText($x){
	$x = trim($x);
	$x = stripslashes($x);
	$x = htmlspecialchars($x);
	return $x;
}

function setLanguage(){
	global $languages_availible;
	$language = $languages_availible[0];

	// get language from cookie
	if(isset($_COOKIE['language'])){
		$lang_cookie = valLang($_COOKIE['language']);
		if($lang_cookie){
			define("LANGUAGE",$lang_cookie);
			return $lang_cookie;
		}
	}

	// get language from client
	$browser_lang = valLang( substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2) );
	if($browser_lang){
		$language = $browser_lang;
	}

	define("LANGUAGE",$language);
	return $language;
}


function L($key,$key2="",$key3="",$key4=""){
	global $lang_en;
	if(LANGUAGE == 'de'){ global $lang_de; $lang_set = $lang_de; }
	if(LANGUAGE == 'nl'){ global $lang_nl; $lang_set = $lang_nl; }
	if(LANGUAGE == 'fr'){ global $lang_nl; $lang_set = $lang_nl; }

	if($key4){
		if($lang_set[$key][$key2][$key3][$key4]){ echo $lang_set[$key][$key2][$key3][$key4];
		} else if($lang_en[$key][$key2][$key3][$key4]){ echo $lang_en[$key][$key2][$key3][$key4];
		} else { echo 'key not found'; }
	} else if($key3){
		if($lang_set[$key][$key2][$key3]){ echo $lang_set[$key][$key2][$key3];
		} else if($lang_en[$key][$key2][$key3]){ echo $lang_en[$key][$key2][$key3];
		} else { echo 'key not found'; }
	} else if($key2){
		if($lang_set[$key][$key2]){ echo $lang_set[$key][$key2];
		} else if($lang_en[$key][$key2]){ echo $lang_en[$key][$key2];
		} else { echo 'key not found'; }
	} else {
		if($lang_set[$key]){ echo $lang_set[$key];
		} else if($lang_en[$key]){ echo $lang_en[$key];
		} else { echo 'key not found'; }
	}
}




function createUniqueID(){
	$prefix = rand(1,100000);
	$return = uniqid().$prefix;
	return md5($return);
}

function client(){
	if(isset($_COOKIE['CLIENT'])){
		define("CLIENT",$_COOKIE['CLIENT']);
	} else {
		define("CLIENT",createUniqueID());
	}
	setcookie("CLIENT", CLIENT, time()+(60*60*24*365), "/", BASEDOMAIN);
	return CLIENT;
}

function listen(){
	$listen = false; $clientother = false; $clientothername = false;

	if(isset($_POST['clientother'])){
		$in['clientother'] = valClientID($_POST['clientother']);
		if($in['clientother']){
			$clientother = $in['clientother'];
		}
	} else if(isset($_COOKIE['CLIENTOTHER'])){
		$clientother = $_COOKIE['CLIENTOTHER'];
	}
	if(isset($_POST['clientothername'])){
		$in['clientothername'] = valName($_POST['clientothername']);
		if($in['clientothername']){
			$clientothername = $in['clientothername'];
		}
	} else if(isset($_COOKIE['CLIENTOTHERNAME'])){
		$clientothername = $_COOKIE['CLIENTOTHERNAME'];
	}

	define("CLIENTOTHER",$clientother);
	setcookie("CLIENTOTHER", CLIENTOTHER, time()+(60*60*24*365), "/", BASEDOMAIN);

	define("CLIENTOTHERNAME",$clientothername);
	setcookie("CLIENTOTHERNAME", CLIENTOTHERNAME, time()+(60*60*24*365), "/", BASEDOMAIN);

	if($clientother && $clientothername){
		define("LISTEN",1);
	} else {
		define("LISTEN",0);
	}
	return true;
}



function defaultTool(){
	// decide with which tool to start
	if(isset($_COOKIE['toollastused'])){
		if($_COOKIE['toollastused'] == 'text'){
			return 'text';
		} else {
			return 'pen';
		}
	}
	return 'pen';
}










?>
