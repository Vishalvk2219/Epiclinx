"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProgressBar } from "@/components/ProgressBar";
import { BusinessInfoForm } from "./BusinessInfoForm";
import { LegalInfoForm } from "./LegalFormInfo";
import { AccountInfoForm } from "./AccountInfoForm";
import { AdditionalInfoForm } from "./AdditionalInfo";
import { toast } from "@/components/ui/use-toast";
import { apiPost } from "@/lib/api";

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    

    // Business Info
    logo: "",
    companyName: "",
    shopAddress: "",
    businessEmail: "",
    businessPhone: "",
    username: "",
    instagram: "",
    facebook: "",
    tiktok: "",
    businessWebsite: "",
    brandDescription: "",
    categories: [] as string[],

    // Legal Info
    creditCardNumber: "",
    cvv: "",
    expiryDate: "",
    abn: "",

    // Account Info
    accountUsername: "",
    password: "",
    confirmPassword: "",

    // Additional Info
    hearAboutUs: "",
    enableNotifications: false,
    agreeToTerms: false,
  });

  const stepNames = [
    "Business Info",
    "Legal Info",
    "Account Info",
    "Additional",
  ];

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted with data:", formData);
    toast({
      title: "Account created successfully!",
      description: "Welcome to Epiclinx",
    });
    // Here you would typically send the data to your backend
  };

  return (
    <div className="md:max-w-4xl mx-auto p-6 md:mt-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Quick brand setup
        </h1>
        {currentStep === 1 && (
          <p className="text-gray-100 font-light">
            Smart brands start here. Create your account and get instant access
            to Epiclinx's creator network.
          </p>
        )}
        {currentStep === 2 && (
          <p className="text-gray-100 font-light">
            Quick setup – securely connect your payment details.
          </p>
        )}
        {currentStep === 3 && (
          <p className="text-gray-100 font-light">
            Nearly there – set up your login.
          </p>
        )}
        {currentStep === 4 && (
          <p className="text-gray-400">Final touch – a few quick details.</p>
        )}
      </div>

      <ProgressBar
        currentStep={currentStep}
        totalSteps={4}
        stepNames={stepNames}
        className="mb-8"
      />

      <div className="mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`step-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <BusinessInfoForm
                formData={formData}
                updateFormData={updateFormData}
                isSubmitting={isSubmitting || isUploading}
                onNext={async (dataFromChild: any) => {
                  console.log("STEP1 got pissed", formData);
                  updateFormData(dataFromChild);
                  setIsSubmitting(true);
                  try {
                    const payload = {
                      profileImageUrl: dataFromChild.profileImageUrl,
                      firstName: dataFromChild.firstName,
                      lastName: dataFromChild.lastName,
                      email: dataFromChild.email,
                      phone: dataFromChild.phone,
                      displayName: dataFromChild.username,
                      location: dataFromChild.location,
                      instagram: dataFromChild.instagram,
                      facebook: dataFromChild.facebook,
                      tiktok: dataFromChild.tiktok,
                      otherSocial: dataFromChild.otherSocial,
                      categories: dataFromChild.categories,
                      role: "brand",
                    };
                    await apiPost("/auth/register", payload);
                    nextStep();
                  } catch (err: any) {
                    toast({
                      variant: "destructive",
                      title: "Save failed",
                      description:
                        err.message || "Could not save business info.",
                    });
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              />
            )}
            {currentStep === 2 && (
              <LegalInfoForm
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            {currentStep === 3 && (
              <AccountInfoForm
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            {currentStep === 4 && (
              <AdditionalInfoForm
                formData={formData}
                updateFormData={updateFormData}
                onSubmit={handleSubmit}
                onBack={prevStep}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
