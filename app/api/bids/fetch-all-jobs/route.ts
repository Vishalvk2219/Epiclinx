import { verifyToken } from "@/lib/verify-token";
import BidModel from "@/models/Bids";
import { NextResponse } from "next/server";
import connectDB from "@/lib/connect-db";

export async function GET(req:Request){
    try{
        await connectDB();
        const decodedJWT = await verifyToken();
        const allApplications = await BidModel.find({creatorId:decodedJWT.id}).populate({
        path: "jobId",
        populate: {
          path: "companyId",
          select: "companyName profileImageUrl", 
        }})

        return NextResponse.json(
            {success:true,allApplications},
            {status:200}
        )
    }catch(error:any){
        return NextResponse.json(
            {success:false,error:error.message || "Internal server Error"},
            {status:500}
        )
    }
}