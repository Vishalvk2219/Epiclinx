import User from "@/models/User";
import { NextResponse } from "next/server";
import connectDB from "@/lib/connect-db";

export async function POST(req:Request){
    try{
        connectDB()
        const body = await req.json();
        const user = await User.findOne({email:body.email})
        if (user){
            return NextResponse.json(
                {success:false,error:"User already exists"},
                {status:400}
            )
        }
        const newUser = new User(body)
        await newUser.save()

        return NextResponse.json(
            {success:true,data:newUser},
            {status:201}
        )
        
    }catch(error:any){
        console.log("Error Creating User:",error)
        return NextResponse.json(
            {success:false,error:error.message || "Internal server error"},
            {status:500}
        )
    }
}