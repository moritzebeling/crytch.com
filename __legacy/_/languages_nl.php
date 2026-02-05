<?php

// Komma am ende der Zeile beachten
// die letzte Angabe eines sets bekommt KEIN komma

$lang_nl = array(
	'description' => 'is een webtool voor het ontwerpen en coderen van visuele berichten.',
	'general' => [
		'new' => 'Nieuw',
		'clear-canvas' => 'Tekengebied wissen',
		'confirm-clear-canvas' => 'Wil je je teking écht wissen?',
		'start-new' => 'Nieuw bericht aanmaken',
		'reload-page' => 'Pagina opnieuw laden',
		'reply' => 'Antwoorden',
		'password' => 'Wachtwoord',
		'click' => 'Klik',
		'drag' => 'Trekken',
		'doubleclick' => 'Dubbelklik',
		'delete' => 'Wissen',
		'arrow-keys' => 'Pijltjestoetsen',
		'confirm' => 'Oké',
		'cancel' => 'Annuleren',
		'close' => 'Sluiten',
		'close-window' => 'Venster sluiten',
		'open' => 'Openen',
		'success' => 'Is gelukt!',
		'error' => 'Fout',
		'random' => 'Toevallig',
		'default' => 'Standaard',
		'reset' => 'Opnieuw zetten',
		'do-later' => 'Later',
		'change-on-reload' => 'Je wijzingen worden pas zichtbaar als je de pagina opnieuw laadt.',
		'more' => 'Meer info’s (DE)',
		'alert-mobile' => 'Deze pagina is helaas nog niet geoptimaliseerd voor mobiel gebruik.',
		'email-link' => 'Bug report, feature request, props',
		// %20 = Leerzeichen
		'email-default-subject' => 'Geheim%20bericht%20op%20crytch.com'
	],
	'settings' => [
		'title' => 'Instellingen',
		'language' => 'Taal',
		'lang-en' => 'EN',
		'lang-de' => 'DE',
		'lang-fr' => 'FR',
		'lang-nl' => 'NL',
		'grid-size' => 'Rastergrootte',
		'color' => 'Kleur',
		'background' => 'Achtergrond',
		'color-black' => 'Z',
		'color-white' => 'W',
		'color-blue' => 'B',
		'color-red' => 'R',
		'stroke-width' => 'Lijndikte',
	],
	'tools' => [
		'title' => 'Werktuigen',
		'tool-functionality' => 'Werkwijze van het werktuig',
		'pen' => [
			'title' => 'Tekenen',
			'delete-last' => 'Laatste ankerpunt wissen',
			'start-new' => 'Nieuw pad aanmaken',
			'close' => 'Pad sluiten',
			'rectangle' => 'Vierhoek tekenen'
		],
		'text' => [
			'title' => 'Schrijven',
			'delete-last' => 'Laatste letter wissen',
			'move-cursor' => 'Cursor bewegen'
		],
		'move' => [
			'title' => 'Verschuiven',
			'move-path' => 'Hele pad verschuiven',
			'move-point' => 'Enkele ankerpunt verschuiven'
		],
		'encrypt' => [
			'title' => 'Coderen',
			'enter-password' => 'Wachtwoord kiezen',
			'save-encrypted' => 'Opslaan',
			'save-decrypted' => 'Zonder codering opslaan'
		],
		'send' => [
			'title' => 'Verzenden',
			'find-message-at' =>'Dit bericht is beschikbaar op',
			'send-via-mail' => 'Link via e-mail verzenden',
			'enter-mail' => 'E-mailadres invoeren',
			'mail-notvalid' => 'Ongeldig e-mailadres',
			'send-mail' => 'Verzenden',
			'send-to-client' => 'Aan '.CLIENTOTHERNAME.' sturen',
			'message-recieved' => 'Nieuw bericht van '.CLIENTOTHERNAME,
			'message-recieved-open' => 'Openen'
		],
		'decrypt' => [
			'title' => 'Decoderen',
			'enter-password' =>'Wachtwoord invoeren',
			'message-not-found' =>'Dit bericht kon helaas niet gevonden worden.'
		],
		'export' => [
			'export-pdf' =>'Exporteren als PDF',
			'export-png' => 'Exporteren als PNG',
			'export-svg' => 'Exporteren als SVG',
			'print' => 'Afdrukken',
			'print-postcard' => 'Briefkaartje afdrukken'
		],
		'connect' => [
			'connect' =>'Verbinden',
			'clientid' => 'Gebruiker-ID',
			'your-clientid-is' => 'Je gebruiker-ID is',
			'friend-id' => 'De gebruiker-ID van je vriend is',
			'friend-name' => 'Naam van je vriend',
			'connected-with' => 'Je bent momenteel verbonden met '.CLIENTOTHERNAME.'.',
			'connect-info' => 'Met deze functie kan je twee gebruikers met elkaar verinden om berichten in realtime te versturen. Voer daarvoor de gebruiker-ID van je vriend in.',
			'enable' => 'Opslaan',
			'clear-all' => 'Alles wissen',
			'clear-connecetion' => 'Alle bestaande verbindingen van deze computer wissen',
			'info' => 'De verbinding word op twee computers ingesteld en door beiden in stand gehouden. Dat werkt door middel van cookies. Als de cookies op een computer gewist worden, wordt een nieuwe gebruiker-ID aangemaakt, de verbinding eindigt en moet opnieuw ingesteld worden.'
		]
	],
	'misc' => [
		'max-paths' => 'Je hebt het héél erg naar je zin, toch?<br />Maar let er alsjeblieft op dat zó ingewikkelde berichten foutjes in het programma kunnen veroorzaken. Dat kan zelfs zo ver gaan dat je berichten niet opgeslagen kunnen worden.<br />Het zou prima zijn als je je bericht een beetje zou vereenvoudigen.'
	],
	'help' => [
		'title' => 'Zo werkt het',
		'1' => '<em>Ontwerp</em> een geheim bericht. Daarvoor kan je gebruik maken van drie werktuigen: Tekenen, Schrijven, Verschuiven. Je hele bericht bestaat uit ankerpunten die door lijnen met eklaar verbonden zijn.',
		'2' => 'Als je klaar bent, klik op <em>coderen</em>. Voer vervolgens een wachtwoord in. Door elk letterteken dat je intoetst wordt je bericht codeert. Je kan dus meteen zien hoe veilig je wachtwoord is. Onthoud je wachtwoord goed, het wordt namelijk niet opgeslagen.',
		'3' => 'Klik op <em>opslaan</em>. Het gecodeerde bericht wordt nu opgeslagen.',
		'4' => 'Je ontvangt een <em>link</em> waar je je gecodeerde bericht kan terugvinden. Deze link kan je nu aan de ontvanger versturen. Je kan het best twee verschillende kanalen gebruiken om het wachtwoord en de link met de ontvanger te delen.',
		'5' => 'Je hebt zojuist een gecodeerd bericht verstuurd.',
		'6' => 'Nadat de link wordt geopend kan het oorspronkelijke bericht door het invoeren van het <em>wachtwoord</em> terug zichtbaar worden gemaakt.',
		'read' => 'Dit is een geheim bericht. Je kan het lezen door op Decoderen te klikken en het juiste wachtwoord in te voeren.'
	],
	'publickeys' => [
		'title1' => 'Public Keys',
		'leak-mode' => 'Leak Modus',
		'exhibition' => 'Tentoonstelling',
		'exhibition-info' => '9-17. september 2017, Spinnerei Leipzig',
		'title2-off' => 'Persoonlijke geheimen, brisante leaks, banale bekentenissen. Doe mee aan de crowdsource-videoinstallatie!',
		'title2-on' => 'Alice! Je neemt deel an onze crowdsource-videoinstallatie. Deel nu anoniem een geheim!',
		'submit-yes' => 'Anoniem deelnemen',
		'submit-no' => 'Toch niet deelnemen',
		'confirm-no' => 'Gelieve <u>hier</u> te klikken om te bevestigen dat je bericht in het kader van een installatie anoniem mag getoond worden.',
		'confirm-yes' => 'Hartelijk dank dat je meedoet aan onze installatie.',
		'description' => 'Gebruik <a href="http://crytch.com"><u>Crytch.com</u></a> om een geheim bericht te ontwerpen en te coderen. Als je deelnemen wilt, moet je akkoord gaan met het tentoonstellen van je bericht. Dat gebeurt gegarandeerd anoniem! Het gebruikte wachtwoord wordt opgeslagen, maar niet publiek gemaakt. In de geautomatiseerde videoinstallatie zal een computerprogramma je bericht onder de ogen van het publiek voor enkele momenten decoderen.',
		'thankyou-title' => 'Hartelijk dank voor je deelneming!'
	]
);











?>