import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* ---------- HERO ---------- */}
      <section className="section bg-gray-50">
        <div className="section-narrow text-center">
          <h1 className="text-3xl font-bold mb-4">
            AI-Act paperwork solved in&nbsp;30 minutes
          </h1>
          <p className="text-xl mb-6">
            Generate EU-compliant risk report &amp; technical docs for your
            GPT-powered feature — before the fines hit.
          </p>
          <Link href="/wizard" className="btn text-white">
            Start free
          </Link>
        </div>
      </section>

      {/* ---------- WHY IT MATTERS ---------- */}
      <section className="section bg-white">
        <div className="section-narrow">
          <h2 className="text-xl font-bold mb-4">
            Warum ist der&nbsp;EU&nbsp;AI&nbsp;Act wichtig&nbsp;?
          </h2>

          <p className="mb-4 text-sm">
            Die Europäische Union reguliert KI-Systeme künftig ähnlich streng
            wie Medizin- oder Finanzprodukte. Unternehmen müssen ihr Modell in
            eine Risiko­klasse einordnen, umfangreiche Dokumentation vorlegen
            und bei Verstößen mit Bußgeldern von{" "}
            <strong>bis zu 35&nbsp;Mio.&nbsp;€ oder 7 % des globalen
              Jahres­umsatzes</strong> rechnen.
          </p>

          <p className="mb-6 text-sm">
            Den offiziellen Gesetzestext (Entwurfsfassung) findest&nbsp;du hier:&nbsp;
            <a
              href="https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A52021PC0206"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 hover:text-brand-500"
            >
              EU AI Act auf&nbsp;EUR-LEX
            </a>
            .
          </p>

          <ul className="list-disc pl-5 text-sm gap-4 flex flex-col">
            <li>
              <strong>Risikoklasse</strong> bestimmt, ob ein System
              „verboten“, „hochriskant“, „limitiert“ oder „minimal“ ist.
            </li>
            <li>
              <strong>Anhang IV&nbsp;-Dokumentation</strong> wird bei
              hochriskanten Systemen Pflicht – inkl. Modellbeschreibung,
              Trainingsdaten, Evaluierung &amp; Post-Market-Plan.
            </li>
            <li>
              Transparenz-Hinweise und Logging werden auch für&nbsp;
              <em>limitierte</em> Systeme verlangt.
            </li>
          </ul>
        </div>
      </section>

      {/* ---------- WHAT THE WIZARD DOES ---------- */}
      <section className="section bg-gray-50">
        <div className="section-narrow">
          <h2 className="text-xl font-bold mb-4">
            Was erledigt der&nbsp;AI-Act Risikoassistent ?
          </h2>

          <ul className="list-disc pl-5 text-sm gap-4 flex flex-col mb-6">
            <li>
              10&nbsp;Ja/Nein-Fragen&nbsp;→ <b>automatische Risiko­klasse</b>
            </li>
            <li>
              <b>Pflicht­maßnahmen</b> je Klasse (Transparenz-Hinweis,
              Annex-IV-Dokumentation …)
            </li>
            <li>
              Einen <b>Annex&nbsp;IV-Report als PDF</b> zum Download
            </li>
            <li>
              Gehostet in der&nbsp;EU, <b>DSGVO-konform</b>
            </li>
          </ul>

          <div className="text-center">
            <Link href="/wizard" className="btn text-white">
              Jetzt Risiko prüfen&nbsp;›
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
