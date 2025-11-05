import { verifyToken } from "@/lib/verify-token";
import { NextResponse } from "next/server";
import BidModel from "@/models/Bids";
import JobModel from "@/models/Job";

export async function GET(req: Request) {
  try {
    const decodedJWT = await verifyToken();
    if (!decodedJWT) {
      return NextResponse.json(
        { success: false, error: "Action not allowed by unregistered user" },
        { status: 401 }
      );
    }
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("id");
    if (!jobId) {
      return NextResponse.json(
        { success: false, message: "Invalid request Job Id required" },
        { status: 403 }
      );
    }
    const bids = await BidModel.find({ jobId: jobId }).populate("creatorId");
    return NextResponse.json({ success: true, bids }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jobId, proposal, offerAmount } = body;
    console.log(body)
    const decodedJWT = await verifyToken();
    if (!decodedJWT) {
      return NextResponse.json(
        { success: false, error: "Action not allowed by unregistered user" },
        { status: 401 }
      );
    }
    const job = await JobModel.findById(jobId)
    console.log(job)

    let newBid;
    if (job.offerType === "bid"){
      newBid = await BidModel.create({
      jobId,
      amount: offerAmount,
      proposal,
      creatorId: decodedJWT.id,
      offerType:job.offerType
    });
    }
    else{
      newBid = await BidModel.create({
      jobId,
      proposal,
      creatorId: decodedJWT.id,
      offerType:job.offerType
    });
    }
    

    await JobModel.findOneAndUpdate(
      { _id: jobId },
      { $push: { bids: newBid._id }},
      { new: true }
    );
    return NextResponse.json(
      {
        success: true,
        bid: newBid,
        message: "Your bid has been submitted Successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
