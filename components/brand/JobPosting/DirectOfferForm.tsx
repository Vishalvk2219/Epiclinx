"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { DirectFormData, Platform } from "@/lib/types";
import {
  HashtagsInput,
  NavigationButtons,
  PlatformButtons,
} from "./FormElements";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/DatePicker";
import { toast } from "@/hooks/use-toast";
import { apiUpload } from "@/lib/api";
import { contentTypeCategories } from "@/lib/utils";
import CreatorDropdown from "@/components/creatorDropdown";

// --- Zod Strict Schemas: All fields required/non-empty ---
const step1Schema = z.object({
  campaignImageUrl: z.string().min(1, "Campaign image is required"),
  campaignName: z.string().min(1, "Campaign name is required"),
  campaignBrief: z.string().min(1, "Campaign brief is required"),
  campaignStartDate: z
    .string()
    .min(1, "Campaign start date is required")
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  campaignEndDate: z
    .string()
    .min(1, "Campaign end date is required")
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  postDeadline: z
    .string()
    .min(1, "Post deadline is required")
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  }),
  platforms: z.array(z.string()).min(1, "Please select at least one platform"),
  creator: z.string().min(1, "Please select Creator"),
  niche: z.array(z.string()).min(1, "Please select at least one niche"),
});

const step2Schema = z.object({
  campaignGoal: z.string().min(1, "Campaign goal is required"),
  requirements: z.string().min(1, "Requirements are required"),
  captionGuidelines: z.string().min(1, "Caption guidelines are required"),
});

const step3Schema = z.object({
  collaborationType: z.string().min(1, "Collaboration type is required"),
  totalPayment: z
    .string()
    .min(0, "Total payment is required")
    .regex(/^[0-9]+(\.[0-9]{1,2})?$/, "Please enter a valid amount"),
  contentApproval: z.boolean(),
  allowShowcase: z.boolean(),
});

const step4Schema = z.object({
  tagUs: z.string().min(1, "Tag information is required"),
  keepItAuthentic: z.string().min(1, "This field is required"),
  dontDo: z.string().min(1, "This field is required"),
  hashtags: z.array(z.string()).min(1, "Please add at least one hashtag"),
});

interface DirectOfferFormProps {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  handleSubmit: (data: any) => voi;
  isSubmitting: boolean;
}

export function DirectOfferForm({
  currentStep,
  nextStep,
  prevStep,
  handleSubmit,
  isSubmitting = false,
}: DirectOfferFormProps) {
  const [hashtags, setHashtags] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<DirectFormData>({
    campaignImageUrl: "",
    campaignName: "",
    campaignBrief: "",
    campaignStartDate: "",
    campaignEndDate: "",
    postDeadline: "",
    campaignGoal: "",
    requirements: "",
    captionGuidelines: "",
    tagUs: "",
    keepItAuthentic: "",
    dontDo: "",
    totalPayment: "",
    agreeToTerms: false,
    contentApproval: true,
    allowShowcase: true,
    collaborationType: "",
  });

  const [selectedNiche, setSelectedNiche] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCreator, setSelectedCreator] = useState("");

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePlatformToggle = (platform: Platform) => {
    const newPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter((p) => p !== platform)
      : [...selectedPlatforms, platform];
    setSelectedPlatforms(newPlatforms);

    if (newPlatforms.length > 0 && errors.platforms) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.platforms;
        return newErrors;
      });
    }
  };

  const addHashtag = (tag: string) => {
    if (tag && !hashtags.includes(tag)) {
      const newHashtags = [...hashtags, tag];
      setHashtags(newHashtags);
      if (newHashtags.length > 0 && errors.hashtags) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.hashtags;
          return newErrors;
        });
      }
    }
  };

  const removeHashtag = (tag: string) => {
    const newHashtags = hashtags.filter((t) => t !== tag);
    setHashtags(newHashtags);
  };

  const toggleNiche = (category: string) => {
    setSelectedNiche((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    if (selectedNiche.length > 0 && errors.niche) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.niche;
        return newErrors;
      });
    }
  };

  const handleCampaignUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setIsUploading(true);
      try {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        const response = await apiUpload(formDataUpload);
        setFormData((prev) => ({ ...prev, campaignImageUrl: response }));
        toast({
          variant: "success",
          title: "Upload successful",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Upload Failed",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const onNextStep = () => {
    setErrors({});
    try {
      if (currentStep === 1) {
        step1Schema.parse({
          ...formData,
          platforms: selectedPlatforms,
          niche: selectedNiche,
          creator:selectedCreator
        });
      } else if (currentStep === 2) {
        step2Schema.parse({
          campaignGoal: formData.campaignGoal,
          requirements: formData.requirements,
          captionGuidelines: formData.captionGuidelines,
        });
      } else if (currentStep === 3) {
        step3Schema.parse({
          collaborationType: formData.collaborationType,
          totalPayment: formData.totalPayment,
          contentApproval: formData.contentApproval,
          allowShowcase: formData.allowShowcase,
        });
      } else if (currentStep === 4) {
        step4Schema.parse({
          tagUs: formData.tagUs,
          keepItAuthentic: formData.keepItAuthentic,
          dontDo: formData.dontDo,
          hashtags,
        });
      }
      if (currentStep === 4) {
        handleSubmit({
          ...formData,
          selectedPlatforms,
          selectedNiche,
          hashtags,
          creatorId:selectedCreator,
        });
      } else {
        nextStep();
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        e.errors.forEach((err) => {
          const key = err.path[0];
          if (typeof key === "string") newErrors[key] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="transition-all duration-300 ease-in-out">
      {currentStep === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Uploaded Preview"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Image
                  src="/placeholder.svg"
                  alt="Campaign Logo"
                  width={64}
                  height={64}
                />
              )}
            </div>
            <button
              className="back-button !w-40"
              onClick={handleCampaignUpload}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload photo"}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
            {errors.campaignImageUrl && (
              <p className="text-xs text-red-500 mt-1">
                {errors.campaignImageUrl}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="campaignName"
              className="block text-xs text-white mb-1"
            >
              Campaign Name
            </label>
            <Input
              type="text"
              id="direct-campaignName"
              name="campaignName"
              placeholder="Enter Job Title for your Campaign"
              className={`w-full rounded-full bg-transparent border ${
                errors.campaignName ? "border-red-500" : "border-gray-400"
              } text-white focus:border-[#00CEC9]`}
              value={formData.campaignName}
              onChange={handleInputChange}
            />
            {errors.campaignName && (
              <p className="text-xs text-red-500 mt-1">{errors.campaignName}</p>
            )}
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label
                htmlFor="campaignBrief"
                className="block text-xs text-white"
              >
                Campaign Brief
              </label>
              <span className="text-xs text-gray-400">Max 150 Characters</span>
            </div>
            <Textarea
              id="direct-campaignBrief"
              name="campaignBrief"
              placeholder="What type of content & influencer you're looking for"
              className={`w-full px-4 py-3 rounded-xl bg-transparent border ${
                errors.campaignBrief ? "border-red-500" : "border-gray-400"
              } text-white focus:border-[#00CEC9] focus:outline-none resize-none h-24`}
              maxLength={150}
              value={formData.campaignBrief}
              onChange={handleInputChange}
            />
            {errors.campaignBrief && (
              <p className="text-xs text-red-500 mt-1">
                {errors.campaignBrief}
              </p>
            )}
          </div>
          <div>
          <label className="block text-xs text-white">Select Creator</label>
          <div className="flex flex-wrap gap-2 py-1">
            <CreatorDropdown
              value={selectedCreator}
              onChange={(id) => setSelectedCreator(id)}
            />
          </div>
          {errors.creator && (
            <p className="text-xs text-red-500 mt-1">{errors.creator}</p>
          )}
          </div>
          
          <label className="block text-xs text-white">Select Niche</label>
          <div className="flex flex-wrap gap-2">
            {contentTypeCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  toggleNiche(category);
                }}
                className={`px-4 py-1 rounded-full text-sm ${
                  selectedNiche.includes(category)
                    ? "bg-epiclinx-teal text-black"
                    : "bg-epiclinx-semiteal text-black hover:bg-[#00e5c9] hover:transition-all hover:duration-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          {errors.niche && (
            <p className="text-xs text-red-500 mt-1">{errors.niche}</p>
          )}
          <div>
            <label className="block text-xs text-white mb-2">Platform</label>
            <PlatformButtons
              selectedPlatforms={selectedPlatforms}
              onPlatformToggle={handlePlatformToggle}
            />
            {errors.platforms && (
              <p className="text-xs text-red-500 mt-1">{errors.platforms}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white mb-1">
                  Campaign Start Date
                </label>
                <DatePicker
                  value={
                    formData.campaignStartDate
                      ? new Date(formData.campaignStartDate)
                      : undefined
                  }
                  onChange={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      campaignStartDate: date ? date.toISOString() : "",
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-xs text-white mb-1">
                  Campaign End Date
                </label>
                <DatePicker
                  value={
                    formData.campaignEndDate
                      ? new Date(formData.campaignEndDate)
                      : undefined
                  }
                  onChange={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      campaignEndDate: date ? date.toISOString() : "",
                    }))
                  }
                />
              </div>
              {errors.campaignDuration && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.campaignDuration}
                </p>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="postDeadline"
                className="block text-xs text-white mb-1"
              >
                Post Deadline
              </label>
              <DatePicker
                value={
                  formData.postDeadline
                    ? new Date(formData.postDeadline)
                    : undefined
                }
                onChange={(date) =>
                  handleInputChange({
                    target: {
                      name: "postDeadline",
                      value: date ? date.toISOString() : "",
                    },
                  } as any)
                }
              />
              {errors.postDeadline && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.postDeadline}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => {
                setFormData((prev) => ({
                  ...prev,
                  agreeToTerms: checked === true,
                }));
              }}
              className="h-4 w-4 rounded border-gray-400 bg-transparent text-[#00CEC9] focus:ring-[#00CEC9]"
            />
            <label htmlFor="agreeToTerms" className="text-xs text-white">
              Agree to EpicLinx{" "}
              <Link href="/terms-and-conditions" className="text-epiclinx-teal">
                Terms & Conditions
              </Link>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-xs text-red-500 mt-1">{errors.agreeToTerms}</p>
          )}
        </div>
      )}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <label
              htmlFor="campaignGoal"
              className="block text-xs text-white mb-1"
            >
              Campaign Goal
            </label>
            <Input
              type="text"
              id="direct-campaignGoal"
              name="campaignGoal"
              placeholder="E.g., Promote a product, boost brand awareness, increase sales"
              className={`w-full rounded-full bg-transparent border ${
                errors.campaignGoal ? "border-red-500" : "border-gray-400"
              } text-white focus:border-[#00CEC9]`}
              value={formData.campaignGoal}
              onChange={handleInputChange}
            />
            {errors.campaignGoal && (
              <p className="text-xs text-red-500 mt-1">{errors.campaignGoal}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="requirements"
              className="block text-xs text-white mb-1"
            >
              What we need from you
            </label>
            <Input
              type="text"
              id="direct-requirements"
              name="requirements"
              placeholder="E.g., 1 Instagram Reel + 2 Stories"
              className={`w-full rounded-full bg-transparent border ${
                errors.requirements ? "border-red-500" : "border-gray-400"
              } text-white focus:border-[#00CEC9]`}
              value={formData.requirements}
              onChange={handleInputChange}
            />
            {errors.requirements && (
              <p className="text-xs text-red-500 mt-1">{errors.requirements}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="captionGuidelines"
              className="block text-xs text-white mb-1"
            >
              Caption Guidelines
            </label>
            <Input
              type="text"
              id="direct-captionGuidelines"
              name="captionGuidelines"
              placeholder="E.g., Mention our brand and use #OurHashtag"
              className={`w-full rounded-full bg-transparent border ${
                errors.captionGuidelines ? "border-red-500" : "border-gray-400"
              } text-white focus:border-[#00CEC9]`}
              value={formData.captionGuidelines}
              onChange={handleInputChange}
            />
            {errors.captionGuidelines && (
              <p className="text-xs text-red-500 mt-1">
                {errors.captionGuidelines}
              </p>
            )}
          </div>
        </div>
      )}
      {currentStep === 3 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="collaborationType"
                className="block text-xs text-white mb-1"
              >
                Collaboration Type
              </label>
              <Select
                onValueChange={(value) => {
                  handleSelectChange("collaborationType", value);
                }}
              >
                <SelectTrigger className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]">
                  <SelectValue placeholder="Select collaboration type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="commission">Commission</SelectItem>
                </SelectContent>
              </Select>
              {errors.collaborationType && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.collaborationType}
                </p>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="totalPayment"
                className="block text-xs text-white mb-1"
              >
                Total Payment
              </label>
              <span className="absolute left-4 top-[30px] text-white text-sm pointer-events-none">
                $
              </span>
              <Input
                type="number"
                min={0}
                id="direct-totalPayment"
                name="totalPayment"
                placeholder="Enter Total Payment"
                className={`w-full pl-8 rounded-full bg-transparent border ${
                  errors.totalPayment ? "border-red-500" : "border-gray-400"
                } text-white focus:border-[#00CEC9]`}
                value={formData.totalPayment}
                onChange={handleInputChange}
              />
              {errors.totalPayment && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.totalPayment}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                This amount will remain private and is only visible to accepted
                creators. Held securely in escrow until job completion.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-white text-lg mb-4">Collaboration Terms</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    name="contentApproval"
                    checked={formData.contentApproval}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        contentApproval: e.target.checked,
                      }));
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-[#00CEC9] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
                <span className="text-xs text-white">Content approval</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    name="allowShowcase"
                    checked={formData.allowShowcase}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        allowShowcase: e.target.checked,
                      }));
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-[#00CEC9] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
                <span className="text-xs text-white">
                  Allow us to showcase your content in our ads
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {currentStep === 4 && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <label htmlFor="tagUs" className="block text-xs text-white mb-1">
              Tag Us
            </label>
            <Input
              type="text"
              id="direct-tagUs"
              name="tagUs"
              placeholder="@BrandHandle"
              className={`w-full rounded-full bg-transparent border ${
                errors.tagUs ? "border-red-500" : "border-gray-400"
              } text-white focus:border-[#00CEC9]`}
              value={formData.tagUs}
              onChange={handleInputChange}
            />
            {errors.tagUs && (
              <p className="text-xs text-red-500 mt-1">{errors.tagUs}</p>
            )}
          </div>
          <div>
            <label htmlFor="hashtags" className="block text-xs text-white mb-1">
              Required Hashtags
            </label>
            <HashtagsInput
              hashtags={hashtags}
              onAddHashtag={addHashtag}
              onRemoveHashtag={removeHashtag}
            />
            {errors.hashtags && (
              <p className="text-xs text-red-500 mt-1">{errors.hashtags}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="keepItAuthentic"
              className="block text-xs text-white mb-1"
            >
              Keep it authentic
            </label>
            <Input
              type="text"
              id="direct-keepItAuthentic"
              name="keepItAuthentic"
              placeholder="E.g., Be yourself, make it engaging"
              className={`w-full rounded-full bg-transparent border ${
                errors.keepItAuthentic ? "border-red-500" : "border-gray-400"
              } text-white focus:border-[#00CEC9]`}
              value={formData.keepItAuthentic}
              onChange={handleInputChange}
            />
            {errors.keepItAuthentic && (
              <p className="text-xs text-red-500 mt-1">
                {errors.keepItAuthentic}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="dontDo" className="block text-xs text-white mb-1">
              Don't Do
            </label>
            <Input
              type="text"
              id="direct-dontDo"
              name="dontDo"
              placeholder="E.g., No competitor mentions, no misleading claims"
              className={`w-full rounded-full bg-transparent border ${
                errors.dontDo ? "border-red-500" : "border-gray-400"
              } text-white focus:border-[#00CEC9]`}
              value={formData.dontDo}
              onChange={handleInputChange}
            />
            {errors.dontDo && (
              <p className="text-xs text-red-500 mt-1">{errors.dontDo}</p>
            )}
          </div>
        </div>
      )}
      <NavigationButtons
        showBack={currentStep > 1}
        onBack={prevStep}
        onNext={onNextStep}
        nextLabel={currentStep === 4 ? "Submit" : "Continue"}
        disabled={isUploading || isSubmitting}
      />
    </div>
  );
}
