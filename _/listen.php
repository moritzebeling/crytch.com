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


if(LISTEN != 1){ throwError('LISTEN not activated'); }
if(!CLIENT){ throwError('CLIENT undefined'); }
if(!CLIENTOTHER){ throwError('CLIENTOTHER undefined'); }
if(!CLIENTOTHERNAME){ throwError('CLIENTOTHERNAME undefined'); }



$find = "SELECT url FROM Messages WHERE client = '".CLIENTOTHER."' AND client_sendto = '".CLIENT."' AND readbyreciever = 0 AND recievernotified = 0 ";

$open = $DATA->query($find);

if ($open->num_rows > 0) {
	$i = 0;
    while($row = $open->fetch_assoc()){
    	$return[$i] = URL_MESSAGE.$row["url"];
    	$i++;
    }
    $return['num'] = $i;

    $DATA->query("UPDATE Messages SET recievernotified = recievernotified + 1 WHERE url = '".$return[$return['num']-1]."' ");
    $return["status"] = "success";
} else {
	$return["status"] = "alone";
    exit;
}
$DATA->close();






echo "[";
echo json_encode($return);
echo "]";
exit;
?>