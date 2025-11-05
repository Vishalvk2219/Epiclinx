import { OfferType } from './../lib/types';
import { Schema, model, models, Types, Document } from "mongoose";

export interface IBid extends Document {
  jobId: Types.ObjectId;
  creatorId: Types.ObjectId;
  amount: number;
  proposal: string;
  status: "Pending" | "Accepted" | "Rejected";
  offerType:"bid" | "fixed"
}

const BidSchema = new Schema<IBid>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number},
    proposal: { type: String, required: false },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    offerType:{type:String}
  },
  { timestamps: true }
);

const BidModel = models.Bids || model<IBid>("Bids", BidSchema);
export default BidModel;
