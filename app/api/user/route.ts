import User from "@/models/User"
import { NextResponse } from "next/server"


export async function POST(req:Request){
    try{
        const body = await req.json()
        const user = await User.findOne({email:body.email})
        Object.assign(user,body)
        user.save()

        return NextResponse.json(
            {success:true,data:{user:user}},
            {status:201}
        )
    }catch(error:any){
        return NextResponse.json(
            {success:false,error:error.message || "Internal server error"},
            {status:500}
        )
    }
}