<?php
if(!isset($config)){
	require_once('_config.php');
}


if(isset($_GET['messageid'])){
	$openmessage = $_GET['messageid'];
} else {
	header("Location: ".BASEURL);
	exit;
}


$DATA = new mysqli(DBHOST,DBUSER,DBPASS,DBDATA);
if($DATA->connect_error){ throwError('DB connect_error'); }
if(!$DATA->set_charset("utf8")){ throwError('no UTF-8'); }


$find = "SELECT * FROM Messages WHERE message_url = '".$openmessage."' "; 
$open = $DATA->query($find);

if ($open->num_rows == 1) {
    while($row = $open->fetch_assoc()) {
    	$found = array(
			'client_id' => $row["client"],
			'client_sendto' => $row["client_sendto"],
			'grid_size' => $row["grid_size"],
			'grid_height' => $row["grid_height"],
			'grid_width' => $row["grid_width"],
			'style_color' => $row["style_color"],
			'style_background' => $row["style_background"],
			'style_stroke' => $row["style_stroke"],
			'window_width' => $row["window_width"],
			'window_height' => $row["window_height"],
			'message' => $row["message"],
			'version' => $row["version"]
    	);
    }
    if($found['client_sendto'] == CLIENT && $found['client_id'] == CLIENTOTHER){
    	$DATA->query("UPDATE Messages SET opened = opened + 1, readbyreciever = readbyreciever + 1, recievernotified = recievernotified + 1 WHERE message_url = '".$openmessage."' ");
    } else {
    	$DATA->query("UPDATE Messages SET opened = opened + 1 WHERE message_url = '".$openmessage."' ");
    }
} else {
    header("Location: ".BASEURL);
	exit;
}
$DATA->close();



// Theme Black
$bodyclass = '';
if(valColor($found['style_background']) == '#000000'){
	$bodyclass .= ' bl';
}

include 'ui/header.php';
?>
</head>
<body class="tool <?php echo $bodyclass; ?>" style="background-color:<?php echo $found['style_background']; ?>">
<div id="openmessage"><?php echo $found['message']; ?></div>

<div class="corner tl">
	<menu id="about">
		<a class="button"><?php echo PAGETITLE; ?></a>
		<div class="panel unfold">
			<i class="closemenu">&times;</i>
			<ul>
				<li>
					<h1><?php echo PAGETITLE; ?></h1>
					<p><?php L('description'); ?></p>
				</li>
				<a class="export-svg" data-execute="export-svg" target="_blank" download><li><?php L('tools','export','export-svg'); ?></li></a>
				<a href="<?php echo URL_NEW; ?>" data-execute="reload"><li><?php L('general','start-new'); ?></li></a>
				<li class="grey">
					<a class="contactmail"><?php L('general','email-link'); ?></a>
				</li>
				<li class="grey">
					<span class="flle"><a target="_blank" href="<?php echo URL_ABOUT; ?>"><?php L('general','more'); ?></a></span>
					<span class="flri">
						<a target="_blank" href="http://leonlukasplum.de">L</a>&amp;<a target="_blank" href="http://moriwaan.de">M</a>&nbsp;2016+17
					</span>
					<div class="clear"></div>
				</p></li>
			</ul>
		</div>
	</menu>
	<menu id="help">
		<a class="button">?</a>
		<div class="panel unfold">
			<i class="closemenu">&times;</i>
			<ul>
				<li>
					<h1><?php L('help','title'); ?></h1>
					<p><?php L('help','read'); ?></p>
				</li>
			</ul>
		</div>
	</menu>
	<?php if(C4SECRETS == 1){ ?>
	<menu id="publickeys">
		<a class="button leak attention"><?php L('publickeys','title1'); ?>&nbsp;&darr;</a>
		<div class="panel unfold">
			<i class="closemenu">&times;</i>
			<ul>
				<li class="attention">
					<h1><span class="yes"><?php L('publickeys','title1'); ?></span></h1>
					<em><?php L('publickeys','exhibition'); ?></em><br /><?php L('publickeys','exhibition-info'); ?></li>
				<li class="noborders">
					<h2><?php L('publickeys','title2-off'); ?></h2>
				</li>
				<li class="leak noborders">
					<a class="button yes" href="<?php echo URL_NEW; ?>">&rarr;&nbsp;<?php L('publickeys','submit-yes'); ?></a>
				</li>
				<li>
					<p><?php L('publickeys','description'); ?></p>
				</li>
			</ul>
		</div>
	</menu>
	<?php } ?>
</div>

<div class="corner br">
	<label for="password">
	<menu id="decrypt">
		<a class="button" data-execute="decrypt"><?php L('tools','decrypt','title'); ?></a>
		<div class="panel">
			<ul>
				<li class="noborders"><?php L('general','password'); ?>:</li>
				<li class="input"><input maxlength="48" id="password" type="text" name="password" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false"/></li>
			</ul>
		</div>
	</menu>
	</label>
	<menu>
		<a class="button" href="<?php echo URL_NEW; ?>" data-execute="reload"><?php L('general','reply'); ?></a>
	</menu>
</div>

<canvas id="message" resize></canvas>

<?php
include 'ui/popups.php';
?>


<script type="text/javascript" src="<?php echo BASEURL; ?>/v/<?php echo $found['version']; ?>/decrypt.js"></script>


<?php
if(!isset($tracking)){ $tracking = true; }
include 'ui/footer.php';
?>