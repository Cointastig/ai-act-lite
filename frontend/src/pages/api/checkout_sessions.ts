// frontend/src/pages/api/checkout_sessions.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1) Supabase-Server-Client aus req/res erzeugen
  const supabase = createServerSupabaseClient({ req, res });

  // 2) Aktuellen User abrufen
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // 3) Welchen Plan der User anfragt
  const { plan } = req.body as { plan: "basic" | "pro" };
  const priceId =
    plan === "pro"
      ? process.env.STRIPE_PRICE_ID_PRO!
      : process.env.STRIPE_PRICE_ID_BASIC!;

  // 4) Checkout-Session bei Stripe anlegen
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email!,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?session=cancel`,
    });
    return res.status(200).json({ sessionId: session.id });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
