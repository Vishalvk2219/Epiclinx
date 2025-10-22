import connectDB from "@/lib/connect-db";
import User from "@/models/User";
import { NextResponse } from "next/server";


export async function POST(req:Request){
    try{
        connectDB()
        const body = await req.json();
        const {email, username, password} = body;

        if(!email || !username || !password){
            return NextResponse.json(
                {success:false,error:"Invalid or Missing Details "},
                {status:400}
            )
        }
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json(
                {success:false,error:"User Not Found"},
                {status:404}
            )
        }
        user.username = username
        user.password = password
        await user.save()

        return NextResponse.json(
            {success:true, user},
            {status:200}
        )
    }catch(error:any){
        return NextResponse.json(
            {success:false,error:error.message||"Internal server error"},
            {status:500}
        )
    }
}