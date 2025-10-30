import User from "@/models/User";
import { NextResponse } from "next/server";
import connectDB from "@/lib/connect-db";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      profileImageUrl,
      firstName,
      lastName,
      email,
      phone,
      displayName,
      location,
      instagram,
      facebook,
      tiktok,
      otherSocial,
      categories,
      companyName,
      shopAddress,
      businessWebsite,
      businessDescription,
      role,
      followers,
    } = body;

    const payload = {
      profileImageUrl,
      firstName,
      lastName,
      email,
      phone,
      displayName,
      location,
      instagram,
      facebook,
      tiktok,
      otherSocial,
      categories,
      companyName,
      shopAddress,
      businessWebsite,
      businessDescription,
      role,
      followers,
    };

    const user = await User.findOne({ email });
    const auth = true;

    if (user) {
      if (!auth) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 403 }
        );
      }

      Object.keys(payload).forEach((key) => {
        if (payload[key as keyof typeof payload] !== undefined) {
          user[key] = payload[key as keyof typeof payload];
        }
      });

      await user.save();

      return NextResponse.json({ success: true, user }, { status: 200 });
    }

    const newUser = new User(payload);
    await newUser.save();

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error: any) {
    console.error("Error Creating User:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
