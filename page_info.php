<?php

if(!isset($config)){
	require_once('_config.php');
}

$DATA = openDatabase();
$result = $DATA->query("SELECT COUNT(*) FROM Messages");
if ($result) {
    $countMessages = $result->fetchColumn();
}

include 'ui/header.php';
?>

</head>
<body class="page blog">

<div class="wrapper">
	<header>
		<div class="text center">
			<h1><a href="<?php echo BASEURL; ?>"><?php echo PAGETITLE; ?></a></h1>
			<h2>Info</h2>

			<p><?php echo $countMessages; ?> Messages sent</p>
		</div>
	</header>

</div>

<?php
include 'ui/popups.php';

if(!isset($tracking)){ $tracking = true; }
include 'ui/footer.php';
