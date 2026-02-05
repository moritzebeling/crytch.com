<?php
if(!isset($config)){
	require_once('../_config.php');
}





function connect($otherclient,$othername){
	
}



?>
<html>
<head>
	<title>Connect</title>
</head>
<body>


<div class="wrapper">
<h1>Connect 2 clients</h1>

<p>Your client ID is: <u><?php echo CLIENT; ?></u></p>
<hr />

<?php
if(LISTEN == 1){ ?>
	<p>You are now connected with <strong><?php echo CLIENTOTHERNAME; ?></strong> (<?php echo CLIENTOTHER; ?>)</p>
<?php } else { ?>

<p>With this form you can connect 2 clients with each other to enable direct messaging.<br />
To do so, insert your friends client ID and type any nickname.</p>

<form action="#" method="post">
	<p>Your friends client ID: <input name="clientother" type="text" maxlength="32" length="35" value="<?php if(isset($_POST['clientother'])){ echo $_POST['clientother']; } ?>" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" /></p>
	<p>Your friends nickname: <input name="clientothername" type="text" maxlength="20" length="35" value="<?php if(isset($_POST['clientothername'])){ echo $_POST['clientothername']; } ?>" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" /></p>
	<input type="submit" value="Enable" class="button"/>
</form>

<?php } ?>

<hr />

<form action="#" method="post">
	<p>Delete all existing connections that this machine has with others:
	<input name="deleteconnections" type="hidden" value="yes" /></p>
	<input type="submit" value="Clear all" class="button"/>
</form>

<hr />

<p class="grey">
	The connection has to be set up on 2 computers and will be obtained by both.
	This works with cookies. If you flush your cookies on one of them, a new client ID will be issued, the connection breaks and has to be renewed.
</p>
<p>
<a href="<?php echo BASEURL; ?>">Go back to index</a>
</p>

</div>
</body>
</html>