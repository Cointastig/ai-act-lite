// frontend/src/components/RiskWizardForm.tsx
'use client';

import { useState, useEffect } from "react";
import { useSupabaseClient, useSessionContext } from "@supabase/auth-helpers-react";

type Result = {
  risk_class: "minimal" | "medium" | "high";
  required_actions: string[];
};

const questions = [
  "Interagiert Ihr KI-System direkt mit Kindern?",
  "Wird eine biometrische Identifizierung verwendet?",
  "Beeinflusst es die Wähler im politischen Wahlkampf?",
  "Wird es bei Personalentscheidungen am Arbeitsplatz berücksichtigt?",
  "Wird die Kreditwürdigkeit oder das Versicherungsrisiko bewertet?",
  "Erzeugt das System Bilder/Texte, die als echt missverstanden werden könnten?",
  "Erlauben Sie Integrationen von Drittanbietern ohne menschliche Aufsicht?",
  "Können falsche Empfehlungen die Sicherheit gefährden?",
  "Werden personenbezogene Daten ohne Einwilligung verarbeitet?",
  "Haben Sie die Trainingsdaten vollständig unter Kontrolle?",
];

export default function RiskWizardForm() {
  const supabase = useSupabaseClient();
  const { session } = useSessionContext();

  // State für Nutzungszähler & Subscription
  const [usageCount, setUsageCount] = useState<number>(0);
  const [subscription, setSubscription] = useState<{
    status: string;
    current_period_end: string;
  } | null>(null);

  const [answers, setAnswers] = useState<boolean[]>(
    Array(questions.length).fill(false)
  );
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  // 1) Lade Anzahl der Reports der letzten 30 Tage & Subscription-Status
  useEffect(() => {
    if (!session) return;

    // a) Usage-Count
    supabase
      .from("risk_reports")
      .select("*", { head: true, count: "exact" })
      .gte(
        "created_at",
        new Date(new Date().setDate(new Date().getDate() - 30)).toISOString()
      )
      .then(({ count, error }) => {
        if (!error && count !== null) {
          setUsageCount(count);
        }
      });

    // b) Subscription
    supabase
      .from("subscriptions")
      .select("status, current_period_end")
      .eq("user_id", session.user.id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setSubscription(data);
        }
      });
  }, [session, supabase]);

  const toggle = (i: number) => {
    const next = [...answers];
    next[i] = !next[i];
    setAnswers(next);
  };

  const submit = async () => {
    // 2) Paywall-Check: Basic-User bis 3 Reports gratis
    const freeLimit = 3;
    const isActive =
      subscription?.status === "active" &&
      subscription.current_period_end &&
      new Date(subscription.current_period_end) > new Date();

    if (!isActive && usageCount >= freeLimit) {
      // Weiterleitung zur Pricing-Seite
      window.location.href = "/pricing";
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // 3) Anfrage an Backend
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/risk-wizard`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers,
            company_name: company,
            contact_email: email,
          }),
        }
      );
      const json: Result = await res.json();
      setResult(json);

      // 4) Report in Supabase speichern
      if (session) {
        await supabase.from("risk_reports").insert({
          user_id: session.user.id,
          company_name: company,
          answers,
          risk_class: json.risk_class,
          required_actions: json.required_actions,
        });
      }
    } catch (e) {
      console.error(e);
      alert("Fehler bei der Anfrage");
    } finally {
      setLoading(false);
    }
  };

  const badgeClass =
    result?.risk_class === "high"
      ? "badge badge-red"
      : result?.risk_class === "medium"
      ? "badge badge-yellow"
      : "badge badge-green";

  return (
    <div className="container max-w-xl">
      <h1 className="mb-4 text-3xl font-bold">AI-Act Risikoassistent</h1>

      {/* Fragen */}
      <div className="flex flex-col gap-4 mb-6">
        {questions.map((q, i) => (
          <label key={i} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={answers[i]}
              onChange={() => toggle(i)}
            />
            {q}
          </label>
        ))}
      </div>

      {/* Firmendaten */}
      <div className="mb-4">
        <label className="text-sm">Unternehmensname</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="text-sm">Kontakt-E-Mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button
        className="btn w-full disabled:opacity-50"
        disabled={loading}
        onClick={submit}
      >
        {loading ? "Überprüfung …" : "Risiko prüfen"}
      </button>

      {/* Ergebnis */}
      {result && (
        <div className="result-box mt-6">
          <p className="mb-2 flex items-center gap-2">
            <span className={badgeClass}>{result.risk_class}</span>
            Risikoklasse <b>{result.risk_class}</b>
          </p>
          <ul className="list-disc pl-5 text-sm">
            {result.required_actions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
