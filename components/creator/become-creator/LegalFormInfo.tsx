// creator/become-creator/LegalInfoForm.tsx

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckoutProvider,
  useCheckout,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { apiPost } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const legalInfoSchema = z.object({
  abn: z.string().optional(),
});

type LegalInfoFormValues = z.infer<typeof legalInfoSchema>;

interface LegalInfoFormProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: (checkout: any, abn: string) => void;
  onNextIsPaymentComplete: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export function LegalInfoForm({
  formData,
  updateFormData,
  onNext,
  onNextIsPaymentComplete,
  onBack,
  isSubmitting,
}: LegalInfoFormProps) {
  const [isReady, setIsReady] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [isFailedToCreateSession, setIsFailedToCreateSession] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LegalInfoFormValues>({
    resolver: zodResolver(legalInfoSchema),
    defaultValues: {
      abn: formData.abn,
    },
  });

  const fetchClientSecret = async () => {
    try {
      const response: any = await apiPost("/stripe/create-checkout-session", {
        email: formData.email,
        plan: formData.plan,
        currency: formData.currency,
        recurring_interval: formData.recurring_interval,
        trial: formData.trial,
      });
      console.log("response=====> ", response);
      if (response.error) {
        if (response.error == "Conflict") {
          setIsPaymentComplete(true);
        } else {
          toast({
            variant: "destructive",
            title: "Failed",
            description: response.message || "Could not load seccure form.",
          });
          setIsFailedToCreateSession(true);
        }
      }
      return response.checkoutSessionClientSecret;
    } catch (e: any) {
      console.log("Error OUTSIDE =====> ", e);
      console.log("e.message OUTSIDE =====> ", e.message);
      console.log("e.name OUTSIDE =====> ", e.name);
      console.log("e.statusCode OUTSIDE =====> ", e.statusCode);
      console.log("e.error OUTSIDE =====> ", e.error);
    } finally {
      setIsReady(true);
    }
  };

  return (
    <div>
      {!isReady && (
        <div className="text-white text-sm mb-4 pt-20 flex flex-col items-center justify-center text-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <span>Initializing Secure Payment Form...</span>
        </div>
      )}

      {isFailedToCreateSession && (
        <div className="text-red-400 text-sm mb-4 pt-20 flex flex-col items-center justify-center text-center gap-2">
          <div>
            Failed To Intialize Secure Payment Form...
            <div className="flex justify-center gap-4 !mt-16">
              <button
                type="button"
                onClick={onBack}
                className="back-button"
                style={{ height: "2.75rem" }}
              >
                Go Back
              </button>
              <Link
                href="/"
                className="rounded-full bg-epiclinx-teal hover:bg-epiclinx-teal/80 text-black px-6 py-3 transition-all w-full sm:w-auto sm:self-end"
              >
                Start Over
              </Link>
            </div>
          </div>
        </div>
      )}

      {isPaymentComplete && (
        <div className="text-xl mb-4 pt-20 flex flex-col items-center justify-center gap-2">
          <div>
            <p className="mb-10">Hey there ! 👋</p>
            <p className="mb-10">
              Looks like you've found your way back to the Legal Info page —
              again! 😄
            </p>
            <p className="mb-10">
              Great news: your card has already been securely verified and
              authorized. ✅ It’s now saved and ready to be used for any future
              payments.
            </p>
            <p className="mb-10">
              You can go ahead to the next step whenever you’re ready — or
              revisit the previous one to double-check your details. Either way,
              no pressure. We’ve saved your session and you’re all set.
            </p>
            <p>
              We're here to make this process smooth and stress-free. 💙
            </p>
            <div className="flex justify-center gap-4 !mt-16">
              <button
                type="button"
                onClick={onBack}
                className="back-button"
                style={{ height: "2.75rem" }}
              >
                Go Back
              </button>
              <Button
                onClick={onNextIsPaymentComplete}
                className="rounded-full bg-epiclinx-teal hover:bg-epiclinx-teal/80 text-black px-6 py-3 transition-all w-full sm:w-auto sm:self-end"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      <CheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret,
          elementsOptions: {
            appearance: {
              theme: "night",
              variables: {
                colorBackground: "#313131",
                colorPrimary: "rgb(49 49 49)",
                borderRadius: "0px",
                fontFamily: "Inter, sans-serif",
                spacingUnit: "6px",
              },
              rules: {
                ".Input": {
                  border: "1px solid rgb(156 163 175)",
                  padding: "12px 16px",
                  borderRadius: "50px",
                },
                ".Label": {
                  fontSize: "14px",
                  color: "#fff",
                },
                ".AccordionItem": {
                  border: "0px",
                  padding: "0px",
                  boxShadow: "0px",
                },
                ".FadeWrapper": {
                  dosplay: "none",
                },
              },
            },
          },
        }}
      >
        <InnerLegalForm
          updateFormData={updateFormData}
          onBack={onBack}
          onNext={onNext}
          setIsReady={setIsReady}
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
        />
      </CheckoutProvider>
    </div>
  );
}

// ⬇️ Inner Component with useCheckout inside context
function InnerLegalForm({
  updateFormData,
  onBack,
  onNext,
  setIsReady,
  register,
  errors,
  isSubmitting,
}: {
  updateFormData: (data: any) => void;
  onBack: () => void;
  onNext: (checkout: any, abn: string) => void;
  setIsReady: (v: boolean) => void;
  register: any;
  errors: any;
  isSubmitting: boolean;
}) {
  const checkout = useCheckout();

  const handleOnSubmit = (event: any) => {
    event.preventDefault();
    const abn = (event.target.abn?.value || "") as string;
    updateFormData({ abn });
    onNext(checkout, abn);
  };

  return (
    // <form onSubmit={handleOnSubmit}>
    <form onSubmit={handleOnSubmit}>
      <div className="p-0 bg-bg-transparent rounded-lg">
        <PaymentElement
          className="bg-bg-transparent text-black p-0 rounded-lg"
          onReady={() => setIsReady(true)}
          options={{
            fields: {
              billingDetails: {
                address: "never",
              },
            },
          }}
        />

        <div className="pt-7 space-y-2">
          <Label
            htmlFor="abn"
            className="text-gray-100 font-light text-xs flex items-center gap-1"
          >
            ABN (optional) <Info className="h-4 w-4 text-gray-400" />
          </Label>
          <Input
            id="abn"
            placeholder="Enter Your ABN"
            {...register("abn")}
            className="bg-transparent border-gray-400 text-white rounded-full"
          />
          {errors.abn && (
            <p className="text-red-500 text-xs mt-1">{errors.abn.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4 !mt-16">
        <button
          type="button"
          onClick={onBack}
          className="back-button"
          style={{ height: "2.75rem" }}
        >
          Back
        </button>
        <Button
          type="submit"
          className="rounded-full bg-epiclinx-teal hover:bg-epiclinx-teal/80 text-black px-6 py-3 transition-all w-full sm:w-auto sm:self-end"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Please Wait ...
            </span>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </form>
  );
}
