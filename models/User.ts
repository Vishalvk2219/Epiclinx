import { OnboardingStatus } from './../stores/useAuthStore';
import mongoose, { Schema, Document } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  role: string
  profileImageUrl?: string
  firstName: string
  lastName: string
  displayName?: string
  email: string
  location?: string
  socials?: {
    instagram?: string
    facebook?: string
    tiktok?: string
    other?: string
  }
  phone?: string
  hearAboutUs?: string
  enableNotifications: boolean
  agreeToTerms: boolean
  categories: string[]
  business?: {
    companyName?: string
    shopAddress?: string
    website?: string
    description?: string
    abn?: string
    accountUsername?: string
  }
  payment?: {
    creditCardNumber?: string
    cvv?: string
    expiryDate?: string
  }
  plan?: string
  currency?: string
  recurring_interval?: string
  trial: number
  password: string
  onboardingToken: string
  OnboardingStatus: number

}

const userSchema = new Schema<IUser>(
  {
    role: { type: String, required: true, enum: ["brand", "creator"] },

    profileImageUrl: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    displayName: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    location: { type: String },

    socials: {
      instagram: { type: String },
      facebook: { type: String },
      tiktok: { type: String },
      other: { type: String },
    },

    phone: { type: String },
    hearAboutUs: { type: String },
    enableNotifications: { type: Boolean, default: false },
    agreeToTerms: { type: Boolean, default: false },
    categories: { type: [String], default: [] },

    business: {
      companyName: { type: String },
      shopAddress: { type: String },
      website: { type: String },
      description: { type: String }, 
      abn: { type: String },
      accountUsername: { type: String },
    },

    payment: {
      creditCardNumber: { type: String, select: false },
      cvv: { type: String, select: false },
      expiryDate: { type: String, select: false },
    },

    plan: { type: String },
    currency: { type: String },
    recurring_interval: { type: String },
    trial: { type: Number, default: 0 },

    password: { type: String, select: false },
    onboardingToken: { type: String, unique: true, sparse: true },
    OnboardingStatus: {type:Number,default:1}

  },
  { timestamps: true }
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.comparePassword = async function (candidatePassword: string){
  if (!this.password) return false
  return bcrypt.compare(candidatePassword , this.password)
}

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema)
export default User
