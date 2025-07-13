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
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { plan } = req.body as { plan: string };
  const priceId = plan === "pro" ? process.env.STRIPE_PRICE_PRO! : process.env.STRIPE_PRICE_FREE!;
  const customerEmail = session.user.email!;

  try {
    const stripeSession = await stripe.checkout.sessions.create({
      customer_email: customerEmail,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?session=cancel`,
    });
    return res.status(200).json({ sessionId: stripeSession.id });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
