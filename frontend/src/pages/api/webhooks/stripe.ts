// frontend/pages/api/webhooks/stripe.ts
import { buffer } from "micro";
import Cors from "micro-cors";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const cors = Cors({ allowMethods: ["POST", "HEAD"] });

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const subscriptionId = session.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const email = session.customer_email!;

    // Benutzer via Email finden
    const { data: user, error: userErr } = await supabaseAdmin
      .from("users") // falls custom users-Tabelle; sonst auth.users via REST
      .select("id")
      .eq("email", email)
      .single();
    if (userErr || !user) {
      console.error("User not found in Supabase:", userErr);
    } else {
      // Subscription eintragen
      const { error: dbErr } = await supabaseAdmin
        .from("subscriptions")
        .upsert({
          user_id: user.id,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          current_period_end: new Date(
            subscription.current_period_end! * 1000
          ).toISOString(),
        });
      if (dbErr) console.error("Subscription insert error:", dbErr);
    }
  }

  res.status(200).json({ received: true });
};

export default cors(handler as any);
