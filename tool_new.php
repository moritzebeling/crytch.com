<?php
if(!isset($config)){
	require_once('_config.php');
}




$bodyclass = '';
$leakmode = false;
if(isset($_GET['leakmode'])){
	if($_GET['leakmode'] == 1){
		$leakmode = true;
		$bodyclass .= 'c4secrets';
	}
}

include 'ui/header.php';
?>
</head>
<body class="tool <?php echo $bodyclass; ?>"
	data-tool="<?php echo DEFAULTTOOL; ?>"
	data-dafaulttool="<?php echo DEFAULTTOOL; ?>"
	data-listen="<?php echo LISTEN; ?>"
	data-language="<?php echo LANGUAGE; ?>"
>
<div id="settings"></div>

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
				<li><?php L('tools','tool-functionality'); ?>:<br />
					<div class="context default">
						<span class="flle"><?php L('tools','pen','title'); ?></span><span class="flri grey">D</span>
						<div class="clear"></div>
						<span class="flle"><?php L('tools','text','title'); ?></span><span class="flri grey">W</span>
						<div class="clear"></div>
						<span class="flle"><?php L('tools','move','title'); ?></span><span class="flri grey">M</span>
						<div class="clear"></div>
					</div>
					<div class="context pen">
						<span class="flle"><?php L('tools','pen','title'); ?></span><span class="flri grey"><?php L('general','click'); ?>, <?php L('general','drag'); ?></span>
						<div class="clear"></div>
						<span class="flle"><?php L('tools','pen','delete-last'); ?></span><span class="flri grey"><?php L('general','delete'); ?></span>
						<div class="clear"></div>
						<span class="flle"><?php L('tools','pen','close'); ?></span><span class="flri grey">C</span>
						<div class="clear"></div>
						<span class="flle"><?php L('tools','pen','start-new'); ?></span><span class="flri grey">D</span>
						<div class="clear"></div>
						<!-- <span class="flle">Draw rectangle</span><span class="flri grey">M+Drag</span>
						<div class="clear"></div> -->
					</div>
					<div class="context text">
						<span class="flle"><?php L('tools','text','move-cursor'); ?></span><span class="flri grey"><?php L('general','drag'); ?>, <?php L('general','arrow-keys'); ?></span>
						<div class="clear"></div>
						<span class="flle"><?php L('tools','text','delete-last'); ?></span><span class="flri grey"><?php L('general','delete'); ?></span>
						<div class="clear"></div>
					</div>
					<div class="context move">
						<span class="flle"><?php L('tools','move','move-path'); ?></span><span class="flri grey"><?php L('general','drag'); ?></span>
						<div class="clear"></div>
						<span class="flle"><?php L('tools','move','move-point'); ?></span><span class="flri grey">A + <?php L('general','drag'); ?></span>
						<div class="clear"></div>
					</div>
				</li>
				<li class="settings"><?php L('settings','title'); ?>:<br />
					<span class="flle"><?php L('settings','language'); ?></span><span class="flri grey" data-execute="setlanguage">
						<?php
						foreach ($languages_availible as $lang) {
							echo "<a data-val=\"".strtoupper($lang)."\">";
								L('settings','lang-'.$lang);
							echo "</a> ";
						}
						?>
					</span>
					<div class="clear"></div>
					<!-- <span class="flle">Grid Size</span><span class="flri grey">15</span>
					<div class="clear"></div> -->
					<div class="style">
						<span class="flle"><?php L('settings','color'); ?></span><span class="flri grey setcolor color" data-execute="restyle" data-inst="color">
							<a class="c000" data-val="b"><?php L('settings','color-black'); ?></a>
							<a class="cfff" data-val="w"><?php L('settings','color-white'); ?></a>
							<a class="cf00" data-val="red"><?php L('settings','color-red'); ?></a>
							<a class="c00f" data-val="blue"><?php L('settings','color-blue'); ?></a>
							<a data-val="rand">?</a>
						</span>
						<div class="clear"></div>
						<span class="flle"><?php L('settings','background'); ?></span><span class="flri grey setcolor background" data-execute="restyle" data-inst="background">
							<a class="c000" data-val="b"><?php L('settings','color-black'); ?></a>
							<a class="cfff" data-val="w"><?php L('settings','color-white'); ?></a>
							<a class="cf00" data-val="red"><?php L('settings','color-red'); ?></a>
							<a class="c00f" data-val="blue"><?php L('settings','color-blue'); ?></a>
							<a data-val="rand">?</a>
						</span>
						<div class="clear"></div>
					</div>
						<label for="strokewidth"><span class="flle"><?php L('settings','stroke-width'); ?></span><span class="flri grey"><input id="strokewidth" type="number" min="1" max="99" class="tari grey" value="2" maxlength="2" size="5"/></span></label>
						<div class="clear"></div>
				</li>
				<a class="export-svg inactive" data-execute="export-svg" target="_blank" download><li><?php L('tools','export','export-svg'); ?></li></a>
				<a class="clearall inactive" data-execute="clearall"><li><?php L('general','clear-canvas'); ?></li></a>
				<li class="grey">
					<a class="contactmail"><?php L('general','email-link'); ?></a>
				</li>
				<li class="grey">
					<span class="flle"><a target="_blank" href="<?php echo URL_ABOUT; ?>"><?php L('general','more'); ?></a></span>
					<span class="flri grey">
						<a target="_blank" href="http://leonlukasplum.de">L</a>&amp;<a target="_blank" href="http://moriwaan.de">M</a>&nbsp;2016+17
					</span>
					<div class="clear"></div>
				</li>
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
					<p><span class="grey">1</span>&nbsp;<?php L('help','1'); ?></p>
				</li>
				<li><p><span class="grey">2</span>&nbsp;<?php L('help','2'); ?></p></li>
				<li><p><span class="grey">3</span>&nbsp;<?php L('help','3'); ?></p></li>
				<li><p><span class="grey">4</span>&nbsp;<?php L('help','4'); ?></p></li>
				<li><p><span class="grey">:)</span>&nbsp;<?php L('help','5'); ?></p></li>
				<li><p><span class="grey">6</span>&nbsp;<?php L('help','6'); ?></p></li>
			</ul>
		</div>
	</menu>

	<?php if(C4SECRETS == 1){ ?>
	<menu id="publickeys" <?php if($leakmode == false){ echo "class=\"open\""; } ?> >
		<a class="button leak attention"><span class="yes"><?php L('publickeys','title1'); ?>&nbsp;&darr;</span><span class="nope"><?php L('publickeys','leak-mode'); ?></span></a>
		<div class="panel unfold">
			<i class="closemenu">&times;</i>
			<ul>
				<li class="attention">
					<h1 class="leak"><span class="yes"><?php L('publickeys','title1'); ?></span><span class="nope"><?php L('publickeys','leak-mode'); ?></span></h1>
					<span class="leak"><span class="nope"><em><?php L('publickeys','title1'); ?>&minus;</em></span></span><em><?php L('publickeys','exhibition'); ?></em><br /><?php L('publickeys','exhibition-info'); ?></li>
				<li class="noborders">
					<h2 class="leak"><span class="yes"><?php L('publickeys','title2-off'); ?></span>
					<span class="nope"><?php L('publickeys','title2-on'); ?></span></h2>
				</li>
				<li class="leak noborders">
					<a class="button yes" data-execute="submit_leak">&rarr;&nbsp;<?php L('publickeys','submit-yes'); ?></a>
					<a class="button nope grey" data-execute="no_leak"><?php L('publickeys','submit-no'); ?>&nbsp;&times;</a>
				</li>
				<li>
					<p><?php L('publickeys','description'); ?></p>
				</li>
			</ul>
		</div>
	</menu>
	<?php } ?>
</div>

<div class="corner tr">
	<menu class="tools join">
		<a class="button pen <?php if(DEFAULTTOOL == 'pen'){ echo 'active'; } ?>" data-execute="pen"><?php L('tools','pen','title'); ?></a><a class="button text <?php if(DEFAULTTOOL == 'text'){ echo 'active'; } ?>" data-execute="text"><?php L('tools','text','title'); ?></a>
	</menu>
	<menu class="tools">
		<a class="button move inactive" data-execute="move"><?php L('tools','move','title'); ?></a>
	</menu>
	<menu class="tools">
		<a class="button clearall inactive" data-execute="confirm-clearall"><?php L('general','new'); ?></a>
	</menu>
</div>

<div class="corner br">
	<menu id="encrypt" class="inactive">
		<a class="button" data-execute="encrypt"><?php L('tools','encrypt','title'); ?></a>
		<div class="panel">
			<ul>
				<?php if(C4SECRETS == 1){ ?>
				<li class="leak attention">
					<span class="yes"><a data-execute="submit_leak"><?php L('publickeys','confirm-no'); ?></a></span>
					<span class="nope"><?php L('publickeys','confirm-yes'); ?> <a data-execute="no_leak"><u><?php L('publickeys','submit-no'); ?></u></a></span>
				</li>
				<?php } ?>
				<label for="password">
					<li class="noborders">
						<span class="flle"><?php L('tools','encrypt','enter-password'); ?>:</span>
						<span class="flri grey">A-Z a-z 0-9</span>
						<div class="clear"></div>
					</li>
					<li class="input"><input maxlength="32" id="password" type="text" name="password" placeholder="<?php L('tools','encrypt','enter-password'); ?>" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" disabled/></li>
				</label>
				<a id="save" class="tari inactive" data-execute="save"><li><?php L('tools','encrypt','save-encrypted'); ?></li></a>
			</ul>
		</div>
	</menu>
	<menu id="send" class="inactive">
		<a class="button"><?php L('tools','send','title'); ?></a>
		<div class="panel">
			<ul class="addmargin">
				<label for="messageurl">
					<li class="noborders"><?php L('tools','send','find-message-at'); ?></li>
					<li class="input"><textarea rows="2" readonly id="messageurl" name="messageurl" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false"></textarea></li>
				</label>
				<?php if(SUMMAERY == 1){ ?>
					<li id="sendviamail" class="sendviamail sling button"><?php L('tools','send','send-via-mail'); ?>
						<div class="container"><input id="sendtomail" type="text" placeholder="alice@crytch.com" name="sendtomail" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" />
							<span class="flri"><a class="inactive exesend" data-execute="sendmailsling"><?php L('tools','send','title'); ?></a></span>
							<div class="clear"></div>
						</div>
					</li>
				<?php } else { ?>
					<a id="sendviamail" class="mailto" href="mailto:?Subject=<?php L('general','email-default-subject'); ?>&body=" target="_top">
						<li class="sendviamail">
							<?php L('tools','send','send-via-mail'); ?>
						</li>
					</a>
				<?php } ?>
				<?php if(LISTEN == 1){
					echo "<a class=\"sendtoclient\" data-execute=\"sendtoclient\"><li>";
					L('tools','send','send-to-client');
					echo "</li></a>";
				} ?>
			</ul>
			<ul>
				<a class="reload" data-execute="reload" href="<?php echo URL_NEW; ?>"><li><?php L('general','start-new'); ?></li></a>
			</ul>
		</div>
	</menu>
</div>

<div class="corner bl">
	<div id="status" class="grey"></div>
</div>




<canvas id="message" resize></canvas>


<?php
include 'ui/popups.php';


embedresource('crytch');


if(!isset($tracking)){ $tracking = true; }
include 'ui/footer.php';
?>