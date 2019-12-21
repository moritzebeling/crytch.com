<?php
if(!isset($config)){
	require_once('_config.php');
}


include 'ui/header.php';
?>
</head>
<body class="page about">
<div id="settings"></div>

<div class="wrapper">
	<header>
		<div class="text center">
			<h1><a href="<?php echo BASEURL; ?>"><?php echo PAGETITLE; ?></a></h1>
			<h2>Encrypt a Sketch</h2>
			<h4><span class="break">Crytch ermöglicht die Gestaltung und</span> Verschlüsselung visueller Botschaften.</h4>
		</div>
	</header>
	<section>
		<div class="text">
			<p>Wer eine <em>digitale Nachricht</em> auf den Weg bringt, kann sicher sein, dass sie gelesen wird&nbsp;&minus; nicht unbedingt und ausschließlich vom Empfänger. Vor allem seit den Enthüllungen durch Whistleblower wie Edward Snowden hat das Bedürfnis nach der zuverlässigeren <em>Absicherung</em> privater Kommunikationswege spürbar zugenommen. Obwohl das Angebot an Verschlüsselungstechnologien andauernd wächst, konnte sich bislang keine Anwendung durchsetzen. Oft ist die Installation umständlich, die Handhabung kompliziert, das Kodierungsverfahren undurchsichtig. Die angestrebte Daten-Autarkie führt zum Kontrollverlust&nbsp;&minus; das Unbehagen bleibt.</p>
			<p>Vor mehr als zwanzig Jahren entwickelten die israelischen Informatiker und Kryptologen Moni Naor und Adi Shamir ein visuelles Verschlüsselungsverfahren. Bei diesem wird das zu schützende Bild in Teilbilder zerlegt, wobei die einzelnen „Shares“ wertlos sind&nbsp;&minus; erst durch exaktes Übereinanderlegen der Teilbilder wird das ursprüngliche Motiv wieder sichtbar. Für die Dechiffrierung ist nicht unbedingt ein Computer erforderlich, sie kann ebenso auf analogem Wege durch das menschliche Auge erfolgen.</p>
		</div>
		<figure>
			<img src="/ui/img/specimen_figure_c.png" width="100%" height="auto" alt="Visuelle Kodierung der Buchstaben" />
			<figcaption>Visuelle Kodierung der Buchstaben</figcaption>
		</figure>
		<div class="text">
			<p>Die Idee der <em>visuellen Kryptographie</em> wird in Crytch für Buchstaben und Formen adaptiert. Zeichen und Zeichnungen bestehen aus Ankerpunkten, die durch Linien miteinander verbunden sind. Während der Ein­gabe des Passworts werden die Punkte schrittweise auf einer variablen Matrix verschoben. Das <em>Passwort</em> wird dabei nicht gespeichert.</p>
		</div>
		<figure>
			<img src="/ui/img/specimen_figure_a.png" width="100%" height="auto" alt="Konstruktion und Dekonstruktion eines Buchstabens" />
			<figcaption>Konstruktion und Dekonstruktion eines Buchstabens</figcaption>
		</figure>
		<div class="text">
			<p>Als Verifizierung einer korrekten Eingabe dient ausschließlich das entschlüsselte Bild. Ob und wann der ursprüngliche Zustand der Nachricht wiederherge­stellt wurde, kann nur ein <em>menschlicher Beobachter</em> erkennen. Daher ist es unwahrscheinlich, durch automa­tisiertes Ausprobieren verschiedener Passwörter („Brute&#8209;Force-Methode“) zum dechiffrierten Bild zu gelangen. Gleichermaßen kann auch der Empfänger dabei zusehen, wie die Botschaft während der Eingabe des Passworts entschlüsselt wird.</p>
			<p>Textnachrichten werden in einer speziell ­dafür gestalteten Schrift dargestellt, die zur ­visuellen ­<em>Kodierung</em> geeignet ist. Damit die Anzahl der vorhan­denen Ankerpunkte keine Rückschlüsse auf den kodierten Buchstaben erlaubt, bestehen alle Glyphen aus gleich vielen Ankerpunkten. Um einen zusammenhängenden Pfad zu erhalten, sind die Zeichen aus ­einer Linie gezeichnet und bewegen sich in 90-&nbsp;und 45&#8209;Grad-Winkeln innerhalb eines quadratischen Rasters.</p>
			<p>Das gemeinsame Raster, an dem sich Text- und Bildelemente ausrichten, bildet die Grundlage für eine charakteristische <em>Formensprache</em> aller mit Crytch erstellten Botschaften. Im Gestaltungs­prozess können Faktoren wie Farbe, Rasterweite und Strichstärke angepasst werden&nbsp;&minus; auch die vorge­fertigten Buchstaben lassen sich manuell verändern.</p>
			<p>Aus den konzeptionellen Prämissen geht eine eigenständige formale Ästhetik hervor, die Crytch zum Gestaltungswerkzeug macht. Aus den scheinbar enorm reduzierten Optionen resultieren vielgestal­tige Kompositionsmöglichkeiten.</p>
		</div>
	</section>
	<footer>
		<div class="text center">
			<p class="break">Eine Arbeit von<br />
			<span class="break"><a target="_blank" href="http://moritzebeling.de">Moritz&nbsp;Ebeling</a> und <a target="_blank" href="http://leonlukasplum.de">Leon&nbsp;Lukas&nbsp;Plum</a>,</span>
			Bauhaus-Universität Weimar.</p>
			<p class="break"><span class="break">Entstanden im Semester­projekt ­<a href="https://www.instagram.com/digitaltypography/" target="_blank"><em>Private&nbsp;Conversation</em></a>,</span>
			geleitet von Christoph&nbsp;Knoth und Konrad&nbsp;Renner.</p>
			<p class="break">Weimar im Juli&nbsp;2016</p>
			<p>&nbsp;</p>
			<p><a href="http://www.form.de/de/news/interview-zu-crytch" target="_blank">Interview mit dem <em>form&nbsp;Magazin</em> April&nbsp;2017</a></p>
			<p>&nbsp;</p>
			<p><span class="break">Teil der <em>Bauhaus&nbsp;Essentials</em> 2016 der marke.6</span>
			<span class="break">Ausgezeichnet mit dem Certificate of Typographic Excellence des <em>TDC&nbsp;New&nbsp;York</em></span>
			<span class="break">und erschienen im <em>TDC&nbsp;Tokyo</em> Annual Book 2017.</span>
			<span class="break">Ausgestellt auf dem <em>Spinnereirundgang</em> 2017 in Leipzig</span>
			<span class="break">Teil des <em>Typodarium</em> 2018<br /></span></p>
		</div>
	</footer>
</div>





<?php
include 'ui/popups.php';
?>


<?php
if(!isset($tracking)){ $tracking = true; }
include 'ui/footer.php';
?>