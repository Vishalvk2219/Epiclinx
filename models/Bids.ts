import { Schema, model, models, Types, Document } from "mongoose";

export interface IBid extends Document {
  jobId: Types.ObjectId;
  creatorId: Types.ObjectId;
  amount: number;
  proposal: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

const BidSchema = new Schema<IBid>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    proposal: { type: String, required: false },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const BidModel = models.Bid || model<IBid>("Bid", BidSchema);
export default BidModel;
