<?php
$config = true;
//config
error_reporting(E_ERROR | E_WARNING | E_PARSE);
date_default_timezone_set('Europe/Berlin');
setlocale(LC_TIME, "de_DE");
$oneyear = 60*60*24*365;
// set URL for main directory
define("BASEDOMAIN","crytch.com");
define("BASEURL","https://".BASEDOMAIN);

define("CRYTCH_VERSION",2);

define("PAGETITLE",'Crytch');
// set URL for recieving messages
define("URL_MESSAGE",BASEURL.'/m/');
define("URL_ABOUT",BASEURL.'/about');
define("URL_NEW",BASEURL.'/new');
define("URL_BLOG",BASEURL.'/blog');

// D A T A B A S E 
// VERSION: 5.6.19
define("DBHOST","localhost");
define("DBUSER","crytch");
define("DBPASS","Yp32@1bi");
define("DBDATA","crytch");

$defaults = array(
	'gridsize' => 10,
	'color' => '#000000',
	'background' => '#ffffff'
);


if(isset($_COOKIE['SUMMAERY'])){
	define("SUMMAERY",1);
} else {
	define("SUMMAERY",0);
}
if(isset($_COOKIE['DEBUG'])){
	define("DEBUG",1);
} else {
	define("DEBUG",0);
}

define("C4SECRETS",0);

$tracking = false;


// first is default
$languages_availible = ["en","de","nl"];

// import functions
require_once '_/functions.php';

client();
listen();

setLanguage();
foreach ($languages_availible as $lang) {
	include '_/languages_'.$lang.'.php';
}





define("DEFAULTTOOL",defaultTool() );




?>