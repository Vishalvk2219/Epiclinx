import { NextResponse } from "next/server";
import OTP from "@/models/Otp";
import connectDB from "@/lib/connect-db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required." },
        { status: 400 }
      );
    }

    const otpDoc = await OTP.findOne({ email, type: "signup" });
    if (!otpDoc) {
      return NextResponse.json(
        { success: false, message: "OTP not found or expired." },
        { status: 404 }
      );
    }

    if (otpDoc.expiresAt < new Date()) {
      await otpDoc.deleteOne();
      return NextResponse.json(
        {
          success: false,
          message: "OTP has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    const isMatch = await otpDoc.compareOtp(otp);

    if (!isMatch) {
      if (otpDoc.attempts >= 5) {
        await otpDoc.deleteOne();
        return NextResponse.json(
          { success: false, message: "Too many failed attempts. OTP deleted." },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { success: false, message: "Invalid OTP. Please try again." },
        { status: 401 }
      );
    }

    await otpDoc.deleteOne();

    await User.findByIdAndUpdate({email},{emailVerified:true},{new:true})

    return NextResponse.json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error." },
      { status: 500 }
    );
  }
}
