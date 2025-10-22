import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectDB from "@/lib/connect-db";

export async function GET(req: Request) {
  try {
    await connectDB();
    const authHeader = req.headers.get("authorization") || "";
    const tokenFromHeader = authHeader?.split(" ")[1] || null;

    let token = tokenFromHeader;
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("authToken")?.value || null;
    }
    if (!token) {
      return NextResponse.json(
        { status: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: payload.email });

    if (!user) {
      return NextResponse.json(
        { success: true, error: "User not Found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, user},
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: true, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await User.findOne({ email: body.email });
    Object.assign(user, body);
    user.save();

    return NextResponse.json(
      { success: true, user },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
