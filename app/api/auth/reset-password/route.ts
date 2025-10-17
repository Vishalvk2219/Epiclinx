import User from "@/models/User"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export async function POST(req:Request){
    try{
        const body = await req.json()
        const {token, password} = body
        
        const validToken = jwt.verify(token,process.env.JWT_SECRET)
        if (!validToken){
            return NextResponse.json(
                {success:false,error:"Unauthorized Invalid token"},
                {status:401}
            )
        }
        const user = await User.findOne({email:validToken.email})
        user.password =  password
        user.save()

        return NextResponse.json(
            {success:true,data:{message:"Password Changed Successfully"}},
            {status:200}
        )
    }catch(error:any){
        return NextResponse.json(
            {success:false,error:error.message || "Internal server error"},
            {status:500}
        )
    }
}