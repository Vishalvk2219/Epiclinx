import connectDB from "@/lib/connect-db";
import { createJWTtoken } from "@/lib/jwt-token";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    connectDB();
    const body = await req.json();
    const { username, password } = body;
    const user = await User.findOne({email:username});

    const validAuth = user.comparePassword(password);
    if (!validAuth) {
      return NextResponse.json(
        { success: false, error: "Invalid Credentials" },
        { status: 401 }
      );
    }
    const jwtToken = createJWTtoken(user._id, user.email, user.role);
    const response = NextResponse.json(
      { success: true, data: { user: user } },
      { status: 200 }
    );
    response.cookies.set({
      name: "authToken",
      value: jwtToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response
    
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
