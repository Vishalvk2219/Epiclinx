// brand/PublicJobForm.tsx
"use client";

import type React from "react";
import { useRef, useState } from "react";
import Image from "next/image";
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

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(
    []
  );
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [offerType, setOfferType] = useState<OfferType>("fixed");
  const [otherContentType, setOtherContentType] = useState("");
  // const [selectedCountry, setSelectedCountry] = useState(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Input change handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleCountry = (val:string) =>{
    setFormData((prev)=>({...prev,location:val}))
  }
  const handlePlatformToggle = (platform: Platform) => {
    const newPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter((p) => p !== platform)
      : [...selectedPlatforms, platform];

    setSelectedPlatforms(newPlatforms);
  };

  const handleContentTypeToggle = (type: ContentType) => {
    const newContentTypes = selectedContentTypes.includes(type)
      ? selectedContentTypes.filter((t) => t !== type)
      : [...selectedContentTypes, type];

    setSelectedContentTypes(newContentTypes);
  };

  const addHashtag = (tag: string) => {
    if (tag && !hashtags.includes(tag)) {
      const newHashtags = [...hashtags, tag];
      setHashtags(newHashtags);
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
    const file = event.target.files?.[0];
    if (file) {
      // setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsUploading(true);
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
      }
    }
  };
  const onNextStep = async () => {
    // Validate based on current step
    const fieldsToValidate = [];
    let isValid = true;

    if (currentStep === 1) {
      // Step 1 validation
      if (!formData.campaignName.trim()) {
        document
          .getElementById("campaignName")
          ?.classList.add("border-red-500");
        document
          .getElementById("campaignName-error")
          ?.classList.remove("hidden");
        isValid = false;
      } else {
        document
          .getElementById("campaignName")
          ?.classList.remove("border-red-500");
        document.getElementById("campaignName-error")?.classList.add("hidden");
      }

      if (!formData.campaignBrief.trim()) {
        document
          .getElementById("campaignBrief")
          ?.classList.add("border-red-500");
        document
          .getElementById("campaignBrief-error")
          ?.classList.remove("hidden");
        isValid = false;
      } else {
        document
          .getElementById("campaignBrief")
          ?.classList.remove("border-red-500");
        document.getElementById("campaignBrief-error")?.classList.add("hidden");
      }

      if (!formData.budget.trim()) {
        document.getElementById("budget")?.classList.add("border-red-500");
        document.getElementById("budget-error")?.classList.remove("hidden");
        isValid = false;
      } else if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(formData.budget)) {
        document.getElementById("budget")?.classList.add("border-red-500");
        document.getElementById("budget-error")?.classList.remove("hidden");
        document.getElementById("budget-error-text").innerText =
          "Please enter a valid amount";
        isValid = false;
      } else {
        document.getElementById("budget")?.classList.remove("border-red-500");
        document.getElementById("budget-error")?.classList.add("hidden");
      }

      if (selectedPlatforms.length === 0) {
        document.getElementById("platforms-error")?.classList.remove("hidden");
        isValid = false;
      } else {
        document.getElementById("platforms-error")?.classList.add("hidden");
      }

      if (!formData.agreeToTerms) {
        document.getElementById("terms-error")?.classList.remove("hidden");
        isValid = false;
      } else {
        document.getElementById("terms-error")?.classList.add("hidden");
      }
    } else if (currentStep === 2) {
      // Step 2 validation
      if (!formData.campaignGoal.trim()) {
        document
          .getElementById("campaignGoal")
          ?.classList.add("border-red-500");
        document
          .getElementById("campaignGoal-error")
          ?.classList.remove("hidden");
        isValid = false;
      } else {
        document
          .getElementById("campaignGoal")
          ?.classList.remove("border-red-500");
        document.getElementById("campaignGoal-error")?.classList.add("hidden");
      }

      if (!formData.requirements.trim()) {
        document
          .getElementById("requirements")
          ?.classList.add("border-red-500");
        document
          .getElementById("requirements-error")
          ?.classList.remove("hidden");
        isValid = false;
      } else {
        document
          .getElementById("requirements")
          ?.classList.remove("border-red-500");
        document.getElementById("requirements-error")?.classList.add("hidden");
      }

      if (selectedContentTypes.length === 0) {
        document
          .getElementById("contentTypes-error")
          ?.classList.remove("hidden");
        isValid = false;
      } else {
        document.getElementById("contentTypes-error")?.classList.add("hidden");
      }

      if (!formData.captionGuidelines.trim()) {
        document
          .getElementById("captionGuidelines")
          ?.classList.add("border-red-500");
        document
          .getElementById("captionGuidelines-error")
          ?.classList.remove("hidden");
        isValid = false;
      } else {
        document
          .getElementById("captionGuidelines")
          ?.classList.remove("border-red-500");
        document
          .getElementById("captionGuidelines-error")
          ?.classList.add("hidden");
      }
    } else if (currentStep === 3) {
      // Step 3 validation
      const totalPaymentInput = document.getElementById(
        "totalPayment"
      ) as HTMLInputElement;
      if (!totalPaymentInput?.value.trim()) {
        totalPaymentInput?.classList.add("border-red-500");
        document
          .getElementById("totalPayment-error")
          ?.classList.remove("hidden");
        document.getElementById("totalPayment-error-text").innerText =
          "Total payment is required";
        isValid = false;
      } else if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(totalPaymentInput.value)) {
        totalPaymentInput?.classList.add("border-red-500");
        document
          .getElementById("totalPayment-error")
          ?.classList.remove("hidden");
        document.getElementById("totalPayment-error-text").innerText =
          "Please enter a valid amount";
        isValid = false;
      } else {
        totalPaymentInput?.classList.remove("border-red-500");
        document.getElementById("totalPayment-error")?.classList.add("hidden");
      }
    } else if (currentStep === 4) {
      // Step 4 validation
      if (!formData.tagUs.trim()) {
        document.getElementById("tagUs")?.classList.add("border-red-500");
        document.getElementById("tagUs-error")?.classList.remove("hidden");
        isValid = false;
      } else {
        document.getElementById("tagUs")?.classList.remove("border-red-500");
        document.getElementById("tagUs-error")?.classList.add("hidden");
      }

      if (!formData.keepItAuthentic.trim()) {
        document
          .getElementById("keepItAuthentic")
          ?.classList.add("border-red-500");
        document
          .getElementById("keepItAuthentic-error")
          ?.classList.remove("hidden");
        isValid = false;
      } else {
        document
          .getElementById("keepItAuthentic")
          ?.classList.remove("border-red-500");
        document
          .getElementById("keepItAuthentic-error")
          ?.classList.add("hidden");
      }

      if (!formData.dontDo.trim()) {
        document.getElementById("dontDo")?.classList.add("border-red-500");
        document.getElementById("dontDo-error")?.classList.remove("hidden");
        isValid = false;
      } else {
        document.getElementById("dontDo")?.classList.remove("border-red-500");
        document.getElementById("dontDo-error")?.classList.add("hidden");
      }
    }

    if (isValid) {
      if (currentStep === 4) {
        // Submit the form
        const data = {
          ...formData,
          selectedPlatforms,
          selectedContentTypes,
          hashtags,
          offerType,
        };
        handleSubmit(data);
      } else {
        nextStep();
      }
    }
  };

  // Render the appropriate step based on currentStep
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
            {/* <div className="text-white">{formData.campaignName || "Your Brand"}</div> */}
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
                className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]"
                value={formData.campaignName}
                onChange={handleInputChange}
              />
              {/* Error message */}
              <p
                id="campaignName-error"
                className="text-xs text-red-500 mt-1 hidden"
              >
                Campaign name is required
              </p>
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
                className="w-full px-4 py-3 rounded-xl bg-transparent border border-gray-400 text-white focus:border-[#00CEC9] focus:outline-none resize-none h-24"
                maxLength={150}
                value={formData.campaignBrief}
                onChange={handleInputChange}
              />
              {/* Error message */}
              <p
                id="campaignBrief-error"
                className="text-xs text-red-500 mt-1 hidden"
              >
                Campaign brief is required
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="TaskType"
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
              </div>
            </div>

            <div>
              <label className="block text-xs text-white mb-2">Platform</label>
              <PlatformButtons
                selectedPlatforms={selectedPlatforms}
                onPlatformToggle={handlePlatformToggle}
              />
              {/* Error message */}
              <p
                id="platforms-error"
                className="text-xs text-red-500 mt-1 hidden"
              >
                Please select at least one platform
              </p>
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
                  className="w-full pl-8 rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]"
                  value={formData.budget}
                  onChange={handleInputChange}
                />
                {/* Error message */}
                <p
                  id="budget-error"
                  className="text-xs text-red-500 mt-1 hidden"
                >
                  <span id="budget-error-text">Budget is required</span>
                </p>
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
                <Link
                  href="/terms-and-conditions"
                  className="text-epiclinx-teal"
                >
                  Terms & Conditions
                </Link>
              </label>
            </div>
            {/* Error message */}
            <p id="terms-error" className="text-xs text-red-500 mt-1 hidden">
              You must agree to the terms and conditions
            </p>
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
              className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]"
              value={formData.campaignGoal}
              onChange={handleInputChange}
            />
            {/* Error message */}
            <p
              id="campaignGoal-error"
              className="text-xs text-red-500 mt-1 hidden"
            >
              Campaign goal is required
            </p>
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
              className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]"
              value={formData.requirements}
              onChange={handleInputChange}
            />
            {/* Error message */}
            <p
              id="requirements-error"
              className="text-xs text-red-500 mt-1 hidden"
            >
              Requirements are required
            </p>
          </div>

          <div>
            <label className="block text-xs text-white mb-2">
              Type of content
            </label>
            <ContentTypeButtons
              selectedContentTypes={selectedContentTypes}
              onContentTypeToggle={handleContentTypeToggle}
            />
            {/* Error message */}
            <p
              id="contentTypes-error"
              className="text-xs text-red-500 mt-1 hidden"
            >
              Please select at least one content type
            </p>
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
              className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]"
              value={formData.captionGuidelines}
              onChange={handleInputChange}
            />
            {/* Error message */}
            <p
              id="captionGuidelines-error"
              className="text-xs text-red-500 mt-1 hidden"
            >
              Caption guidelines are required
            </p>
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
                className="w-full pl-8 rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]"
                value={formData.totalPayment}
                onChange={handleInputChange}
              />
              {/* Error message */}
              <p
                id="totalPayment-error"
                className="text-xs text-red-500 mt-1 hidden"
              >
                <span id="totalPayment-error-text">
                  Total payment is required
                </span>
              </p>
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
              className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]"
              value={formData.tagUs}
              onChange={handleInputChange}
            />
            {/* Error message */}
            <p id="tagUs-error" className="text-xs text-red-500 mt-1 hidden">
              Tag information is required
            </p>
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
              className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]"
              value={formData.keepItAuthentic}
              onChange={handleInputChange}
            />
            {/* Error message */}
            <p
              id="keepItAuthentic-error"
              className="text-xs text-red-500 mt-1 hidden"
            >
              This field is required
            </p>
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
              className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]"
              value={formData.dontDo}
              onChange={handleInputChange}
            />
            {/* Error message */}
            <p id="dontDo-error" className="text-xs text-red-500 mt-1 hidden">
              This field is required
            </p>
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
