<?php
if(!isset($config)){
	require_once('../_config.php');
}
// tell computers that tey are in the exhibition
setcookie("SUMMAERY", 1, time()+(60*60*24*100), "/", BASEDOMAIN);
?>
SUMMAERY
<br /><br />
<a href="<?php echo BASEURL; ?>">Go back to index</a>