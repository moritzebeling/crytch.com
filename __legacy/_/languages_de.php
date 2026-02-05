<?php

// Komma am ende der Zeile beachten
// die letzte Angabe eines sets bekommt KEIN komma

$lang_de = array(
	'description' => 'ermöglicht die Gestaltung und Verschlüsselung visueller Botschaften.',
	'general' => [
		'new' => 'Neu',
		'clear-canvas' => 'Zeichenfläche leeren',
		'confirm-clear-canvas' => 'Möchtest Du wirklich Deine Zeichnung löschen?',
		'start-new' => 'Neue Nachricht erstellen',
		'reload-page' => 'Seite neu laden',
		'reply' => 'Antworten',
		'password' => 'Passwort',
		'click' => 'Klick',
		'drag' => 'Ziehen',
		'doubleclick' => 'Doppelklick',
		'delete' => 'Löschen',
		'arrow-keys' => 'Pfeiltasten',
		'confirm' => 'OK',
		'cancel' => 'Abbrechen',
		'close' => 'Schließen',
		'close-window' => 'Fenster schließen',
		'open' => 'Öffnen',
		'success' => 'Hat geklappt',
		'error' => 'Fehler',
		'random' => 'Zufällig',
		'default' => 'Standard',
		'reset' => 'Zurücksetzen',
		'do-later' => 'Später',
		'change-on-reload' => 'Die Änderungen werden erst nach dem erneuten Laden der Seite sichtbar.',
		'more' => 'Weitere Infos',
		'alert-mobile' => 'Diese Webseite ist leider noch nicht für mobile optimiert.',
		'email-link' => 'Bug report, feature request, props',
		// %20 = Leerzeichen
		'email-default-subject' => 'Geheime%20Botschaft%20auf%20crytch.com'
	],
	'settings' => [
		'title' => 'Einstellungen',
		'language' => 'Sprache',
		'lang-en' => 'EN',
		'lang-de' => 'DE',
		'lang-fr' => 'FR',
		'lang-nl' => 'NL',
		'grid-size' => 'Rastergröße',
		'color' => 'Farbe',
		'background' => 'Hintergrund',
		'color-black' => 'S',
		'color-white' => 'W',
		'color-blue' => 'B',
		'color-red' => 'R',
		'stroke-width' => 'Strichstärke',
	],
	'tools' => [
		'title' => 'Werkzeuge',
		'tool-functionality' => 'Werkzeug-Funktionalität',
		'pen' => [
			'title' => 'Zeichnen',
			'delete-last' => 'Letzten Ankerpunkt löschen',
			'start-new' => 'Neuen Pfad beginnen',
			'close' => 'Pfad schließen',
			'rectangle' => 'Rechteck zeichnen'
		],
		'text' => [
			'title' => 'Schreiben',
			'delete-last' => 'Letzten Buchstaben löschen',
			'move-cursor' => 'Cursor bewegen'
		],
		'move' => [
			'title' => 'Verschieben',
			'move-path' => 'Ganzen Pfad verschieben',
			'move-point' => 'Einzelnen Ankerpunkt verschieben'
		],
		'encrypt' => [
			'title' => 'Verschlüsseln',
			'enter-password' => 'Passwort wählen',
			'save-encrypted' => 'Speichern',
			'save-decrypted' => 'Ohne Verschlüsselung speichern'
		],
		'send' => [
			'title' => 'Senden',
			'find-message-at' =>'Die Nachricht ist aufrufbar unter',
			'send-via-mail' => 'Link per E-Mail verschicken',
			'enter-mail' => 'E-Mail-Adresse eingeben',
			'mail-notvalid' => 'Ungültige E-Mail-Adresse',
			'send-mail' => 'Abschicken',
			'send-to-client' => 'An '.CLIENTOTHERNAME.' schicken',
			'message-recieved' => 'Neue Nachricht von '.CLIENTOTHERNAME,
			'message-recieved-open' => 'Öffnen'
		],
		'decrypt' => [
			'title' => 'Entschlüsseln',
			'enter-password' =>'Passwort eingeben',
			'message-not-found' =>'Diese Nachricht konnte leider nicht gefunden werden.'
		],
		'export' => [
			'export-pdf' =>'Als PDF exportieren',
			'export-png' => 'Als PNG exportieren',
			'export-svg' => 'Als SVG exportieren',
			'print' => 'Drucken',
			'print-postcard' => 'Postkarte drucken'
		],
		'connect' => [
			'connect' =>'Verbinden',
			'clientid' => 'Benutzer-ID',
			'your-clientid-is' => 'Deine Benutzer-ID ist',
			'friend-id' => 'Die Benutzer-ID Deines Freundes ist',
			'friend-name' => 'Name Deines Freundes',
			'connected-with' => 'Du bist gerade mit '.CLIENTOTHERNAME.' verbunden.',
			'connect-info' => 'Mit dieser Funktion kannst Du zwei Nutzer miteinander verbinden, um Echtzeit-Nachrichten verschicken zu können. Füge dazu die Benutzer-ID und den Namen Deines Freundes ein.',
			'enable' => 'Einrichten',
			'clear-all' => 'Alles zurücksetzen',
			'clear-connecetion' => 'Alle bestehenden Verbindungen dieses Rechners löschen',
			'info' => 'Die Verbindung wird auf zwei Computern eingerichtet und von beiden aufrecht erhalten. Das funktioniert mittels Cookies. Wenn auf einem Rechner Cookies gelöscht werden, wird eine neue Benutzer-ID generiert, die Verbindung bricht ab und muss erneut eingerichtet werden.'
		]
	],
	'misc' => [
		'max-paths' => 'Sieht aus als hättest Du Spaß!<br />Aber bitte beachte, das so kompliziert Nachrichten fehler mit dem Programm verursachen können. Das kann sogar dazu führen, dass Deine Nachricht nicht gespeichert werden kann.<br />Am besten Du vereinfachst deine Nachricht ein bisschen.'
	],
	'help' => [
		'title' => 'So geht es',
		'1' => '<em>Gestalte</em> eine geheime visuelle Botschaft. Dafür stehen dir 3 Werkzeuge zur verfügung: Zeichnen, Schreiben, Verschieben. Deine gesamte Botschaft besteht aus Ankerpunkten, welche durch Linien verknüpft sind.',
		'2' => 'Wenn Du fertig bist, klicke auf <em>Verschlüsseln</em>. Dann gib ein Passwort ein. Durch jede Stelle Deines Passworts wird Deine Botschaft verschlüsselt. Den Sicherheitsgrad Deines Passworts kannst Du so direkt sehen. Merke Dir Dein Passwort gut, es wird nicht gespeichert.',
		'3' => 'Klicke auf <em>Speichern</em>. Die verschlüsselte Botschaft wird nun gespeichert.',
		'4' => 'Du bekommst nun einen <em>Link</em>, unter welchem die verschlüsselte Botschaft aufgerufen werden kann. Diesen kannst Du nun an den Empfänger verschicken. Am besten teilst Du dem Empfänger Passwort und Link über unterschiedliche Kanäle mit.',
		'5' => 'Du hast soeben eine geheime Botschaft verschickt.',
		'6' => 'Nach dem Öffnen des Links, kann die ursprüngliche Nachricht Durch Eingabe des <em>Passworts</em> wiederhergestellt werden.',
		'read' => 'Dies ist eine geheime Botschaft. Du kannst sie lesen indem Du auf Entschlüsseln klickst und das richtige Passwort eingibst.'
	],
	'publickeys' => [
		'title1' => 'Public Keys',
		'leak-mode' => 'Leak Modus',
		'exhibition' => 'Ausstellung',
		'exhibition-info' => '9-17.Sept 2017, Spinnerei Leipzig',
		'title2-off' => 'Persönliche Geheimnisse, brisante Leaks, banale Geständnisse. Werde Teil der Crowdsource-Videoinstallation!',
		'title2-on' => 'Alice! Du bist Teil unserer Crowdsource-Videoinstallation. Teile jetzt anonym ein Geheimnis!',
		'submit-yes' => 'Anonym teilnehmen',
		'submit-no' => 'Nicht teilnehmen',
		'confirm-no' => 'Bitte klicke <u>hier</u> um zu bestätigen, dass Deine Nachricht anonym im Rahmen einer Kunstinstallation veröffentlicht werden darf.',
		'confirm-yes' => 'Vielen Dank, dass Du zu unserer Kunstinstallation beiträgst.',
		'description' => 'Benutze <a href="http://crytch.com"><u>Crytch.com</u></a> um eine geheime Botschaft zu gestalten und zu verschlüsseln. Um teilzunehmen musst Du der Veröffentlichung zustimmen. Dies geschieht garantiert anonym! Das dann gewählte Passwort wird gespeichert, bleibt aber unter Verschluss. Für die automatisierte Videoinstallation wird ein Computerprogramm Deine Botschaft vor den Augen des Publikums für wenige Sekunden entschlüsseln.',
		'thankyou-title' => 'Vielen Dank für Deine Teilnahme!'
	]
);











?>