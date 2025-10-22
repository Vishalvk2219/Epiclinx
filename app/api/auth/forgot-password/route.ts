import { createJWTtoken } from "@/lib/jwt-token"
import { sendMail } from "@/lib/send-mail"
import User from "@/models/User"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

export async function POST(req:Request){
    try{
        const body = await req.json()
        const {email} = body
        const user = User.findOne({email})
        if (!user){
            return NextResponse.json(
                {success:false,error:"User is not Registered.Create a Account"},
                {status:404}
            )
        }
        const resetToken = createJWTtoken("reset",email,"unknown")
        const resetUrl = redirect(`${process.env.FRONTEND_URL}/reset-password/${resetToken}`)
        const mailOptions = {
            to:email,
            subject:"Reset Password Link Epiclinx",
            html:`<h1> RESET PASSWORD LINK </h1>\n <p>Link to reset your password is given below ${resetUrl}</p>\n\n<p>Ignore if you have not requested.</p>`
        }
        await sendMail(mailOptions)
        return NextResponse.json(
            {success:true, message:"Password Reset Link Send Successfully"},
            {status:200}
        )

    }catch(error:any){
        return NextResponse.json(
            {success:false,error:error.message || "Internal server error"},
            {status:500}
        )
    }
}