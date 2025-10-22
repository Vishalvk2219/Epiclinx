import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("authToken")?.value;
    const payload = jwt.verify(token,process.env.JWT_SECRET)
    const role = payload.role
    const redirectTo = req.nextUrl.searchParams.get("redirectTo") || ""

    if (
      (redirectTo.startsWith("/dashboard/brand") && role === "brand") ||
      (redirectTo.startsWith("/dashboard/creator") && role === "creator")
    ){
        return NextResponse.json(
            {success:true, message:"success"},
            {status:200}
        )
    }

    return NextResponse.json(
        {success:false,error:"Unauthorized Access"},
        {status:401}
    )
  } catch (error: any) {
    return NextResponse.json(
        {success:false,error:error.message || "Interval Server Error"},
        {status:500}
    );
  }
}
