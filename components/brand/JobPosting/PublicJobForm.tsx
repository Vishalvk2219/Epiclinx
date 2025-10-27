// brand/PublicJobForm.tsx
"use client";

import type React from "react";
import { useRef, useState } from "react";
import Image from "next/image";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlatformButtons,
  ContentTypeButtons,
  OfferTypeButtons,
  HashtagsInput,
  ToggleSwitch,
  NavigationButtons,
} from "./FormElements";
import type {
  ContentType,
  OfferType,
  Platform,
  PublicFormData,
} from "@/lib/types";
import Link from "next/link";
import { Combobox } from "@/components/ui/country-dropdown";
import { countries } from "@/lib/countries";
import { Button } from "@/components/ui/button";
import { apiUpload } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/DatePicker";
import { contentTypeCategories } from "@/lib/utils";

// Validation using Zod

// Step 1 Schema: Basic job ad information including campaign image upload
const step1Schema = z.object({
  campaignName: z.string().min(1, "Campaign name is required"),
  campaignBrief: z.string().min(1, "Campaign brief is required"),
  budget: z
    .string()
    .min(1, "Budget is required")
    .regex(/^[0-9]+(\.[0-9]{1,2})?$/, "Please enter a valid amount"),
  platforms: z.array(z.string()).min(1, "Please select at least one platform"),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  }),
  // Newly added validations
  taskType: z.string().min(1, "Task type is required"),
  paymentType: z.string().min(1, "Payment type is required"),
  followerSize: z.string().min(1, "Follower size is required"),
  campaignImageUrl: z.string().min(1, "Please Select valid Image"),
  campaignDuration: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Campaign duration must be a valid date string",
    }),
  postDeadline: z
  .string()
  .min(1, "Post deadline is required")
  .refine((val) => !isNaN(Date.parse(val)), "Invalid date"),

  location: z
    .string()
    .optional()
    .refine((val) => val === undefined || val.length > 0, {
      message: "Location cannot be empty if provided",
    }),
});

// Step 2 Schema: Campaign goal, requirements, content types + niche and hashtags (optional)
const step2Schema = z.object({
  campaignGoal: z.string().min(1, "Campaign goal is required"),
  requirements: z.string().min(1, "Requirements are required"),
  contentTypes: z
    .array(z.string())
    .min(1, "Please select at least one content type"),
  captionGuidelines: z.string().min(1, "Caption guidelines are required"),
  niche: z.array(z.string()).min(1, "Please select at least one niche"),
});

// Step 3 Schema: Payment & deliverables including collaboration type and toggles
const step3Schema = z.object({
  totalPayment: z
    .string()
    .min(1, "Total payment is required")
    .regex(/^[0-9]+(\.[0-9]{1,2})?$/, "Please enter a valid amount"),
  collaborationType: z.string().min(1, "Collaboration type is required"),
  multipleCreators: z.boolean(),
  contentApproval: z.boolean(),
  allowShowcase: z.boolean(),
  offerType: z.enum(["fixed", "variable"]),
});

// Step 4 Schema: Final fields - tags, authenticity, exclusions
const step4Schema = z.object({
  hashtags: z.array(z.string()).min(1, "Please add at least one hashtag"),
  tagUs: z.string().min(1, "Tag information is required"),
  keepItAuthentic: z.string().min(1, "This field is required"),
  dontDo: z.string().min(1, "This field is required"),
});

//-------------------------------------------------

interface PublicJobFormProps {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  handleSubmit: (data: any) => void;
}

export function PublicJobForm({
  currentStep,
  nextStep,
  prevStep,
  handleSubmit,
}: PublicJobFormProps) {
  // Form data state
  const [formData, setFormData] = useState<PublicFormData>({
    campaignImageUrl: "",
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
    campaignDuration: "",
    postDeadline: "",
    multipleCreators: false,
    agreeToTerms: false,
    contentApproval: true,
    allowShowcase: true,
    taskType: "",
    collaborationType: "",
    paymentType: "",
    followerSize: "",
    totalPayment: "",
  });

  const [selectedNiche, setSelectedNiche] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(
    []
  );
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [offerType, setOfferType] = useState<OfferType>("fixed");
  const [otherContentType, setOtherContentType] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleNiche = (category: string) => {
    setSelectedNiche((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

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

  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleCountry = (val: string) => {
    setFormData((prev) => ({ ...prev, location: val }));
  };

  const handlePlatformToggle = (platform: Platform) => {
    const newPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter((p) => p !== platform)
      : [...selectedPlatforms, platform];

    setSelectedPlatforms(newPlatforms);

    // Clear platform error when user selects a platform
    if (newPlatforms.length > 0 && errors.platforms) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.platforms;
        return newErrors;
      });
    }
  };

  const handleContentTypeToggle = (type: ContentType) => {
    const newContentTypes = selectedContentTypes.includes(type)
      ? selectedContentTypes.filter((t) => t !== type)
      : [...selectedContentTypes, type];

    setSelectedContentTypes(newContentTypes);

    // Clear contentTypes error when user selects a type
    if (newContentTypes.length > 0 && errors.contentTypes) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.contentTypes;
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

  const handleCampaignUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsUploading(true);
    const file = event.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await apiUpload(formData);
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
        if (fileInputRef.current) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.campaignImageUrl;
            return newErrors;
          });
        }
        
      }
    }
  };

  const onNextStep = async () => {
    try {
      // Step 1
      if (currentStep === 1) {
        step1Schema.parse({
          campaignName: formData.campaignName,
          campaignBrief: formData.campaignBrief,
          budget: formData.budget,
          platforms: selectedPlatforms,
          agreeToTerms: formData.agreeToTerms,
          taskType: formData.taskType,
          paymentType: formData.paymentType,
          followerSize: formData.followerSize,
          campaignImageUrl: formData.campaignImageUrl,
          campaignDuration: formData.campaignDuration,
          postDeadline: formData.postDeadline,
          location: formData.location,
        });
      }
      // Step 2
      else if (currentStep === 2) {
        step2Schema.parse({
          campaignGoal: formData.campaignGoal,
          requirements: formData.requirements,
          contentTypes: selectedContentTypes,
          captionGuidelines: formData.captionGuidelines,
          niche: selectedNiche,
        });
      }
      // Step 3
      else if (currentStep === 3) {
        step3Schema.parse({
          totalPayment: formData.totalPayment,
          collaborationType: formData.collaborationType,
          multipleCreators: formData.multipleCreators,
          contentApproval: formData.contentApproval,
          allowShowcase: formData.allowShowcase,
          offerType: offerType,
        });
      }
      // Step 4
      else if (currentStep === 4) {
        step4Schema.parse({
          hashtags: hashtags,
          tagUs: formData.tagUs,
          keepItAuthentic: formData.keepItAuthentic,
          dontDo: formData.dontDo,
        });
      }

      setErrors({});

      if (currentStep === 4) {
        const data = {
          ...formData,
          selectedPlatforms,
          selectedContentTypes,
          hashtags,
          niche: selectedNiche,
          offerType,
        };
        handleSubmit(data);
      } else {
        nextStep();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          formattedErrors[path] = err.message;
        });
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <div className="transition-all duration-300 ease-in-out">
      {/* Step 1: Basic job ad information */}
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
              onClick={handleCampaignUpload}
              disabled={isUploading}
              className={`back-button !w-40 ${
                errors.campaignImageUrl ? "border-red-500" : "border-gray-400"
              }`}
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

          <div className="space-y-4">
            <div>
              <label
                htmlFor="campaignName"
                className="block text-xs text-white mb-1"
              >
                Campaign Name
              </label>
              <Input
                type="text"
                id="campaignName"
                name="campaignName"
                placeholder="Enter Job Title for your Campaign"
                className={`w-full rounded-full bg-transparent border text-white focus:border-[#00CEC9] ${
                  errors.campaignName ? "border-red-500" : "border-gray-400"
                }`}
                value={formData.campaignName}
                onChange={handleInputChange}
              />
              {errors.campaignName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.campaignName}
                </p>
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
                <span className="text-xs text-gray-400">
                  Max 150 Characters
                </span>
              </div>
              <Textarea
                id="campaignBrief"
                name="campaignBrief"
                placeholder="What type of content & influencer you're looking for"
                className={`w-full px-4 py-3 rounded-xl bg-transparent border text-white focus:border-[#00CEC9] focus:outline-none resize-none h-24 ${
                  errors.campaignBrief ? "border-red-500" : "border-gray-400"
                }`}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="taskType"
                  className="block text-xs text-white mb-1"
                >
                  Task Type
                </label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("taskType", value)
                  }
                >
                  <SelectTrigger className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="giveaway">Giveaway</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="sponsored">Sponsored</SelectItem>
                  </SelectContent>
                </Select>
                {errors.taskType && (
                  <p className="text-xs text-red-500 mt-1">{errors.taskType}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="paymentType"
                  className="block text-xs text-white mb-1"
                >
                  Payment Type
                </label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("paymentType", value)
                  }
                >
                  <SelectTrigger className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]">
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="commission">Commission</SelectItem>
                  </SelectContent>
                </Select>
                {errors.paymentType && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.paymentType}
                  </p>
                )}
              </div>
            </div>

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
              <div>
                <label
                  htmlFor="followerSize"
                  className="block text-xs text-white mb-1"
                >
                  Follower Size
                </label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("followerSize", value)
                  }
                >
                  <SelectTrigger className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]">
                    <SelectValue placeholder="Select follower size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nano">
                      Nano (1,000 - 10,000 followers)
                    </SelectItem>
                    <SelectItem value="micro">
                      Micro (10,000 - 50,000 followers)
                    </SelectItem>
                    <SelectItem value="mid">
                      Mid (50,000 - 500,000 followers)
                    </SelectItem>
                    <SelectItem value="macro">
                      Macro (500,000+ followers)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.followerSize && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.followerSize}
                  </p>
                )}
              </div>
              <div className="relative">
                <label
                  htmlFor="budget"
                  className="block text-xs text-white mb-1"
                >
                  Budget
                </label>
                <span className="absolute left-4 top-[30px] text-white text-sm pointer-events-none">
                  $
                </span>
                <Input
                  type="text"
                  id="budget"
                  name="budget"
                  placeholder="Enter Campaign Budget"
                  className={`w-full pl-8 rounded-full bg-transparent border text-white focus:border-[#00CEC9] ${
                    errors.budget ? "border-red-500" : "border-gray-400"
                  }`}
                  value={formData.budget}
                  onChange={handleInputChange}
                />
                {errors.budget && (
                  <p className="text-xs text-red-500 mt-1">{errors.budget}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs text-white mb-2">
                Offer System
              </label>
              <OfferTypeButtons
                offerType={offerType}
                onOfferTypeChange={setOfferType}
              />
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
                onChange={(date) => {
                 const isoString = date ? date.toISOString() : "";
                  setFormData((prev) => ({ ...prev, postDeadline: isoString }));

                  // Clear existing error if any
                  if (errors.postDeadline) {
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.postDeadline;
                      return newErrors;
                    });
                  }
                }}
              />
              {errors.postDeadline && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.postDeadline}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-xs text-white mb-1"
              >
                Location (Optional)
              </label>
              <Combobox
                options={countries}
                value={formData.location}
                onChange={(val) => {
                  handleCountry(val);
                }}
                placeholder="Select country..."
              />
            </div>

            <ToggleSwitch
              name="multipleCreators"
              checked={formData.multipleCreators}
              onChange={handleToggleChange}
              label="Multiple Creators available"
            />

            <div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => ({
                      ...prev,
                      agreeToTerms: checked === true,
                    }));
                    // Clear error when user checks the box
                    if (checked && errors.agreeToTerms) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.agreeToTerms;
                        return newErrors;
                      });
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-400 bg-transparent text-[#00CEC9] focus:ring-[#00CEC9]"
                />
                <label htmlFor="agreeToTerms" className="text-xs text-white">
                  Agree to EpicLinx{" "}
                  <Link
                    href="/terms-and-conditions"
                    className="text-epiclinx-teal"
                  >
                    Terms & Conditions
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.agreeToTerms}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: What's this about? */}
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
              id="campaignGoal"
              name="campaignGoal"
              placeholder="E.g., Promote a product, boost brand awareness, increase sales"
              className={`w-full rounded-full bg-transparent border text-white focus:border-[#00CEC9] ${
                errors.campaignGoal ? "border-red-500" : "border-gray-400"
              }`}
              value={formData.campaignGoal}
              onChange={handleInputChange}
            />
            {errors.campaignGoal && (
              <p className="text-xs text-red-500 mt-1">{errors.campaignGoal}</p>
            )}
          </div>

          <div>
            <label className="block text-xs text-white mb-2">
              Select Niche
            </label>
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
              id="requirements"
              name="requirements"
              placeholder="E.g., 1 Instagram Reel + 2 Stories"
              className={`w-full rounded-full bg-transparent border text-white focus:border-[#00CEC9] ${
                errors.requirements ? "border-red-500" : "border-gray-400"
              }`}
              value={formData.requirements}
              onChange={handleInputChange}
            />
            {errors.requirements && (
              <p className="text-xs text-red-500 mt-1">{errors.requirements}</p>
            )}
          </div>

          <div>
            <label className="block text-xs text-white mb-2">
              Type of content
            </label>
            <ContentTypeButtons
              selectedContentTypes={selectedContentTypes}
              onContentTypeToggle={handleContentTypeToggle}
            />
            {errors.contentTypes && (
              <p className="text-xs text-red-500 mt-1">{errors.contentTypes}</p>
            )}
            {selectedContentTypes.includes("Other") && (
              <Input
                type="text"
                placeholder="Other content type"
                className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9] mt-2"
                value={otherContentType}
                onChange={(e) => {
                  setOtherContentType(e.target.value);
                }}
              />
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
              id="captionGuidelines"
              name="captionGuidelines"
              placeholder="E.g., Mention our brand and use #OurHashtag"
              className={`w-full rounded-full bg-transparent border text-white focus:border-[#00CEC9] ${
                errors.captionGuidelines ? "border-red-500" : "border-gray-400"
              }`}
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

      {/* Step 3: Payment & deliverables */}
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
                onValueChange={(value) =>
                  handleSelectChange("collaborationType", value)
                }
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
                type="text"
                id="totalPayment"
                name="totalPayment"
                placeholder="Enter Total Payment"
                className={`w-full pl-8 rounded-full bg-transparent border text-white focus:border-[#00CEC9] ${
                  errors.totalPayment ? "border-red-500" : "border-gray-400"
                }`}
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
              <ToggleSwitch
                name="contentApproval"
                checked={formData.contentApproval}
                onChange={handleToggleChange}
                label="Content approval"
              />

              <ToggleSwitch
                name="allowShowcase"
                checked={formData.allowShowcase}
                onChange={handleToggleChange}
                label="Allow us to showcase your content in our ads"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Final touches */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <label htmlFor="tagUs" className="block text-xs text-white mb-1">
              Tag Us
            </label>
            <Input
              type="text"
              id="tagUs"
              name="tagUs"
              placeholder="@BrandHandle"
              className={`w-full rounded-full bg-transparent border text-white focus:border-[#00CEC9] ${
                errors.tagUs ? "border-red-500" : "border-gray-400"
              }`}
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
              id="keepItAuthentic"
              name="keepItAuthentic"
              placeholder="E.g., Be yourself, make it engaging"
              className={`w-full rounded-full bg-transparent border text-white focus:border-[#00CEC9] ${
                errors.keepItAuthentic ? "border-red-500" : "border-gray-400"
              }`}
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
              id="dontDo"
              name="dontDo"
              placeholder="E.g., No competitor mentions, no misleading claims"
              className={`w-full rounded-full bg-transparent border text-white focus:border-[#00CEC9] ${
                errors.dontDo ? "border-red-500" : "border-gray-400"
              }`}
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
      />
    </div>
  );
}
