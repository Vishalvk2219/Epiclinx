import User from "@/models/User";
import { NextResponse } from "next/server";
import connectDB from "@/lib/connect-db";

export async function POST(req:Request){
    try{
        connectDB()
        const body = await req.json();
        console.log(body)
        const user = await User.findOne({email:body.email})
        console.log(user)
        const auth = true // temporary condition should be replaced with a auth token
        if (user){
            if (auth){
                Object.assign(user,body)
                await user.save()

                return NextResponse.json(
                    {success:true,data:{user:user}},
                    {status:200}
                )
            }
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