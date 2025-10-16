import connectDB from "@/lib/connect-db";
import { NextResponse } from "next/server";
import Stripe from "stripe"

const planPrices:Record<string,number> = {
    nano:500,
    micro:1500,
    macro:2500,
    mega:5000,
    small:3000,
    medium:6000,
    large:10000
}

export async function POST(req:Request){
    try{
        const body = await req.json();
        const {email,plan,currency,recurring_interval,trial} = body
        const amount = planPrices[plan]

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
        const session = await stripe.checkout.sessions.create(
            {
                mode:"subscription",
                payment_method_types: ["card"],
                customer_email:email,
                line_items:
                [
                    {
                        price_data:
                        {
                            currency,
                            recurring:{interval:recurring_interval},
                            product_data:{name:plan},
                            unit_amount:Math.round(amount)
                        },
                        quantity:1
                    }
                ],
                ...(trial && 
                    {subscription_data:{trail_period_days:7}}
                ),
                metadata:{plan,email},
                ui_mode:"custom"
            }
        )

        return NextResponse.json(
            {success:true,data:{checkoutSessionClientSecret:session.client_secret}},
            {status:200}
        )
    }catch(error:any){
        console.log("Error creating checkout session")
        return NextResponse.json(
            {success:false,error:error.message||"Internal Server Error"},
            {status:500}
        )
    }
}