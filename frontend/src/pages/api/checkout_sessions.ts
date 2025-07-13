// frontend/pages/api/checkout_sessions.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "@supabase/auth-helpers-nextjs";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user } = await getUser({ req, res });
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const priceId =
    req.body.plan === "pro"
      ? process.env.STRIPE_PRICE_ID_PRO!
      : process.env.STRIPE_PRICE_ID_BASIC!;

  const session = await stripe.checkout.sessions.create({
    customer_email: user.email!,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?session=cancel`,
  });

  res.status(200).json({ sessionId: session.id });
}
