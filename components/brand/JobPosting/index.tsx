"use client";

import React, { useState } from "react";
import { DirectOfferForm } from "./DirectOfferForm";
import { ProgressBar } from "@/components/ProgressBar";
import { JobTabs } from "./JobTabs";
import { PublicJobForm } from "./PublicJobForm";

export default function JobPostingForm() {
  const [activeTab, setActiveTab] = useState<"public" | "direct">("public");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Basic job ad information";
      case 2:
        return "What's this about?";
      case 3:
        return "Payment & deliverables";
      case 4:
        return "Final touches before we go live";
      default:
        return "";
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
        return "Set the terms. You're in control.";
    }
  };

  const handleTabChange = (tab: "public" | "direct") => {
    setActiveTab(tab);
    // Reset step to 1 when switching tabs
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    if (activeTab === "public") {
      console.log("Public job form submitted");
    } else {
      console.log("Direct offer form submitted");
    }
    // Handle form submission logic here
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center text-white mb-2">
        Post a job
      </h1>
      <p className="text-center text-white mb-6">{getStepDescription()}</p>

      {/* Tab Selector */}
      <JobTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Progress Bar - only show for public job */}
      {activeTab === "public" && (
        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          // stepTitle={getStepTitle()}
          className="mb-8"
        />
      )}

      {/* Form Content */}
      <div className="transition-all duration-500 ease-in-out">
        {activeTab === "direct" ? (
          <DirectOfferForm
            currentStep={currentStep}
            nextStep={nextStep}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
          />
        ) : (
          <PublicJobForm
            currentStep={currentStep}
            nextStep={nextStep}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
