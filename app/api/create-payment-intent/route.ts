import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { amount, currency = "mad", listingTitle, guestName } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
    }

    // Stripe uses smallest currency unit (centimes)
    // For MAD we use EUR equivalent since Stripe doesn't support MAD
    // We convert: 1 EUR ≈ 10.8 MAD
    const amountInCents = Math.round((amount / 10.8) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "eur",
      description: `Rachra.com — ${listingTitle || "Réservation"}`,
      metadata: {
        listing: listingTitle || "",
        guest: guestName || "",
        amountMAD: String(amount),
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: "Erreur paiement" }, { status: 500 });
  }
}
