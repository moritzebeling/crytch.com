<div id="popups">
	<div class="bg"></div>
	<ul class="change-on-reload">
		<li class="message"><?php L('general','change-on-reload'); ?></li>
		<li class="userresponse twobuttons">
			<a class="flle" href="<?php echo BASEURL; ?>"><?php L('general','reload-page'); ?></a>
			<a class="flri closepopup"><?php L('general','cancel'); ?></a>
			<div class="clear"></div>
		</li>
	</ul>
	<ul class="message-recieved">
		<li class="message"><?php L('tools','send','message-recieved'); ?></li>
		<li class="userresponse twobuttons">
			<a class="flle closepopup"><?php L('general','cancel'); ?></a>
			<a class="flri openmessage"><?php L('tools','send','message-recieved-open'); ?></a>
			<div class="clear"></div>
		</li>
	</ul>
	<ul class="confirm-clear-canvas">
		<li class="message"><?php L('general','confirm-clear-canvas'); ?></li>
		<li class="userresponse twobuttons">
			<a class="flle closepopup"><?php L('general','cancel'); ?></a>
			<a class="flri clearall" data-execute="clearall"><?php L('general','clear-canvas'); ?></a>
			<div class="clear"></div>
		</li>
	</ul>
	<ul class="alert-mobile">
		<li class="message"><?php L('general','alert-mobile'); ?></li>
		<li class="userresponse twobuttons">
			<a class="flri closepopup"><?php L('general','confirm'); ?></a>
			<div class="clear"></div>
		</li>
	</ul>
	<ul class="max-paths">
		<li class="message"><?php L('misc','max-paths'); ?></li>
		<li class="userresponse twobuttons">
			<a class="flri closepopup"><?php L('general','confirm'); ?></a>
			<div class="clear"></div>
		</li>
	</ul>
</div>