import User from "@/models/User";
import { NextResponse } from "next/server";
import connectDB from "@/lib/connect-db";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      const creators = await User.find({ role: "creator" });
      return NextResponse.json(
        { success: true, creators },
        { status: 200 }
      );
    } else {
      console.log(id)
      const creator = await User.findById(id);

      if (!creator) {
        return NextResponse.json(
          { success: false, error: "Creator not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: true, creator },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}