<article>
	<header>
		<time datetime="<?php echo $date; ?>"><?php datereformat($date); ?></time>
		<h4>Neue Server und SSL Verschlüsselung</h4>
	</header>
	<div class="text">
		<p>Die Internetseite ist ab jetzt ausschlißlich über das verschlüsselte <em>https://</em>-Protokoll erreichbar. Dieser Schritt wurde durch den neu eingeführten <em>Leak-Mode</em> notwenig, da nun erstmalig <em>Nutzerdaten</em> in Textform zwischen Client und Server transportiert werden: ausgerechnet das <em>Passwort</em>!</p>
		<p>Die Nachricht an sich wird nach wie vor auf Client-Seite bei Eingabe des Passworts visuell verschlüsselt und war somit auch zuvor <em>sicher</em>.</p>
		<p>Bei Benutzung des Leak-Mode wird das Passwort erstmalig gesendet und gespeichert. Das dient ausschließlich zur Teilnahme an einer künstlerischen Video-Installation im Rahmen der <em>Public Keys</em>-Ausstellung und ist für vertrauliche Nachrichten selbstverständlich nicht geeignet.</p>
	</div>
</article>