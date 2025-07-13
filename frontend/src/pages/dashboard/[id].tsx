// frontend/src/pages/dashboard/[id].tsx
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/router";                     // ← geändert
import {
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";

type ReportFull = {
  id: string;
  created_at: string;
  company_name: string;
  answers: boolean[];
  risk_class: string;
  required_actions: string[];
};

export default function ReportDetail() {
  const router = useRouter();
  const { id } = router.query as { id?: string };           // ← hier kommt die ID her
  const supabase = useSupabaseClient();
  const { session, isLoading } = useSessionContext();

  const [report, setReport] = useState<ReportFull | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;                            // warte auf query
    if (!session && !isLoading) {
      router.replace("/login");
      return;
    }
    if (session && id) {
      supabase
        .from("risk_reports")
        .select("*")
        .eq("id", id)
        .maybeSingle()
        .then(({ data }) => {
          if (!data) {
            router.replace("/dashboard");
          } else {
            setReport(data);
          }
          setLoading(false);
        });
    }
  }, [session, isLoading, supabase, router, id, router.isReady]);

  if (loading || !report) {
    return <p className="p-6">Lade…</p>;
  }

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Report Details</h1>

      <p className="mb-4">
        <b>Firma:</b> {report.company_name}<br />
        <b>Datum:</b> {new Date(report.created_at).toLocaleString()}<br />
        <b>Risikoklasse:</b>{" "}
        <span
          className={
            report.risk_class === "high"
              ? "badge badge-red"
              : report.risk_class === "medium"
              ? "badge badge-yellow"
              : "badge badge-green"
          }
        >
          {report.risk_class}
        </span>
      </p>

      <h2 className="mt-6 mb-2 font-medium">Fragen & Antworten</h2>
      <ul className="list-disc pl-5">
        {report.answers.map((a, i) => (
          <li key={i}>
            Frage {i + 1}: {a ? "Ja" : "Nein"}
          </li>
        ))}
      </ul>

      <h2 className="mt-6 mb-2 font-medium">Empfohlene Maßnahmen</h2>
      <ul className="list-disc pl-5">
        {report.required_actions.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>

      <p className="mt-6 flex gap-4">
        <a
          href={`/api/risk-wizard/pdf?id=${report.id}`}
          className="btn"
        >
          PDF herunterladen
        </a>
        <a
          href="/dashboard"
          className="text-brand-400 hover:text-brand-500 self-center"
        >
          ← zurück zum Dashboard
        </a>
      </p>
    </main>
  );
}
