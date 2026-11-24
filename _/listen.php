<?php
if(!isset($config)){
	require_once('../_config.php');
}





function throwError($incident){
	echo $incident;
	exit;
}

$DATA = openDatabase();


if(LISTEN != 1){ throwError('LISTEN not activated'); }
if(!CLIENT){ throwError('CLIENT undefined'); }
if(!CLIENTOTHER){ throwError('CLIENTOTHER undefined'); }
if(!CLIENTOTHERNAME){ throwError('CLIENTOTHERNAME undefined'); }



// Keep the legacy query here. Its client and url columns are absent from the source schema.
$open = $DATA->prepare('SELECT url FROM Messages WHERE client = ? AND client_sendto = ? AND readbyreciever = 0 AND recievernotified = 0');

if ($open && $open->execute([CLIENTOTHER, CLIENT]) && ($rows = $open->fetchAll())) {
    foreach($rows as $i => $row){
        $return[$i] = URL_MESSAGE.$row["url"];
    }
    $return["num"] = count($rows);

    $update = $DATA->prepare('UPDATE Messages SET recievernotified = recievernotified + 1 WHERE url = ?');
    if($update){
        $update->execute([$return[$return["num"]-1]]);
    }
    $return["status"] = "success";
} else {
	$return["status"] = "alone";
    exit;
}






echo "[";
echo json_encode($return);
echo "]";
exit;
?>