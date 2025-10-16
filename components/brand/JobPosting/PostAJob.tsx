// brand/postAJob.tsx
"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ProgressBar } from "@/components/ProgressBar"
import { DirectOfferForm } from "./DirectOfferForm"
import { PublicJobForm } from "./PublicJobForm"

export default function JobPostingForm() {
  const [activeTab, setActiveTab] = useState<"public" | "direct">("public")
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([])
  const [hashtags, setHashtags] = useState<string[]>([])

  // Direct offer form data
  const [directFormData, setDirectFormData] = useState({
    creatorName: "",
    creatorEmail: "",
    socialHandle: "",
    offerAmount: "",
    message: "",
  })

  // Form data state
  const [formData, setFormData] = useState({
    campaignName: "",
    campaignBrief: "",
    campaignGoal: "",
    requirements: "",
    captionGuidelines: "",
    tagUs: "",
    keepItAuthentic: "",
    dontDo: "",
    budget: "",
    location: "",
    multipleCreators: false,
    agreeToTerms: false,
    contentApproval: true,
    allowShowcase: true,
  })

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = () => {
    if (activeTab === "public") {
      console.log("Public job form submitted", { formData, selectedPlatforms, selectedContentTypes, hashtags })
    } else {
      console.log("Direct offer form submitted", { directFormData, selectedPlatforms })
    }
    // Handle form submission logic here
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Time to make some noise. Find your perfect match and let's get you seen."
      case 2:
        return "Now let's paint the picture. What do you want them to create?"
      case 3:
        return "Set the terms. You're in control."
      case 4:
        return "You're just one click away. Final touches here — then your job goes live."
      default:
        return ""
    }
  }

  const handleTabChange = (tab: "public" | "direct") => {
    setCurrentStep(1)
    // Add smooth transition by setting a timeout
    setActiveTab(tab)
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-20">
      <h1 className="text-2xl font-bold text-center text-white mb-2">Post a job</h1>
      <p className="text-center text-white font-light mb-6">{getStepDescription()}</p>

      {/* Tab Selector */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 rounded-full p-1 flex">
          <button
            className={cn(
              "px-6 py-2 rounded-full transition-all duration-300",
              activeTab === "public" ? "bg-epiclinx-teal text-black" : "text-white",
            )}
            onClick={() => handleTabChange("public")}
          >
            Public Job
          </button>
          <button
            className={cn(
              "px-6 py-2 rounded-full transition-all duration-300",
              activeTab === "direct" ? "bg-epiclinx-teal text-black" : "text-white",
            )}
            onClick={() => handleTabChange("direct")}
          >
            Direct Offer
          </button>
        </div>
      </div>

      {/* Progress Bar - only show for public job */}
      {<ProgressBar currentStep={currentStep} totalSteps={totalSteps} className="mb-8" />}

      {/* Form Content */}
      <div className="transition-all duration-500 ease-in-out">
        {/* Direct Offer Form */}
        {activeTab === "direct" && (
          <DirectOfferForm
            currentStep={currentStep}
            nextStep={nextStep}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
          />
        )}

        {/* Public Job Form Steps */}
        {activeTab === "public" && (
          <PublicJobForm
            currentStep={currentStep}
            nextStep={nextStep}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  )
}

// postAJob.tsx, DirectOfferForm.tsx, and PublicJobForm.tsx