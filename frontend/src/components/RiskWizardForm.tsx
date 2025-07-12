import { useState } from "react";

const questions = [
  "Does your AI system interact directly with children?",
  "Is biometric identification used?",
  "Does it influence voters in political campaigns?",
  "Is it employed in workplace HR decisions?",
  "Does it evaluate creditworthiness or insurance risk?",
  "Does the system generate images/text that could be mistaken as authentic?",
  "Do you allow third‑party integrations with no human oversight?",
  "Could wrong recommendations endanger safety?",
  "Is personal data processed without consent?",
  "Is the training data fully under your control?",
];

export default function RiskWizardForm() {
  const [answers, setAnswers] = useState<boolean[]>(Array(10).fill(false));
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{ risk_class: string; required_actions: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${apiBase}/risk-wizard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, company_name: company, contact_email: email }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        {questions.map((q, i) => (
          <label key={i} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={answers[i]}
              onChange={() => {
                const copy = [...answers];
                copy[i] = !copy[i];
                setAnswers(copy);
              }}
            />
            {q}
          </label>
        ))}
      </div>

      <input
        type="text"
        placeholder="Company name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="w-full rounded border p-2"
        required
      />
      <input
        type="email"
        placeholder="Contact e‑mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded border p-2"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Checking…" : "Check risk"}
      </button>

      {result && (
        <div className="rounded-xl border p-4 shadow-sm">
          <p className="mb-2 text-lg font-semibold">
            Risk class: <span className={result.risk_class === "minimal" ? "text-green-600" : result.risk_class === "medium" ? "text-yellow-600" : "text-red-600"}>{result.risk_class}</span>
          </p>
          {result.required_actions.length > 0 ? (
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {result.required_actions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No immediate actions required.</p>
          )}
        </div>
      )}
    </form>
  );
}
