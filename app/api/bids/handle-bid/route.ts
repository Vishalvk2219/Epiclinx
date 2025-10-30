// Route: Handles updating the bid status (accepted/rejected) and synchronizing the related job status for brand users.

import connectDB from "@/lib/connect-db";
import { verifyToken } from "@/lib/verify-token";
import BidModel from "@/models/Bids";
import JobModel from "@/models/Job";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    await connectDB();

    const decodedJWT = await verifyToken();
    if (!decodedJWT || decodedJWT.role !== "brand") {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const { jobId, bidId, status } = await req.json();

    if (!jobId || !bidId || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const validStatuses = ["accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedBid = await BidModel.findOneAndUpdate(
      { _id: bidId },
      { status },
      { new: true }
    );
    if (!updatedBid) {
      return NextResponse.json(
        { success: false, message: "Bid not found" },
        { status: 404 }
      );
    }

    const jobStatus = { accepted: "Accepted Jobs", rejected: "Rejected Jobs" };
    const updatedJob = await JobModel.findOneAndUpdate(
      { _id: jobId },
      { status: jobStatus[status] },
      { new: true }
    );
    if (!updatedJob) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Status updated successfully",
        bid: updatedBid,
        job: updatedJob,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
