<?php

if(!isset($config)){
	require_once('_config.php');
}

function datereformat($date){
	$date = explode('-',$date);
	echo $date[2].'-'.$date[1].'-'.$date[0];
}

include 'ui/header.php';
?>
	<base href="https://crytch.com/blogposts/img/">
</head>
<body class="page blog">
<div id="settings"></div>

<div class="wrapper">
	<header>
		<div class="text center">
			<h1><a href="<?php echo BASEURL; ?>"><?php echo PAGETITLE; ?></a></h1>
			<h2>Blog</h2>
		</div>
	</header>
	<section>

	<?php

		$blogdirectory = 'blogposts/';
		$blogentries = scandir($blogdirectory, 1);

		foreach ($blogentries as $post) {
			$date = str_replace('.php','',$post);
			$date_arr = explode('-', $post);
			include $blogdirectory.$post;
		}

	?>

	</section>
	<footer>
		<div class="text center">
			<p>Ende</p>
		</div>
	</footer>
</div>


<?php
include 'ui/popups.php';

if(!isset($tracking)){ $tracking = true; }
include 'ui/footer.php';
