import connectDB from "@/lib/connect-db";
import { verifyToken } from "@/lib/verify-token";
import JobModel from "@/models/Job";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const payload = await verifyToken();
    const jobData = {
      ...body.data,
      jobType: body.type,
      companyId: payload.id,
    };
    try {
      const newJob = new JobModel(jobData);
      console.log(newJob);
      await newJob.save();

      return NextResponse.json(
        { success: true, message: "Job Created Successfully" },
        { status: 201 }
      );
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: "Unable to post job.Try again later" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
