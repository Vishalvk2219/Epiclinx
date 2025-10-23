import { verifyToken } from "@/lib/verify-token";
import BidModel from "@/models/Bids";
import JobModel from "@/models/Job";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Job ID is required" },
        { status: 400 }
      );
    }

    const decodedJWT = await verifyToken();
    if (!decodedJWT) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const job = await JobModel.findById(id).populate(
      "companyId",
      "profileImageUrl companyName"
    );

    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    let bid;
    const creatorBid = await BidModel.findOne({creatorId:decodedJWT.id,jobId:id})
    if (creatorBid){
      bid = creatorBid ? creatorBid : null;
    }
    return NextResponse.json({ success: true, job, bid}, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
