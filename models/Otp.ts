import { Schema } from "mongoose"
import mongoose from "mongoose"


export interface IOtp extends Document{
    email:string
    otp:string
    type:"signup" | "login" | "reset-password" | "2FA"
    expiresAt:Date
    attempts:number
}

const otpSchema =  new Schema(
    {
        email:{type:String,required:true,lowercase:true,index:true},
        otp:{type:String,required:true},
        type:{type:String, enum:["signup","login","reset-password","2FA"]},
        expiresAt:{type:Date,required:true},
        attempts:{type:Number,default:0}
    },
    {timestamps:true}
)

otpSchema.methods.compareOtp = function(plainOtp:string){
    return this.otp === plainOtp;
}

const OTP = mongoose.models.OTP || mongoose.model<IOtp>("OTP",otpSchema)
export default OTP
