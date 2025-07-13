import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* Hero-Sektion */}
      <section className="section bg-gray-50">
        <div className="section-narrow text-center">
          <h1 className="text-3xl font-bold mb-4">
            AI-Act paperwork solved in&nbsp;30 minutes
          </h1>
          <p className="text-xl mb-6">
            Generate EU-compliant risk report &amp; technical docs for your GPT-powered feature&nbsp;— before the fines hit.
          </p>
          <Link href="/wizard" className="btn text-white">
            Start free
          </Link>
        </div>
      </section>

      {/* Zusatzinfo */}
      <section className="section">
        <div className="section-narrow">
          <h2 className="text-xl font-bold mb-4">Was macht der Risikoassistent ?</h2>
          <ul className="list-disc pl-5 text-sm gap-4 flex flex-col">
            <li>10 Ja/Nein-Fragen → <b>Risiko­klasse</b> nach AI-Act-Entwurf</li>
            <li>Empfohlene <b>Pflichtmaßnahmen</b> pro Klasse</li>
            <li>PDF-Report (Annex IV-Ready) zum Herunterladen</li>
            <li>Hosted in der&nbsp;EU, DSGVO-konforme Datenverarbeitung</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
