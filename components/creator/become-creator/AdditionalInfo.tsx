// creator/become-creator/AdditionalInfo.tsx

"use client";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Controller } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const additionalInfoSchema = z.object({
  hearAboutUs: z.string().optional(),
  enableNotifications: z.boolean().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type AdditionalInfoFormValues = z.infer<typeof additionalInfoSchema>;

interface AdditionalInfoFormProps {
  formData: any;
  updateFormData: (data: any) => void;
  onSubmit: (dataFromChild: any) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function AdditionalInfoForm({
  formData,
  updateFormData,
  onSubmit,
  onBack,
  isSubmitting,
}: AdditionalInfoFormProps) {
  const heardAboutUsOptions = [
    "Google Search",
    "Social Media",
    "Friend or Colleague",
    "Advertisement",
    "Blog or Article",
    "Other",
  ];

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<AdditionalInfoFormValues>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: {
      hearAboutUs: formData.hearAboutUs,
      enableNotifications: formData.enableNotifications,
      agreeToTerms: formData.agreeToTerms,
    },
  });

  // Inside the component
  useEffect(() => {
    if (formData) {
      setValue("hearAboutUs", formData.hearAboutUs);
      setValue("enableNotifications", formData.enableNotifications);
      setValue("agreeToTerms", formData.agreeToTerms);
    }
  }, [formData, setValue]);

  const onFormSubmit = (data: AdditionalInfoFormValues) => {
    updateFormData(data);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="hearAboutUs" className="text-gray-300 text-xs">
          How did you hear about us?
        </Label>
        <Controller
          name="hearAboutUs"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="bg-transparent border-gray-700 text-white rounded-full">
                <SelectValue placeholder="Choose options" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {heardAboutUsOptions.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="hover:!text-white hover:!bg-epiclinx-teal"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Controller
            name="enableNotifications"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="enableNotifications"
                checked={field.value}
                onCheckedChange={(val) => field.onChange(val === true)}
              />
            )}
          />
          <Label htmlFor="enableNotifications" className="text-gray-300">
            Enable SMS and Email Notifications
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Controller
            name="agreeToTerms"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="agreeToTerms"
                checked={field.value}
                onCheckedChange={(val) => field.onChange(val === true)}
              />
            )}
          />
          <Label htmlFor="agreeToTerms" className="text-gray-300">
            Agree to EpicLinx{" "}
            <Link href="/terms-and-conditions" className="text-epiclinx-teal">
              Terms & Conditions
            </Link>
          </Label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-red-500 text-xs mt-1">
            {errors.agreeToTerms.message}
          </p>
        )}
      </div>

      <div className="flex justify-center gap-4 !mt-16">
        <button type="button" onClick={onBack} className="back-button">
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
            "Create Account"
          )}
        </Button>
      </div>
    </form>
  );
}
