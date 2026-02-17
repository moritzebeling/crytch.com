import { PageHeader, PageFooter } from "@/components/layout";
import { BlogPost, BlogText, BlogImage, BlogFigure } from "@/components/blog";

export const metadata = {
  title: "Blog - Crytch",
  description: "Updates and news about Crytch",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader title="Crytch" subtitle="Blog" />
      
      <section>
        {/* 2017-08-30 */}
        <BlogPost date="2017-08-30" title="Crytch Version 2">
          <BlogImage src="/blog/crytch-com-v2.png" width="50%" />
          <BlogText>
            <p>
              Nach mehr als einem Jahr gibt es endlich ein <em>Update</em>. Dafür wurde die gesamt Anwendung von Grund auf überarbeitet und die Schriftart weiterentwickelt.
            </p>
            <p>
              Neu ist: verbessere Anzeige auf Mobil-Geräten, neuer Verschlüsselungs-Algorithmus, Überarbeitung der Bedienung, diverse Fehlerbehebungen und Optimierungen, SSL Verschlüsselung und Leak-Mode.
            </p>
          </BlogText>
        </BlogPost>

        {/* 2017-08-21 */}
        <BlogPost date="2017-08-21" title="Neue Server und SSL Verschlüsselung">
          <BlogText>
            <p>
              Die Internetseite ist ab jetzt ausschlißlich über das verschlüsselte <em>https://</em>-Protokoll erreichbar. Dieser Schritt wurde durch den neu eingeführten <em>Leak-Mode</em> notwenig, da nun erstmalig <em>Nutzerdaten</em> in Textform zwischen Client und Server transportiert werden: ausgerechnet das <em>Passwort</em>!
            </p>
            <p>
              Die Nachricht an sich wird nach wie vor auf Client-Seite bei Eingabe des Passworts visuell verschlüsselt und war somit auch zuvor <em>sicher</em>.
            </p>
            <p>
              Bei Benutzung des Leak-Mode wird das Passwort erstmalig gesendet und gespeichert. Das dient ausschließlich zur Teilnahme an einer künstlerischen Video-Installation im Rahmen der <em>Public Keys</em>-Ausstellung und ist für vertrauliche Nachrichten selbstverständlich nicht geeignet.
            </p>
          </BlogText>
        </BlogPost>

        {/* 2017-08-01 */}
        <BlogPost date="2017-08-01" title="Crytch auf der Public Keys Ausstellung" />

        {/* 2017-07-22 */}
        <BlogPost date="2017-07-22" title="2000 verschickte Nachrichten" />

        {/* 2017-05-01 */}
        <BlogPost date="2017-05-01" title="Crytch in der form" />

        {/* 2017-04-14 */}
        <BlogPost date="2017-04-14" title="1000 verschickte Nachrichten" />

        {/* 2017-02-07 */}
        <BlogPost date="2017-02-07" title="Ausgezeichnet vom TDC New York">
          <BlogImage src="/blog/tdc-ny-badge.png" width="20%" className="mt-5" />
          <BlogText>
            <p>
              Der <em>Type Directors Club</em> New York hat Crytch mit dem <em>Certificate of Typographic Excellence</em> ausgezeichnet. Damit erscheint die Arbeit auch im TDC Jahrbuch Typography 38 und tourt mit der dazugehörigen Ausstellung quer durch die ganze Welt.
            </p>
          </BlogText>
        </BlogPost>

        {/* 2016-07-17 */}
        <BlogPost date="2016-07-17" title="500 verschickte Nachrichten" />

        {/* 2016-07-16 */}
        <BlogPost date="2016-07-16" title="marke.6 Bauhaus Essentials" />

        {/* 2016-07-14 */}
        <BlogPost date="2016-07-14" title="Ausstellung auf der Summaery" />

        {/* 2016-07-11 */}
        <BlogPost date="2016-07-11" title="http://crytch.com ist online" />

        {/* 2016-07-08 */}
        <BlogPost date="2016-07-08" title="Specimen">
          <BlogText>
            <p>
              Das Type Spicimen zeigt Crytch in den Schnitten <em>Regular</em> und <em>Zerballert</em>. Analoger Offsetdruck.
            </p>
          </BlogText>
          <BlogFigure
            images={[
              { src: "/blog/specimen_1.jpg", alt: "Crytch Specimen Außenansicht" },
              { src: "/blog/specimen_2.jpg", alt: "Crytch Specimen Innenansicht" },
            ]}
            caption="Crytch Type Specimen"
          />
        </BlogPost>

        {/* 2016-06-28 */}
        <BlogPost
          date="2016-06-28"
          title={
            <>
              En<em>cry</em>pt&nbsp;+&nbsp;Ske<em>tch</em>&nbsp;=&nbsp;<em>Crytch</em>
            </>
          }
          isLast
        >
          <BlogText>
            <p>
              Nach langem Überlegen, haben wir uns endlich für einen offiziellen Namen entschieden: Crytch! Eine Neubildung aus den englischen Wörtern für <em>verschlüsseln</em> und <em>zeichnen</em>. Die <a href="https://crytch.com" target="_blank" rel="noopener noreferrer" className="border-b border-current">.com-Domain</a> haben wir natürlich gleich gesichert. Somit wird unser Arbeitstitel <em>Cryptographer</em> abgelöst.
            </p>
          </BlogText>
        </BlogPost>
      </section>

      <PageFooter>
        <p>Ende</p>
      </PageFooter>
    </>
  );
}
