import { verifyToken } from "@/lib/verify-token";
import JobModel from "@/models/Job";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const decoded:any = await verifyToken();
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access or invalid token" },
        { status: 401 }
      );
    }

    let jobs;

    if (decoded.role === "brand") {
      jobs = await JobModel.find({ companyId: decoded.id }).populate(
        "companyId",
        "profileImageUrl companyName"
      );
    } else if (decoded.role === "creator") {
      jobs = await JobModel.find({status:"Pending Applications"}).sort({createdAt:-1}).populate(
        "companyId",
        "profileImageUrl companyName selectedContentTypes"
      );
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid user role" },
        { status: 403 }
      );
    }

    if (!jobs || jobs.length === 0) {
      return NextResponse.json(
        { success: true, jobs: [], message: "No jobs found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, jobs }, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


