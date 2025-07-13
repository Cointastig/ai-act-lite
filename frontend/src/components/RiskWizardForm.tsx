import { useState } from "react";

type RiskResult = {
  risk_class: "minimal" | "medium" | "high";
  required_actions: string[];
};

const questions = [
  "Interagiert Ihr KI-System direkt mit Kindern?",
  "Wird eine biometrische Identifizierung verwendet?",
  "Beeinflusst das System Wähler in politischen Kampagnen?",
  "Wird es bei Personalentscheidungen im Unternehmen eingesetzt?",
  "Bewertet es Kreditwürdigkeit oder Versicherungsrisiko?",
  "Erzeugt das System Bilder/Texte, die als echt missverstanden werden könnten?",
  "Erlauben Sie Integrationen von Drittanbietern ohne menschliche Aufsicht?",
  "Könnten falsche Empfehlungen die Sicherheit gefährden?",
  "Werden personenbezogene Daten ohne Einwilligung verarbeitet?",
  "Haben Sie die Trainingsdaten vollständig unter Kontrolle?",
];

export default function RiskWizardForm() {
  const [answers, setAnswers] = useState<boolean[]>(
    Array(questions.length).fill(false)
  );
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskResult | null>(null);

  // Basis-URL aus .env oder Fallback
  const apiBase =
    (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "") ||
    "https://ai-act-lite-api.onrender.com/api";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await fetch(`${apiBase}/risk-wizard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers,
        company_name: company,
        contact_email: email,
      }),
    });

    if (!res.ok) {
      alert(`API-Fehler ${res.status}`);
      setLoading(false);
      return;
    }

    const data: RiskResult = await res.json();
    setResult(data);
    setLoading(false);
  }

  // === UI ===
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Checkbox-Fragen */}
      {questions.map((q, i) => (
        <label key={i} className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300"
            checked={answers[i]}
            onChange={(e) => {
              const next = [...answers];
              next[i] = e.target.checked;
              setAnswers(next);
            }}
          />
          {q}
        </label>
      ))}

      {/* Firmendaten */}
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Firmenname"
          className="rounded border px-3 py-2"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Kontakt-E-Mail"
          className="rounded border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Submit-Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Überprüfung…" : "Risiko prüfen"}
      </button>

      {/* Ergebnisbox & PDF-Button */}
      {result && (
        <div className="rounded border border-gray-200 bg-gray-50 p-4">
          <p className="mb-2 text-lg font-semibold">
            Risikoklasse:{" "}
            <span
              className={
                result.risk_class === "minimal"
                  ? "text-green-600"
                  : result.risk_class === "medium"
                  ? "text-yellow-600"
                  : "text-red-600"
              }
            >
              {result.risk_class === "minimal"
                ? "minimal"
                : result.risk_class === "medium"
                ? "mittel"
                : "hoch"}
            </span>
          </p>

          {result.required_actions.length > 0 ? (
            <>
              <p className="text-sm font-medium">Nächste Schritte:</p>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {result.required_actions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-gray-600">
              Keine sofortigen Maßnahmen erforderlich.
            </p>
          )}

          {/* PDF-Download */}
          <button
            type="button"
            onClick={async () => {
              const res = await fetch(`${apiBase}/pdf`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  company_name: company,
                  risk_class: result.risk_class,
                  required_actions: result.required_actions,
                }),
              });
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "Annex-IV-Report.pdf";
              a.click();
              window.URL.revokeObjectURL(url);
            }}
            className="mt-4 w-full rounded border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
          >
            PDF herunterladen
          </button>
        </div>
      )}
    </form>
  );
}
