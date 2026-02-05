<?php

// Komma am ende der Zeile beachten
// die letzte Angabe eines sets bekommt KEIN komma


$lang_en = array(
	'description' => 'is a webtool that makes private messaging fun, easy and secure.',
	'general' => [
		'new' => 'New',
		'clear-canvas' => 'Clear canvas',
		'confirm-clear-canvas' => 'Do you really want to delete your drawings?',
		'start-new' => 'Start new message',
		'reload-page' => 'Reload page',
		'reply' => 'Reply',
		'password' => 'Password',
		'click' => 'Click',
		'drag' => 'Drag',
		'doubleclick' => 'Doubleclick',
		'delete' => 'Delete',
		'arrow-keys' => 'Arrows',
		'confirm' => 'OK',
		'cancel' => 'Cancel', // Abbrechen
		'close' => 'Close',
		'open' => 'Open',
		'close-window' => 'Close window',
		'success' => 'Success',
		'error' => 'Error',
		'random' => 'Random',
		'default' => 'Default',
		'reset' => 'Reset',
		'do-later' => 'Later',
		'change-on-reload' => 'This change will be first applied on next page reload.',
		'more' => 'About',
		'alert-mobile' => 'This website is not yet optimized for mobile.',
		'email-link' => 'Bug report, feature request, props',
		// %20 = White space
		'email-default-subject' => 'Secret%20message%20via%20crytch.com'
	],
	'settings' => [
		'title' => 'Settings',
		'language' => 'Language',
		'lang-en' => 'EN',
		'lang-de' => 'DE',
		'lang-fr' => 'FR',
		'lang-nl' => 'NL',
		'grid-size' => 'Grid Size',
		'color' => 'Color',
		'background' => 'Background',
		'color-black' => 'B',
		'color-white' => 'W',
		'color-blue' => 'B',
		'color-red' => 'R',
		'stroke-width' => 'Stroke width'
	],
	'tools' => [
		'title' => 'Tools',
		'tool-functionality' => 'Tool Functionality',
		'pen' => [
			'title' => 'Draw',
			'delete-last' => 'Delete last point',
			'start-new' => 'Start new path',
			'close' => 'Close path',
			'rectangle' => 'Draw rectangle'
		],
		'text' => [
			'title' => 'Write',
			'delete-last' => 'Delete last letter',
			'move-cursor' => 'Move cursor'
		],
		'move' => [
			'title' => 'Move',
			'move-path' => 'Move whole path',
			'move-point' => 'Move single point'
		],
		'encrypt' => [
			'title' => 'Encrypt',
			'enter-password' => 'Choose a password',
			'save-encrypted' => 'Save',
			'save-decrypted' => 'Save without encryption'
		],
		'send' => [
			'title' => 'Send',
			'find-message-at' =>'Your message is stored at',
			'send-via-mail' => 'Send link via E-Mail',
			'enter-mail' => 'Enter E-Mail address',
			'mail-notvalid' => 'Invalid E-Mail address',
			'send-mail' => 'Send',
			// Abschicken
			'send-to-client' => 'Send to '.CLIENTOTHERNAME,
			// 'An '.CLIENTOTHERNAME.' schicken'
			'message-recieved' => 'You recieved 1 new message from '.CLIENTOTHERNAME.'.',
			'message-recieved-open' => 'Open'
		],
		'decrypt' => [
			'title' => 'Decrypt',
			'enter-password' =>'Enter password',
			'message-not-found' =>'Sorry, we couldn’t find this message'
		],
		'export' => [
			'export-pdf' =>'Export as PDF',
			'export-png' => 'Export PNG',
			'export-svg' => 'Export SVG',
			'print' => 'Print',
			'print-postcard' => 'Print postcard'
		],
		'connect' => [
			'connect' =>'Verbinden',
			'clientid' => 'client ID',
			'your-clientid-is' => 'Your client ID is',
			'friend-id' => 'Your friends client ID',
			'friend-name' => 'Your friends nickname',
			'connected-with' => 'You are currently connected with '.CLIENTOTHERNAME,
			'connect-info' => 'With this form you can connect 2 clients with each other to enable direct messaging. To do so, insert your friends client ID and type any nickname.',
			'enable' => 'enable', // einrichten
			'clear-all' => 'Clear all',
			'clear-connecetion' => 'Delete all existing connections that this machine has with others',
			'info' => 'The connection has to be set up on 2 computers and will be obtained by both. This works with cookies. If you flush your cookies on one of them, a new client ID will be issued, the connection breaks and has to be renewed.'
		]
	],
	'misc' => [
		'max-paths' => 'Looks like you’re having fun. Great!<br />But please notice, that such complicated messages are likely to create errors in the code which can even lead to the destruction of the message.<br />You can avoid this by simplifying your message.'
	],
	'help' => [
		'title' => 'How to',
		'1' => '<em>Create</em> a secret visual message. You can use 3 different tools: Draw, Write, Move. Your whole message, even text consists of anchorpoints, connected with lines.',
		'2' => 'Once you’re done, click <em>Encrypt</em>. Then choose a password. With every letter of your password, the message gets more encrypted. Thus you can see your level of security right away. Remember the password well, it will not be stored anywhere.',
		'3' => 'Click <em>Save</em>. Your encrypted message will now be saved.',
		'4' => 'A unique <em>URL</em> will be generated, under which the encrypted message can be found. Send it to the recipient. Make sure, that you send link and password using different media.',
		'5' => 'You’ve just sent a secret message.',
		'6' => 'Once the recipient opens the link, the original message can be restored by entering the <em>password</em>.',
		'read' => 'This is a secret message. Click Decrypt and enter the password to restore the original message.'
	],
	'publickeys' => [
		'title1' => 'Public Keys',
		'leak-mode' => 'Leak Mode',
		'exhibition' => 'Exhibition',
		'exhibition-info' => 'Sept 9-17 2017, Spinnerei Leipzig, Germany',
		'title2-off' => 'Personal secrets, hot leaks, odd confessions. Be part of the Crowdsource-Videoperformance!',
		'title2-on' => 'Alice! You’re part of the Crowdsource-Videoperformance. Share now a secret anonymously!',
		'submit-yes' => 'Be part anonymously',
		'submit-no' => 'No thanks, Bob.',
		'confirm-no' => 'Please click <u>here</u> if you want your message to be shown and decrypted live during an art performance.',
		'confirm-yes' => 'Thank you very much that you’re taking part in our art performance.',
		'description' => 'Use <a href="http://crytch.com"><u>crytch.com</u></a> to design and encrypt a secret message. In order to take part, you will have to confirm your submission to the project. Your chosen password will then be saved but never shown. This happens absolutely anonymously! During the art performance, computer software will decrypt your message in front of the public which then will be legible for a few seconds.',
		'thankyou-title' => 'Thank you very much for taking part!'
	]
);





?>