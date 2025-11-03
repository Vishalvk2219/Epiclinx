import connectDB from "@/lib/connect-db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const creators = await User.find({ role: "creator" }).select("firstName lastName email");
  const formatted = creators.map((u) => ({
    _id: u._id,
    name: `${u.firstName} ${u.lastName}`.trim(),
    email: u.email,
  }));
  return NextResponse.json({data:formatted});
}
