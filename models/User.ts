import { OnboardingStatus } from "./../stores/useAuthStore";
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  role: string;
  profileImageUrl?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  username?: string;
  email: string;
  location?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  otherSocial?: string;
  phone?: string;
  hearAboutUs?: string;
  enableNotifications: boolean;
  agreeToTerms: boolean;
  categories: string[];
  companyName?: string;
  shopAddress?: string;
  businessWebsite?: string;
  businessDescription?: string;
  abn?: string;
  stripeCheckoutSessionId?: string;
  creditCardNumber?: string;
  cvv?: string;
  expiryDate?: string;
  plan?: string;
  currency?: string;
  recurring_interval?: string;
  trial: number;
  password: string;
  onboardingToken: string;
  OnboardingStatus: number;
}

const userSchema = new Schema<IUser>(
  {
    role: { type: String, required: true, enum: ["brand", "creator"] },

    profileImageUrl: { type: String },
    firstName: { type: String},
    lastName: { type: String},
    displayName: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    location: { type: String },

    instagram: { type: String },
    facebook: { type: String },
    tiktok: { type: String },
    otherSocial: { type: String },

    phone: { type: String },
    hearAboutUs: { type: String },
    enableNotifications: { type: Boolean, default: false },
    agreeToTerms: { type: Boolean, default: false },
    categories: { type: [String], default: [] },

    companyName: { type: String },
    shopAddress: { type: String },
    businessWebsite: { type: String },
    businessDescription: { type: String },
    abn: { type: String },
    username: { type: String },
    stripeCheckoutSessionId: { type: String, select: false },
    creditCardNumber: { type: String, select: false },
    cvv: { type: String, select: false },
    expiryDate: { type: String, select: false },

    plan: { type: String },
    currency: { type: String },
    recurring_interval: { type: String },
    trial: { type: Number, default: 0 },

    password: { type: String, select: false },
    OnboardingStatus: { type: Number, default: 1 },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
