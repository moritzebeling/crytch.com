import { PageHeader, PageSection, Figure } from "@/components/layout";
import { AboutText, AboutParagraph, AboutFooter, Break } from "@/components/about";

export const metadata = {
  title: "About - Crytch",
  description: "Crytch ermöglicht die Gestaltung und Verschlüsselung visueller Botschaften.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Crytch"
        subtitle="Encrypt a Sketch"
        tagline={
          <>
            <span className="block max-sm:inline">Crytch ermöglicht die Gestaltung und</span> Verschlüsselung visueller Botschaften.
          </>
        }
      />

      <PageSection>
        <AboutText>
          <AboutParagraph first>
            Wer eine <em>digitale Nachricht</em> auf den Weg bringt, kann sicher sein, dass sie gelesen wird&nbsp;− nicht unbedingt und ausschließlich vom Empfänger. Vor allem seit den Enthüllungen durch Whistleblower wie Edward Snowden hat das Bedürfnis nach der zuverlässigeren <em>Absicherung</em> privater Kommunikationswege spürbar zugenommen. Obwohl das Angebot an Verschlüsselungstechnologien andauernd wächst, konnte sich bislang keine Anwendung durchsetzen. Oft ist die Installation umständlich, die Handhabung kompliziert, das Kodierungsverfahren undurchsichtig. Die angestrebte Daten-Autarkie führt zum Kontrollverlust&nbsp;− das Unbehagen bleibt.
          </AboutParagraph>
          <AboutParagraph>
            Vor mehr als zwanzig Jahren entwickelten die israelischen Informatiker und Kryptologen Moni Naor und Adi Shamir ein visuelles Verschlüsselungsverfahren. Bei diesem wird das zu schützende Bild in Teilbilder zerlegt, wobei die einzelnen „Shares" wertlos sind&nbsp;− erst durch exaktes Übereinanderlegen der Teilbilder wird das ursprüngliche Motiv wieder sichtbar. Für die Dechiffrierung ist nicht unbedingt ein Computer erforderlich, sie kann ebenso auf analogem Wege durch das menschliche Auge erfolgen.
          </AboutParagraph>
        </AboutText>

        <Figure
          src="/about/specimen_figure_c.png"
          alt="Visuelle Kodierung der Buchstaben"
          caption="Visuelle Kodierung der Buchstaben"
        />

        <AboutText>
          <AboutParagraph first>
            Die Idee der <em>visuellen Kryptographie</em> wird in Crytch für Buchstaben und Formen adaptiert. Zeichen und Zeichnungen bestehen aus Ankerpunkten, die durch Linien miteinander verbunden sind. Während der Ein­gabe des Passworts werden die Punkte schrittweise auf einer variablen Matrix verschoben. Das <em>Passwort</em> wird dabei nicht gespeichert.
          </AboutParagraph>
        </AboutText>

        <Figure
          src="/about/specimen_figure_a.png"
          alt="Konstruktion und Dekonstruktion eines Buchstabens"
          caption="Konstruktion und Dekonstruktion eines Buchstabens"
        />

        <AboutText>
          <AboutParagraph first>
            Als Verifizierung einer korrekten Eingabe dient ausschließlich das entschlüsselte Bild. Ob und wann der ursprüngliche Zustand der Nachricht wiederherge­stellt wurde, kann nur ein <em>menschlicher Beobachter</em> erkennen. Daher ist es unwahrscheinlich, durch automa­tisiertes Ausprobieren verschiedener Passwörter („Brute‑Force-Methode") zum dechiffrierten Bild zu gelangen. Gleichermaßen kann auch der Empfänger dabei zusehen, wie die Botschaft während der Eingabe des Passworts entschlüsselt wird.
          </AboutParagraph>
          <AboutParagraph>
            Textnachrichten werden in einer speziell ­dafür gestalteten Schrift dargestellt, die zur ­visuellen ­<em>Kodierung</em> geeignet ist. Damit die Anzahl der vorhan­denen Ankerpunkte keine Rückschlüsse auf den kodierten Buchstaben erlaubt, bestehen alle Glyphen aus gleich vielen Ankerpunkten. Um einen zusammenhängenden Pfad zu erhalten, sind die Zeichen aus ­einer Linie gezeichnet und bewegen sich in 90-&nbsp;und 45‑Grad-Winkeln innerhalb eines quadratischen Rasters.
          </AboutParagraph>
          <AboutParagraph>
            Das gemeinsame Raster, an dem sich Text- und Bildelemente ausrichten, bildet die Grundlage für eine charakteristische <em>Formensprache</em> aller mit Crytch erstellten Botschaften. Im Gestaltungs­prozess können Faktoren wie Farbe, Rasterweite und Strichstärke angepasst werden&nbsp;− auch die vorge­fertigten Buchstaben lassen sich manuell verändern.
          </AboutParagraph>
          <AboutParagraph>
            Aus den konzeptionellen Prämissen geht eine eigenständige formale Ästhetik hervor, die Crytch zum Gestaltungswerkzeug macht. Aus den scheinbar enorm reduzierten Optionen resultieren vielgestal­tige Kompositionsmöglichkeiten.
          </AboutParagraph>
        </AboutText>
      </PageSection>

      <AboutFooter>
        <p className="mb-0">
          <Break>Eine Arbeit von</Break>
          <br />
          <Break>
            <a href="http://moritzebeling.de" target="_blank" rel="noopener noreferrer">Moritz&nbsp;Ebeling</a> und{" "}
            <a href="http://leonlukasplum.de" target="_blank" rel="noopener noreferrer">Leon&nbsp;Lukas&nbsp;Plum</a>,
          </Break>{" "}
          Bauhaus-Universität Weimar.
        </p>
        <p className="mb-0">
          <Break>Entstanden im Semester­projekt ­<a href="https://www.instagram.com/digitaltypography/" target="_blank" rel="noopener noreferrer"><em>Private&nbsp;Conversation</em></a>,</Break>{" "}
          geleitet von Christoph&nbsp;Knoth und Konrad&nbsp;Renner.
        </p>
        <p className="mb-0">
          <Break>Weimar im Juli&nbsp;2016</Break>
        </p>
        <p>&nbsp;</p>
        <p>
          <a href="http://www.form.de/de/news/interview-zu-crytch" target="_blank" rel="noopener noreferrer">Interview mit dem <em>form&nbsp;Magazin</em> April&nbsp;2017</a>
        </p>
        <p>&nbsp;</p>
        <p>
          <Break>Teil der <em>Bauhaus&nbsp;Essentials</em> 2016 der marke.6</Break>{" "}
          <Break>Ausgezeichnet mit dem Certificate of Typographic Excellence des <em>TDC&nbsp;New&nbsp;York</em></Break>{" "}
          <Break>und erschienen im <em>TDC&nbsp;Tokyo</em> Annual Book 2017.</Break>{" "}
          <Break>Ausgestellt auf dem <em>Spinnereirundgang</em> 2017 in Leipzig</Break>{" "}
          <Break>Teil des <em>Typodarium</em> 2018</Break>
        </p>
      </AboutFooter>
    </>
  );
}
