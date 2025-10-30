import connectDB from "@/lib/connect-db";
import subscriptionModel from "@/models/Subscription";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const planPrices: Record<string, number> = {
  nano: 500,
  micro: 1500,
  macro: 2500,
  mega: 5000,
  small: 3000,
  medium: 6000,
  large: 10000,
};

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, plan, currency, recurring_interval, trial } = body;
    const amount = planPrices[plan];

    const existingSub = await subscriptionModel
      .findOne({ email })
      .sort({ createdAt: -1 });

    if (existingSub && existingSub.status === "Paid") {
      return NextResponse.json(
        { success: false, error: "Conflict", message: "Payment already completed" },
        { status: 200 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency,
            recurring: { interval: recurring_interval },
            product_data: { name: plan },
            unit_amount: Math.round(amount),
          },
          quantity: 1,
        },
      ],
      ...(trial && { subscription_data: { trial_period_days: 7 } }),
      metadata: { plan, email },
      ui_mode: "custom",
    });

    if (existingSub) {
      existingSub.plan = plan;
      existingSub.currency = currency;
      existingSub.recurringInterval = recurring_interval;
      existingSub.trial = trial;
      existingSub.sessionClientSecret = session.client_secret;
      existingSub.status = "Pending";
      await existingSub.save();
    } else {
      await subscriptionModel.create({
        email,
        plan,
        currency,
        recurringInterval: recurring_interval,
        trial,
        status: "Pending",
        sessionClientSecret: session.client_secret,
      });
    }

    return NextResponse.json(
      { success: true, checkoutSessionClientSecret: session.client_secret },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
