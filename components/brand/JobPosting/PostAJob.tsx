// brand/postAJob.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ProgressBar";
import { DirectOfferForm } from "./DirectOfferForm";
import { PublicJobForm } from "./PublicJobForm";
import { apiPost } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function JobPostingForm() {
  const [activeTab, setActiveTab] = useState<"public" | "direct">("public");
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 4;
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(
    []
  );
  const [hashtags, setHashtags] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  // Direct offer form data
  const [directFormData, setDirectFormData] = useState({
    creatorName: "",
    creatorEmail: "",
    socialHandle: "",
    offerAmount: "",
    message: "",
  });

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
  });

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await apiPost("/brand/post-job", {
        data,
        type: activeTab,
      });

      if (!response.success) {
        toast({
          variant: "destructive",
          title: "Failed to post the job",
          description: "Please try Again",
        });
      }

      toast({
        variant: "success",
        title: "Job Posted successfully",
        description: "",
      });

      router.push("/dashboard/brand");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Job Posting Failed",
        description: error.message || "Please try again",
      });
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsSubmitting(false);
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Time to make some noise. Find your perfect match and let's get you seen.";
      case 2:
        return "Now let's paint the picture. What do you want them to create?";
      case 3:
        return "Set the terms. You're in control.";
      case 4:
        return "You're just one click away. Final touches here — then your job goes live.";
      default:
        return "";
    }
  };

  const handleTabChange = (tab: "public" | "direct") => {
    setCurrentStep(1);
    // Add smooth transition by setting a timeout
    setActiveTab(tab);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-20">
      <h1 className="text-2xl font-bold text-center text-white mb-2">
        Post a job
      </h1>
      <p className="text-center text-white font-light mb-6">
        {getStepDescription()}
      </p>

      {/* Tab Selector */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 rounded-full p-1 flex">
          <button
            className={cn(
              "px-6 py-2 rounded-full transition-all duration-300",
              activeTab === "public"
                ? "bg-epiclinx-teal text-black"
                : "text-white"
            )}
            onClick={() => handleTabChange("public")}
          >
            Public Job
          </button>
          <button
            className={cn(
              "px-6 py-2 rounded-full transition-all duration-300",
              activeTab === "direct"
                ? "bg-epiclinx-teal text-black"
                : "text-white"
            )}
            onClick={() => handleTabChange("direct")}
          >
            Direct Offer
          </button>
        </div>
      </div>

      <div className="w-full mb-8">
        <div className="mb-2">
          <span className="text-sm font-medium text-epiclinx-teal">
            Step {currentStep}/{totalSteps}.{" "}
            {currentStep === 1 && "Campaign Overview"}
            {currentStep === 2 && "Content & Goals"}
            {currentStep === 3 && "Payment & Collaboration"}
            {currentStep === 4 && "Final Touches"}
          </span>
        </div>

        <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-epiclinx-teal transition-all duration-500 ease-in-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* {
        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          className="mb-8"
        />
      } */}

      {/* Form Content */}
      <div className="transition-all duration-500 ease-in-out">
        {/* Direct Offer Form */}
        {activeTab === "direct" && (
          <DirectOfferForm
            currentStep={currentStep}
            nextStep={nextStep}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Public Job Form Steps */}
        {activeTab === "public" && (
          <PublicJobForm
            currentStep={currentStep}
            nextStep={nextStep}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}

// postAJob.tsx, DirectOfferForm.tsx, and PublicJobForm.tsx
