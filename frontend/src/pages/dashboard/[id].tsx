"use client";

import { useEffect, useState } from "react";
import { useSupabaseClient, useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter, useParams } from "next/navigation";

type ReportFull = {
  id: string;
  created_at: string;
  company_name: string;
  answers: boolean[];
  risk_class: string;
  required_actions: string[];
};

export default function ReportDetail() {
  const supabase = useSupabaseClient();
  const { session, isLoading } = useSessionContext();
  const router = useRouter();
  const { id } = useParams();

  const [report, setReport] = useState<ReportFull | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !session) router.push("/login");
    else if (session && id) {
      supabase
        .from("risk_reports")
        .select("*")
        .eq("id", id)
        .maybeSingle()
        .then(({ data }) => {
          if (!data) router.push("/dashboard");
          else setReport(data);
          setLoading(false);
        });
    }
  }, [session, isLoading, supabase, router, id]);

  if (loading || !report) return <p className="p-6">Lade…</p>;

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Report Details</h1>
      <p>
        <b>Firma:</b> {report.company_name}<br/>
        <b>Datum:</b> {new Date(report.created_at).toLocaleString()}<br/>
        <b>Risikoklasse:</b>{" "}
        <span className={`badge ${report.risk_class === "high" ? "badge-red" : report.risk_class === "medium" ? "badge-yellow" : "badge-green"}`}>
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

      <p className="mt-6">
        <a href={`/api/risk-wizard/pdf?id=${report.id}`} className="btn">
          PDF herunterladen
        </a>
        <span className="ml-4 text-sm">
          <a href="/dashboard" className="text-brand-400 hover:text-brand-500">
            ← zurück zum Dashboard
          </a>
        </span>
      </p>
    </main>
  );
}
