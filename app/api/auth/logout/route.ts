import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const response = NextResponse.json(
    { success: true, message: "Logged out Successfully" },
    { status: 200 }
  );
  response.cookies.set({
    name: "authToken",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
