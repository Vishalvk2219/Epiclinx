import subscriptionModel from "@/models/Subscription";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { email, stripeSessionId } = body;

    if (!email || !stripeSessionId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    const latestSubscription = await subscriptionModel
      .findOne({ email })
      .sort({ createdAt: -1 });

    if (!latestSubscription) {
      return NextResponse.json(
        { success: false, message: "No subscription found for this email." },
        { status: 404 }
      );
    }

    latestSubscription.stripeSessionId = stripeSessionId;
    latestSubscription.status = "Paid";
    await latestSubscription.save();

    return NextResponse.json(
      { success: true, subscriptionId: latestSubscription._id },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Payment Error" },
      { status: 500 }
    );
  }
}
