import connectDB from "@/lib/connect-db";
import User from "@/models/User";
import { NextResponse } from "next/server";


export async function POST(req:Request){
    try{
        connectDB();

        const body = await req.json();
        const {email, stripeCheckoutSessionId, abn=""} = body;

        const user = await User.findOneAndUpdate(
            {email},
            {abn,stripeCheckoutSessionId},
            {new:true}
        )

        if (!user){
            return NextResponse.json(
                {success:false,error:"User Not Found"},
                {status:404}
            )
        }

        return NextResponse.json(
            {success:true, user},
            {status:200}
        )
    }catch(error:any){
        console.log("Legal Info Error...",error.message)
        return NextResponse.json(
            {success:false,error:error.message||"Internal Server Error"},
            {status:500}
        )
    }
}