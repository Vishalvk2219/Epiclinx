export interface PublicFormData {
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
  }
  
  export interface DirectFormData {
    campaignName: string
    campaignBrief: string
    campaignDuration: string
    postDeadline: string
    campaignGoal: string
    requirements: string
    captionGuidelines: string
    tagUs: string
    keepItAuthentic: string
    dontDo: string
    agreeToTerms: boolean
    contentApproval: boolean
    allowShowcase: boolean
  }
  
  export type Platform = "TikTok" | "Instagram" | "YouTube" | "Facebook" | "Snapchat" | "Twitch" | "Kick"
  export type ContentType = "Video" | "Photo" | "Story" | "Other"
  export type OfferType = "fixed" | "bid"