import bcrypt from "bcryptjs";
import mongoose, { Schema, Document, Model } from "mongoose";
import { boolean } from "zod";

export interface IOtp extends Document {
  email: string;
  otp: string;
  type: "signup" | "login" | "reset-password" | "2FA";
  expiresAt: Date;
  attempts: number;
  EmailVerified:boolean;
  compareOtp(plainOtp: string): Promise<boolean>;
}

const otpSchema = new Schema<IOtp>(
  {
    email: { type: String, required: true, lowercase: true, index: true },
    otp: { type: String, required: true },
    type: {
      type: String,
      enum: ["signup", "login", "reset-password", "2FA"],
      required: true,
    },
    EmailVerified:{type:Boolean,default:false},
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
    },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

otpSchema.pre("save", async function (next) {
  if (!this.isModified("otp")) return next();
  this.otp = await bcrypt.hash(this.otp, 10);
  next();
});

otpSchema.methods.compareOtp = async function (plainOtp: string) {
  await this.updateOne({ $inc: { attempts: 1 } });
  return bcrypt.compare(plainOtp, this.otp);
};

const OTP: Model<IOtp> =
  mongoose.models.OTP || mongoose.model<IOtp>("OTP", otpSchema);
export default OTP;
