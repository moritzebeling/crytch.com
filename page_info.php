<?php

if(!isset($config)){
	require_once('_config.php');
}

$DATA = new mysqli(DBHOST,DBUSER,DBPASS,DBDATA);

/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

if ($result = $DATA->query("SELECT * FROM Messages")) {

    /* determine number of rows result set */
    $countMessages = $result->num_rows;

    /* close result set */
    $result->close();
}

/* close connection */
$DATA->close();


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
