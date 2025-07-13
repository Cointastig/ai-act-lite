// frontend/src/pages/pricing.tsx
'use client';

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSupabaseClient, useSessionContext } from "@supabase/auth-helpers-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PricingPage() {
  const supabase = useSupabaseClient();
  const { session } = useSessionContext();
  const [loading, setLoading] = useState(false);

  const redirectToCheckout = async (plan: "basic" | "pro") => {
    if (!session) return alert("Bitte zuerst einloggen.");
    setLoading(true);
    const res = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const { sessionId } = await res.json();
    const stripe = await stripePromise;
    await stripe!.redirectToCheckout({ sessionId });
  };

  return (
    <main className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Preise & Pläne</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic (free tier) */}
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold">Basic</h2>
          <p className="mt-2">3 Reports/Monat gratis</p>
          <button
            className="btn mt-4"
            onClick={() => redirectToCheckout("basic")}
            disabled={loading}
          >
            Gratis starten
          </button>
        </div>

        {/* Pro */}
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold">Pro</h2>
          <p className="mt-2">Unbegrenzte Reports</p>
          <p className="mt-1 font-bold">€29 / Monat</p>
          <button
            className="btn mt-4"
            onClick={() => redirectToCheckout("pro")}
            disabled={loading}
          >
            Jetzt abonnieren
          </button>
        </div>
      </div>
    </main>
  );
}
