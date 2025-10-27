export interface PublicFormData {
    campaignImageUrl:string
    campaignName: string
    campaignBrief: string
    campaignGoal: string
    requirements: string
    captionGuidelines: string
    tagUs: string
    keepItAuthentic: string
    dontDo: string
    budget: string
    location: string
    campaignDuration: string
    postDeadline: string
    multipleCreators: boolean
    agreeToTerms: boolean
    contentApproval: boolean
    allowShowcase: boolean
    taskType:string
    collaborationType:string
    paymentType:string
    followerSize:string
    totalPayment:string
  }
  
  export interface DirectFormData {
    campaignImageUrl:string
    campaignName: string
    campaignBrief: string
    campaignStartDate: string
    campaignEndDate: string
    postDeadline: string
    campaignGoal: string
    requirements: string
    captionGuidelines: string
    tagUs: string
    keepItAuthentic: string
    dontDo: string
    totalPayment:number
    agreeToTerms: boolean
    contentApproval: boolean
    allowShowcase: boolean
    collaborationType:string
    niche:[string]
  }
  
  export type Platform = "TikTok" | "Instagram" | "YouTube" | "Facebook" | "Snapchat" | "Twitch" | "Kick"
  export type ContentType = "Video" | "Photo" | "Story" | "Other"
  export type OfferType = "fixed" | "bid"