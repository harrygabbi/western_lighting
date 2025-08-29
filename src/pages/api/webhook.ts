// src/pages/api/webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import getRawBody from "raw-body";
import { prisma } from "@/lib/prisma";

export const config = {
  api: { bodyParser: false }, // we need the raw body to verify signature
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const sig = req.headers["stripe-signature"];
  if (!sig) return res.status(400).send("Missing stripe-signature header");

  const buf = await getRawBody(req);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Retrieve the session with line items expanded so we know what was purchased
      const full = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "payment_intent", "customer"],
      });

      const lineItems = full.line_items?.data ?? [];
      const email =
        full.customer_details?.email ||
        (typeof full.customer === "string" ? undefined : full.customer?.email) ||
        full.customer_email ||
        null;

      // Create Order
      const order = await prisma.order.create({
        data: {
          stripeSessionId: full.id,
          email: email ?? undefined,
          amountTotal: full.amount_total ?? 0,
          currency: (full.currency || "cad").toUpperCase(),
          items: {
            create: lineItems.map((li) => ({
              productName:
                (li.price?.product as any)?.name || li.description || "Item",
              unitAmount: li.price?.unit_amount ?? 0,
              quantity: li.quantity ?? 1,
            })),
          },
        },
      });

      for (const li of lineItems) {
        if (li.price?.product && typeof li.price.product === "string") {
          // we only have product id string from Stripe price
          // safer to match by name or description for now
          await prisma.product.updateMany({
            where: { name: li.description }, // or slug if you stored that in Stripe metadata
            data: {
              quantity: { decrement: li.quantity ?? 1 },
            },
          });
        }
      }

      await prisma.product.updateMany({
        where: { quantity: { lte: 0 } },
        data: { inStock: false },
      });

      console.log("Saved order:", order.id);
    }

    // Acknowledge receipt of the event
    return res.status(200).json({ received: true });
  } catch (e) {
    console.error("Webhook handler error:", e);
    return res.status(500).send("Server error");
  }
}
