// src/pages/api/checkout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { items } = req.body as {
    items: { name: string; price: number; quantity: number }[];
  };

  try {
    const line_items = items.map((item) => ({
      price_data: {
        currency: 'cad',
        product_data: {
          name: item.name,
          metadata: {
            slug: item.slug, // 👈 used by webhook
          }},
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cart`,
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe session error:', err);
    res.status(500).json({ error: 'Unable to create checkout session' });
  }
}
