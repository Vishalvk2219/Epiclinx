import { Schema, model, Document, models, Types } from "mongoose";

export interface IJob extends Document {
  campaignImageUrl:string
  campaignName: string;
  campaignBrief: string;
  campaignGoal: string;
  requirements: string;
  captionGuidelines: string;
  tagUs: string;
  keepItAuthentic: string;
  dontDo: string;
  budget: string;
  location: string;
  campaignDuration: string;
  postDeadline: string;
  multipleCreators: boolean;
  agreeToTerms: boolean;
  contentApproval: boolean;
  allowShowcase: boolean;
  taskType: string;
  collaborationType: string;
  paymentType: string;
  followerSize: string;
  totalPayment: string | number;
  selectedPlatforms: string[];
  selectedContentTypes: string[];
  hashtags: string[];
  offerType: string;
  jobType: string;
  companyId:Types.ObjectId;
  status:string;
  applicants:Types.ObjectId[];
  bids:Types.ObjectId[];
  icon:string;
  niche:string[];
  contentType:string;
}

const JobSchema = new Schema<IJob>(
  {
    campaignImageUrl:{type:String},
    campaignName: { type: String, required: true },
    campaignBrief: { type: String, required: true },
    campaignGoal: { type: String, required: true },
    requirements: { type: String, required: true },
    captionGuidelines: { type: String, required: true },
    tagUs: { type: String, required: true },
    keepItAuthentic: { type: String, required: true },
    dontDo: { type: String, required: true },
    budget: { type: String, required: false },
    location: { type: String, required: false },
    campaignDuration: { type: String },
    postDeadline: { type: String },
    multipleCreators: { type: Boolean, required: false, default: false },
    agreeToTerms: { type: Boolean, required: true },
    contentApproval: { type: Boolean, required: true, default: true },
    allowShowcase: { type: Boolean, required: true, default: true },
    taskType: { type: String, required: false },
    collaborationType: { type: String},
    paymentType: { type: String, required: false },
    followerSize: { type: String, required: false },
    totalPayment: { type: String, required: true },
    selectedPlatforms: { type: [String], required: true, default: [] },
    selectedContentTypes: { type: [String], required: true, default: [] },
    hashtags: { type: [String], required: false, default: [] },
    offerType: { type: String },
    jobType: {type:String, required:true},
    niche :{type:[String]},
    companyId:{type:Schema.Types.ObjectId, ref:"User", required:true},
    status:{type:String, enum:["Pending Applications","Accepted Jobs","Jobs In Progress","Submitted Jobs","Completed Jobs","Declined Jobs"],default:"Pending Applications"},
    applicants:[{type:Schema.Types.ObjectId,ref:"User",default:[]}],
    bids:[{type:Schema.Types.ObjectId,ref:"Bids",default:[]}],
    icon:{type:String,default:'gavel'},
    contentType:{type:String, default:"UGC"}
  },
  { timestamps: true }
);

const JobModel = models.Job || model<IJob>("Job", JobSchema);
export default JobModel
