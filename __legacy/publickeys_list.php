<?php
if(!isset($config)){
	require_once('_config.php');
}

$DATA = new mysqli(DBHOST,DBUSER,DBPASS,DBDATA);
if($DATA->connect_error){ throwError('DB connect_error'); }
if(!$DATA->set_charset("utf8")){ throwError('no UTF-8'); }

$find = "SELECT created, public_key, message_url FROM Messages WHERE public_key IS NOT NULL ORDER BY created DESC"; 
$open = $DATA->query($find);

include 'ui/header.php';
?>
	<base href="https://crytch.com/blogposts/img/">
</head>
<body class="page blog">
<div id="settings"></div>

<div class="wrapper">
	<header>
		<div class="text center">
			<h1><a href="<?php echo BASEURL; ?>">Public Keys</a></h1>
			<h2>Entries</h2>
		</div>
	</header>
	<section class="list">
		<table>
<?php
		
while($row = $open->fetch_assoc()) {
	echo "<tr>";

		echo "<td>";
			echo $row['created'];
		echo "</td>";
		echo "<td>";
			echo "<a target=\"_blank\" href=\"".URL_MESSAGE.$row['message_url']."\">";
				echo $row['message_url'];
			echo "</a>";
		echo "</td>";
		echo "<td>";
			echo $row['public_key'];
		echo "</td>";
	
	echo "</tr>";
}



?>
		</table>
	</section>
</div>





<?php
include 'ui/popups.php';
?>


<?php
if(!isset($tracking)){ $tracking = true; }
include 'ui/footer.php';
?>