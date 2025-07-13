"use client";

import { useEffect, useState } from "react";
import { useSupabaseClient, useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

type Report = {
  id: string;
  created_at: string;
  company_name: string;
  risk_class: string;
};

export default function DashboardPage() {
  const supabase = useSupabaseClient();
  const { session, isLoading } = useSessionContext();
  const router = useRouter();

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/login");
    } else if (session) {
      // Daten laden
      supabase
        .from("risk_reports")
        .select("id, created_at, company_name, risk_class")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (data) setReports(data);
          setLoading(false);
        });
    }
  }, [session, isLoading, supabase, router]);

  if (!session || loading) {
    return <p className="text-center p-6">Lade…</p>;
  }

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Mein Dashboard</h1>

      {reports.length === 0 ? (
        <p>Du hast noch keine Risiko-Checks durchgeführt.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Datum</th>
              <th className="border px-4 py-2 text-left">Firma</th>
              <th className="border px-4 py-2 text-left">Risikoklasse</th>
              <th className="border px-4 py-2 text-left">Aktion</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">
                  {new Date(r.created_at).toLocaleString()}
                </td>
                <td className="border px-4 py-2">{r.company_name}</td>
                <td className="border px-4 py-2">
                  <span className={`badge ${r.risk_class === "high" ? "badge-red" : r.risk_class === "medium" ? "badge-yellow" : "badge-green"}`}>
                    {r.risk_class}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  <a href={`/dashboard/${r.id}`} className="text-brand-400 hover:text-brand-500">
                    Details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
