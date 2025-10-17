"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { ProgressBar } from "@/components/ProgressBar";
import { LegalInfoForm } from "./LegalFormInfo";
import { AccountInfoForm } from "./AccountInfoForm";
import { AdditionalInfoForm } from "./AdditionalInfo";
import BusinessInfoForm from "./BusinessInfoForm";
import { apiLogout, apiPost, apiUpload } from "@/lib/api";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";


const LOCAL_KEY = "epiclinx_signup_data";

const now = () => new Date().getTime();
const isExpired = (timestamp: number) =>
  now() - timestamp > 48 * 60 * 60 * 1000;

export function MultiStepForm() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const role = pathname.split("/")[1];
  const plan = searchParams.get("plan");
  const currency = searchParams.get("currency");
  const recurring_interval = searchParams.get("recurring_interval");
  const trial = !!searchParams.get("trial");
  const { user: sessionUser } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showExpiredMsg, setShowExpiredMsg] = useState(false);
  const [showRestoredMsg, setShowRestoredMsg] = useState(false);

  const defaultFormData = {
    role,
    profileImageFile: null as File | null,
    profileImageUrl: "",
    firstName: "",
    lastName: "",
    email: "",
    displayName: "",
    location: "",
    instagram: "",
    facebook: "",
    tiktok: "",
    otherSocial: "",
    creditCardNumber: "",
    cvv: "",
    expiryDate: "",
    abn: "",
    accountUsername: "",
    password: "",
    confirmPassword: "",
    hearAboutUs: "",
    enableNotifications: false,
    agreeToTerms: false,
    categories: [],
    phone: "",
    companyName: "",
    shopAddress: "",
    businessWebsite: "",
    businessDescription: "",
    plan: plan || "",
    currency: currency || "",
    recurring_interval: recurring_interval || "",
    trial: trial ? 1 : 0,
  };

  const [formData, setFormData] = useState(defaultFormData);

  // 🧠 Restore from localStorage
  useEffect(() => {
    console.log("Inside useEffect");
    // Logged-in user should be logged out
    if (
      searchParams.get("currency") &&
      searchParams.get("plan") &&
      searchParams.get("recurring_interval")
    ) {
      localStorage.removeItem(LOCAL_KEY);
      router.replace(pathname); // remove query params from URL
      setShowRestoredMsg(false);
      setShowExpiredMsg(false);
      apiLogout();
      // useAuthStore.getState().clearUser();
      return;
    }

    const saved = localStorage.getItem(LOCAL_KEY);
    const parsed = saved ? JSON.parse(saved) : null;
    console.log("parsed", parsed);

    if (
      parsed &&
      parsed.timestamp &&
      parsed.formData &&
      parsed.formData.plan &&
      parsed.formData.recurring_interval &&
      parsed.formData.currency &&
      !isExpired(parsed.timestamp)
    ) {
      if (parsed.currentStep === 2) {
        // Redirect to Step 1 before LegalInfo
        setCurrentStep(1);
      } else {
        setCurrentStep(parsed.currentStep);
      }
      console.log(
        "parsed.formData---> ",
        parsed.formData,
        Date.now().toLocaleString()
      );
      setFormData(parsed.formData);
      setShowRestoredMsg(true);
    } else {
      console.log("113");
      localStorage.removeItem(LOCAL_KEY);
      setShowExpiredMsg(true);
    }
  }, []);

  // 💾 Save to localStorage whenever formData or step changes
  useEffect(() => {
    const { password, confirmPassword, ...safeFormData } = formData || {};
    const dataToSave = {
      timestamp: now(),
      formData: safeFormData,
      currentStep,
    };
    if (formData.currency && formData.recurring_interval && formData.plan) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(dataToSave));
    }
  }, [formData, currentStep]);

  const updateFormData = async (data: Partial<typeof formData>) => {
    console.log("setFormData 158", Date.now().toLocaleString());
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const stepNames = [
    "Business Info",
    "Legal Info",
    "Account Info",
    "Additional",
  ];

  const nextStep = () => setCurrentStep((prev) => Math.min(4, prev + 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  // ❌ Expired or no session
  if (showExpiredMsg) {
    return (
      <div className="text-center text-red-400 mt-10">
        <p className="text-xl mb-4 font-semibold">Signup Session Expired</p>
        <p>
          Your session was inactive for long. Please start again by selecting
          your role and subscription plan.
        </p>
        <p className="mt-20">
          <Link
            href="/"
            className="rounded-full bg-epiclinx-teal hover:bg-epiclinx-teal/80 text-black px-6 py-3 transition-all w-full sm:w-auto sm:self-end"
          >
            Start Again
          </Link>
        </p>
      </div>
    );
  }

  if (sessionUser?.onboardingStatus == 5) {
    return (
      <div className="md:max-w-4xl mx-auto p-6 md:mt-10">
        <div className="text-xl mb-4 pt-20 flex flex-col items-center justify-center gap-2">
          <div>
            <p className="mb-10">
              Oops! Looks like you’ve already completed your onboarding 😊
            </p>
            <p className="mb-10">
              We’re so sorry for the confusion! You’ve already taken care of
              everything needed — your profile is all set and your payment
              method has been securely saved for future use. 💳✨
            </p>
            <p className="mb-10">
              There’s no need to go through the steps again. Instead, head
              straight to your dashboard and start making meaningful connections
              with amazing {sessionUser.role == "brand" ? "CREATORS" : "BRANDS"}
              . 🌟
            </p>
            <p>
              Thank you for your patience — and welcome again! We’re truly
              excited to have you on board. 💙
            </p>
            <div className="flex justify-center gap-4 !mt-16">
              <Link
                href={`/dashboard/${sessionUser.role}`}
                className="rounded-full bg-epiclinx-teal hover:bg-epiclinx-teal/80 text-black px-6 py-3 transition-all w-full sm:w-auto sm:self-end"
              >
                Go To Dahboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:max-w-4xl mx-auto p-6 md:mt-10">
      {showRestoredMsg && (
        <div className="bg-emerald-700 text-white p-3 rounded text-center mb-5">
          Welcome back! You can pick up right where you left off. We’ve saved
          your progress.
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          {role === "creator" ? "Quick Creator setup" : "Join as a brand"}
        </h1>
        <p className="text-gray-100 font-light">
          {currentStep === 1
            ? role === "creator"
              ? "Your next big brand collaboration starts right here. Create your account today."
              : "Create an account today and start connecting with our Epic network of creators."
            : currentStep === 2
            ? "Quick setup – securely connect your payment details."
            : currentStep === 3
            ? "Nearly there – set up your login."
            : "Final touch – a few quick details."}
        </p>
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
                  await updateFormData(dataFromChild);
                  setIsSubmitting(true);
                  try {
                    const payload = {
                      profileImageUrl: dataFromChild.profileImageUrl,
                      firstName: dataFromChild.firstName,
                      lastName: dataFromChild.lastName,
                      email: dataFromChild.email,
                      phone: dataFromChild.phone,
                      displayName: dataFromChild.displayName,
                      location: dataFromChild.location,
                      instagram: dataFromChild.instagram,
                      facebook: dataFromChild.facebook,
                      tiktok: dataFromChild.tiktok,
                      otherSocial: dataFromChild.otherSocial,
                      categories: dataFromChild.categories,
                      companyName: dataFromChild.companyName,
                      shopAddress: dataFromChild.shopAddress,
                      businessWebsite: dataFromChild.businessWebsite,
                      businessDescription: dataFromChild.businessDescription,
                      role: formData.role,
                    };
                    const response = await apiPost<{
                      user: any;
                    }>("/auth/register", payload);
                    useAuthStore.getState().setUser(response.user);
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
                    setShowRestoredMsg(false);
                  }
                }}
              />
            )}
            {currentStep === 2 && (
              <LegalInfoForm
                formData={formData}
                updateFormData={updateFormData}
                isSubmitting={isSubmitting}
                onNext={async (checkout, abn) => {
                  setIsSubmitting(true);
                  updateFormData({ abn });
                  const result = await checkout.confirm({
                    returnUrl: window.location.href,
                    redirect: "if_required",
                  });
                  if (result.type === "error") {
                    toast({
                      variant: "destructive",
                      title: "Card Authorization Failed",
                      description: result.error?.message,
                    });
                  } else {
                    toast({
                      variant: "success",
                      title: "Card Authorized & Saved",
                      description:
                        "Card details verified. Saved for future payments",
                    });

                    const payload = {
                      email: formData.email,
                      stripeCheckoutSessionId: result.session.id,
                      abn,
                    };
                    const response = await apiPost<{ user: any }>(
                      "/auth/legal-info",
                      payload
                    );
                    useAuthStore.getState().setUser(response.user);
                    nextStep();
                  }
                  setIsSubmitting(false);
                  setShowRestoredMsg(false);
                }}
                onBack={prevStep}
                onNextIsPaymentComplete={nextStep}
              />
            )}
            {currentStep === 3 && (
              <AccountInfoForm
                formData={formData}
                updateFormData={updateFormData}
                isSubmitting={isSubmitting}
                onNext={async (dataFromChild: any) => {
                  console.log({ dataFromChild });
                  await updateFormData(dataFromChild);
                  setIsSubmitting(true);
                  try {
                    const response = await apiPost<{ user: any }>(
                      "/auth/account-info",
                      {
                        username: dataFromChild.accountUsername,
                        password: dataFromChild.password,
                        email: formData.email,
                      }
                    );
                    useAuthStore.getState().setUser(response.user);
                    nextStep();
                  } catch (err: any) {
                    toast({
                      variant: "destructive",
                      title: "Account Info Failed",
                      description:
                        err.message || "Could not save account info.",
                    });
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                onBack={prevStep}
              />
            )}
            {currentStep === 4 && (
              <AdditionalInfoForm
                formData={formData}
                updateFormData={updateFormData}
                isSubmitting={isSubmitting}
                onSubmit={async (dataFromChild: any) => {
                  console.log("STEP4 got pissed", formData);
                  await updateFormData(dataFromChild);
                  setIsSubmitting(true);
                  try {
                    const response = await apiPost<{ user: any }>(
                      "/auth/additional-info",
                      {
                        email: formData.email,
                        heardAboutUs: dataFromChild.hearAboutUs,
                        notificationsEnabled: dataFromChild.enableNotifications,
                        agreedToTerms: dataFromChild.agreeToTerms,
                      }
                    );
                    useAuthStore.getState().setUser(response.user);
                    toast({
                      variant: "success",
                      title: "Welcome To EpicLinx 🚀",
                      description:
                        "Prepearing Your Dashboard. You will be there soon",
                    });
                    try {
                      await apiPost(
                        "/send-mail/registration-successful",
                        response.user
                      );
                    } catch (error: any) {
                      console.log(error.message);
                    }
                    // await new Promise((res) => setTimeout(res, 3000));
                    router.push("/dashboard/" + formData.role);
                  } catch (err: any) {
                    toast({
                      variant: "destructive",
                      title: "Save failed",
                      description:
                        err.message || "Could not save additional info.",
                    });
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                onBack={prevStep}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
