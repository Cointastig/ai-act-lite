// frontend/src/pages/api/webhooks/stripe.ts

import { buffer } from "micro";
import Cors from "micro-cors";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const config = { api: { bodyParser: false } };
const cors = Cors({ allowMethods: ["POST", "HEAD"] });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const buf = await buffer(req);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      req.headers["stripe-signature"]!,
      webhookSecret
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userEmail = session.customer_email!;

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", userEmail)
      .single();

    if (error) {
      console.error("Supabase user lookup failed:", error);
    } else {
      const { error: dbErr } = await supabaseAdmin
        .from("subscriptions")
        .insert({
          user_id: user.id,
          stripe_subscription_id: session.subscription as string,
          status: session.payment_status,
          current_period_end: new Date(session.expires_at! * 1000).toISOString(),
        });
      if (dbErr) console.error("Subscription insert error:", dbErr);
    }
  }

  res.status(200).json({ received: true });
};

export default cors(handler as any);
