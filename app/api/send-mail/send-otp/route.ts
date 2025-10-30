import { sendMail } from "@/lib/send-mail";
import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import OTP from "@/models/Otp";
import connectDB from "@/lib/connect-db";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const existingOtp = await OTP.findOne({ email, type: "signup" });
    if (
      existingOtp &&
      existingOtp.createdAt > new Date(Date.now() - 60 * 1000)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please wait 1 minute before requesting another OTP.",
        },
        { status: 429 }
      );
    }

    await OTP.deleteMany({ email, type: "signup" });

    const otp = randomInt(100000, 1000000).toString();

    await OTP.create({
      email,
      otp,
      type: "signup",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendMail({
      to: email,
      subject: "Your EpicLinx Email Verification Code",
      html: `
        <div style="font-family:Arial,sans-serif;padding:16px;">
          <h2>Welcome to EpicLinx 👋</h2>
          <p>Use the code below to verify your email:</p>
          <h1 style="color:#4F46E5;letter-spacing:2px;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json(
      { success: true, message: "OTP sent successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error sending OTP" },
      { status: 500 }
    );
  }
}
