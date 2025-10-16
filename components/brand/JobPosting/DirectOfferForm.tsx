//brand/DirectOfferForm.tsx

"use client"

import React from "react"
import { useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { DirectFormData, Platform } from "@/lib/types"
import { HashtagsInput, NavigationButtons, PlatformButtons } from "./FormElements"
import { Calendar } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/DatePicker"

interface DirectOfferFormProps {
    currentStep: number
    nextStep: () => void
    prevStep: () => void
    handleSubmit: () => void
}

export function DirectOfferForm({ currentStep, nextStep, prevStep, handleSubmit }: DirectOfferFormProps) {
    const [hashtags, setHashtags] = useState<string[]>([])
    const [date, setDate] = React.useState<Date>()
    const [formData, setFormData] = useState<DirectFormData>({
        campaignName: "",
        campaignBrief: "",
        campaignDuration: "",
        postDeadline: "",
        campaignGoal: "",
        requirements: "",
        captionGuidelines: "",
        tagUs: "",
        keepItAuthentic: "",
        dontDo: "",
        agreeToTerms: false,
        contentApproval: true,
        allowShowcase: true,
    })

    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handlePlatformToggle = (platform: Platform) => {
        const newPlatforms = selectedPlatforms.includes(platform)
            ? selectedPlatforms.filter((p) => p !== platform)
            : [...selectedPlatforms, platform]

        setSelectedPlatforms(newPlatforms)
    }

    const onNextStep = () => {
        // Validate based on current step
        let isValid = true

        if (currentStep === 1) {
            // Step 1 validation
            if (!formData.campaignName.trim()) {
                document.getElementById("direct-campaignName")?.classList.add("border-red-500")
                document.getElementById("direct-campaignName-error")?.classList.remove("hidden")
                isValid = false
            } else {
                document.getElementById("direct-campaignName")?.classList.remove("border-red-500")
                document.getElementById("direct-campaignName-error")?.classList.add("hidden")
            }

            if (!formData.campaignBrief.trim()) {
                document.getElementById("direct-campaignBrief")?.classList.add("border-red-500")
                document.getElementById("direct-campaignBrief-error")?.classList.remove("hidden")
                isValid = false
            } else {
                document.getElementById("direct-campaignBrief")?.classList.remove("border-red-500")
                document.getElementById("direct-campaignBrief-error")?.classList.add("hidden")
            }

            if (selectedPlatforms.length === 0) {
                document.getElementById("direct-platforms-error")?.classList.remove("hidden")
                isValid = false
            } else {
                document.getElementById("direct-platforms-error")?.classList.add("hidden")
            }

            if (!formData.campaignDuration.trim()) {
                document.getElementById("direct-campaignDuration")?.classList.add("border-red-500")
                document.getElementById("direct-campaignDuration-error")?.classList.remove("hidden")
                isValid = false
            } else {
                document.getElementById("direct-campaignDuration")?.classList.remove("border-red-500")
                document.getElementById("direct-campaignDuration-error")?.classList.add("hidden")
            }

            if (!formData.postDeadline.trim()) {
                document.getElementById("direct-postDeadline")?.classList.add("border-red-500")
                document.getElementById("direct-postDeadline-error")?.classList.remove("hidden")
                isValid = false
            } else {
                document.getElementById("direct-postDeadline")?.classList.remove("border-red-500")
                document.getElementById("direct-postDeadline-error")?.classList.add("hidden")
            }

            if (!formData.agreeToTerms) {
                document.getElementById("direct-terms-error")?.classList.remove("hidden")
                isValid = false
            } else {
                document.getElementById("direct-terms-error")?.classList.add("hidden")
            }
        } else if (currentStep === 2) {
            // Step 2 validation
            if (!formData.campaignGoal.trim()) {
                document.getElementById("direct-campaignGoal")?.classList.add("border-red-500")
                document.getElementById("direct-campaignGoal-error")?.classList.remove("hidden")
                isValid = false
            } else {
                document.getElementById("direct-campaignGoal")?.classList.remove("border-red-500")
                document.getElementById("direct-campaignGoal-error")?.classList.add("hidden")
            }

            if (!formData.requirements.trim()) {
                document.getElementById("direct-requirements")?.classList.add("border-red-500")
                document.getElementById("direct-requirements-error")?.classList.remove("hidden")
                isValid = false
            } else {
                document.getElementById("direct-requirements")?.classList.remove("border-red-500")
                document.getElementById("direct-requirements-error")?.classList.add("hidden")
            }

            if (!formData.captionGuidelines.trim()) {
                document.getElementById("direct-captionGuidelines")?.classList.add("border-red-500")
                document.getElementById("direct-captionGuidelines-error")?.classList.remove("hidden")
                isValid = false
            } else {
                document.getElementById("direct-captionGuidelines")?.classList.remove("border-red-500")
                document.getElementById("direct-captionGuidelines-error")?.classList.add("hidden")
            }
        } else if (currentStep === 3) {
            // Step 3 validation
            const totalPaymentInput = document.getElementById("direct-totalPayment") as HTMLInputElement
            if (!totalPaymentInput?.value.trim()) {
                totalPaymentInput?.classList.add("border-red-500")
                document.getElementById("direct-totalPayment-error")?.classList.remove("hidden")
                document.getElementById("direct-totalPayment-error-text").innerText = "Total payment is required"
                isValid = false
            } else if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(totalPaymentInput.value)) {
                totalPaymentInput?.classList.add("border-red-500")
                document.getElementById("direct-totalPayment-error")?.classList.remove("hidden")
                document.getElementById("direct-totalPayment-error-text").innerText = "Please enter a valid amount"
                isValid = false
            } else {
                totalPaymentInput?.classList.remove("border-red-500")
                document.getElementById("direct-totalPayment-error")?.classList.add("hidden")
            }
        } else if (currentStep === 4) {
            // Step 4 validation
            if (!formData.tagUs.trim()) {
                document.getElementById("direct-tagUs")?.classList.add("border-red-500")
                document.getElementById("direct-tagUs-error")?.classList.remove("hidden")
                isValid = false
            } else {
                document.getElementById("direct-tagUs")?.classList.remove("border-red-500")
                document.getElementById("direct-tagUs-error")?.classList.add("hidden")
            }

            if (!formData.keepItAuthentic.trim()) {
                document.getElementById("direct-keepItAuthentic")?.classList.add("border-red-500")
                document.getElementById("direct-keepItAuthentic-error")?.classList.remove("hidden")
                isValid = false
            } else {
                document.getElementById("direct-keepItAuthentic")?.classList.remove("border-red-500")
                document.getElementById("direct-keepItAuthentic-error")?.classList.add("hidden")
            }

            if (!formData.dontDo.trim()) {
                document.getElementById("direct-dontDo")?.classList.add("border-red-500")
                document.getElementById("direct-dontDo-error")?.classList.remove("hidden")
                isValid = false
            } else {
                document.getElementById("direct-dontDo")?.classList.remove("border-red-500")
                document.getElementById("direct-dontDo-error")?.classList.add("hidden")
            }
        }

        if (isValid) {
            if (currentStep === 4) {
                // Submit the form
                console.log("Form submitted", {
                    formData,
                    selectedPlatforms,
                    hashtags,
                })
                handleSubmit()
            } else {
                nextStep()
            }
        }
    }

    const addHashtag = (tag: string) => {
        if (tag && !hashtags.includes(tag)) {
            const newHashtags = [...hashtags, tag]
            setHashtags(newHashtags)
        }
    }

    const removeHashtag = (tag: string) => {
        const newHashtags = hashtags.filter((t) => t !== tag)
        setHashtags(newHashtags)
    }

    return (
        <div className="transition-all duration-300 ease-in-out">
            {/* Step 1: Basic job information */}
            {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden">
                            <Image src="/placeholder.svg" alt="Company Logo" width={64} height={64} />
                        </div>
                        <div className="text-white">H&M</div>
                        <button className="back-button !w-40">Upload photo</button>
                    </div>

                    <div>
                        <label htmlFor="campaignName" className="block text-xs text-white mb-1">
                            Campaign Name
                        </label>
                        <Input
                            type="text"
                            id="direct-campaignName"
                            name="campaignName"
                            placeholder="Enter Job Title for your Campaign"
                            className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]"
                            value={formData.campaignName}
                            onChange={handleInputChange}
                        />
                        {/* Error message */}
                        <p id="direct-campaignName-error" className="text-xs text-red-500 mt-1 hidden">
                            Campaign name is required
                        </p>
                    </div>

                    <div>
                        <div className="flex justify-between mb-1">
                            <label htmlFor="campaignBrief" className="block text-xs text-white">
                                Campaign Brief
                            </label>
                            <span className="text-xs text-gray-400">Max 150 Characters</span>
                        </div>
                        <Textarea
                            id="direct-campaignBrief"
                            name="campaignBrief"
                            placeholder="What type of content & influencer you're looking for"
                            className="w-full px-4 py-3 rounded-xl bg-transparent border border-gray-400 text-white focus:border-[#00CEC9] focus:outline-none resize-none h-24"
                            maxLength={150}
                            value={formData.campaignBrief}
                            onChange={handleInputChange}
                        />
                        {/* Error message */}
                        <p id="direct-campaignBrief-error" className="text-xs text-red-500 mt-1 hidden">
                            Campaign brief is required
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs text-white mb-2">Platform</label>
                        <PlatformButtons selectedPlatforms={selectedPlatforms} onPlatformToggle={handlePlatformToggle} />
                        {/* Error message */}
                        <p id="direct-platforms-error" className="text-xs text-red-500 mt-1 hidden">
                            Please select at least one platform
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <label htmlFor="direct-campaignDuration" className="block text-xs text-white mb-1">
                                Campaign Duration
                            </label>
                            <DatePicker
                                value={formData.campaignDuration ? new Date(formData.campaignDuration) : undefined}
                                onChange={(date) =>
                                    handleInputChange({
                                        target: {
                                            name: "campaignDuration",
                                            value: date ? date.toISOString().split("T")[0] : "",
                                        },
                                    })
                                }
                            />
                            {/* Error message */}
                            <p id="direct-campaignDuration-error" className="text-xs text-red-500 mt-1 hidden">
                                Campaign duration is required
                            </p>
                        </div>

                        <div className="relative">
                            <label htmlFor="postDeadline" className="block text-xs text-white mb-1">
                                Post Deadline
                            </label>
                            <DatePicker
                                value={formData.postDeadline ? new Date(formData.postDeadline) : undefined}
                                onChange={(date) =>
                                    handleInputChange({
                                        target: {
                                            name: "postDeadline",
                                            value: date ? date.toISOString().split("T")[0] : "",
                                        },
                                    })
                                }
                            />
                            {/* Error message */}
                            <p id="direct-postDeadline-error" className="text-xs text-red-500 mt-1 hidden">
                                Post deadline is required
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onCheckedChange={(checked) => {
                                setFormData((prev) => ({ ...prev, agreeToTerms: checked === true }))
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
                    {/* Error message */}
                    <p id="direct-terms-error" className="text-xs text-red-500 mt-1 hidden">
                        You must agree to the terms and conditions
                    </p>
                </div>
            )}

            {/* Step 2: What's this about? */}
            {currentStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                    <div>
                        <label htmlFor="campaignGoal" className="block text-xs text-white mb-1">
                            Campaign Goal
                        </label>
                        <Input
                            type="text"
                            id="direct-campaignGoal"
                            name="campaignGoal"
                            placeholder="E.g., Promote a product, boost brand awareness, increase sales"
                            className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]"
                            value={formData.campaignGoal}
                            onChange={handleInputChange}
                        />
                        {/* Error message */}
                        <p id="direct-campaignGoal-error" className="text-xs text-red-500 mt-1 hidden">
                            Campaign goal is required
                        </p>
                    </div>

                    <div>
                        <label htmlFor="requirements" className="block text-xs text-white mb-1">
                            What we need from you
                        </label>
                        <Input
                            type="text"
                            id="direct-requirements"
                            name="requirements"
                            placeholder="E.g., 1 Instagram Reel + 2 Stories"
                            className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]"
                            value={formData.requirements}
                            onChange={handleInputChange}
                        />
                        {/* Error message */}
                        <p id="direct-requirements-error" className="text-xs text-red-500 mt-1 hidden">
                            Requirements are required
                        </p>
                    </div>

                    <div>
                        <label htmlFor="captionGuidelines" className="block text-xs text-white mb-1">
                            Caption Guidelines
                        </label>
                        <Input
                            type="text"
                            id="direct-captionGuidelines"
                            name="captionGuidelines"
                            placeholder="E.g., Mention our brand and use #OurHashtag"
                            className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]"
                            value={formData.captionGuidelines}
                            onChange={handleInputChange}
                        />
                        {/* Error message */}
                        <p id="direct-captionGuidelines-error" className="text-xs text-red-500 mt-1 hidden">
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
                            <label htmlFor="collaborationType" className="block text-xs text-white mb-1">
                                Collaboration Type
                            </label>
                            <Select onValueChange={(value) => console.log(value)}>
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
                            <label htmlFor="totalPayment" className="block text-xs text-white mb-1">
                                Total Payment
                            </label>
                            <span className="absolute left-4 top-[30px] text-white text-sm pointer-events-none">$</span>
                            <Input
                                type="text"
                                id="direct-totalPayment"
                                placeholder="Enter Total Payment"
                                className="w-full pl-8 rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]"
                                onChange={handleInputChange}
                            />
                            {/* Error message */}
                            <p id="direct-totalPayment-error" className="text-xs text-red-500 mt-1 hidden">
                                <span id="direct-totalPayment-error-text">Total payment is required</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                This amount will remain private and is only visible to accepted creators. Held securely in escrow until
                                job completion.
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
                                            setFormData((prev) => ({ ...prev, contentApproval: e.target.checked }))
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
                                            setFormData((prev) => ({ ...prev, allowShowcase: e.target.checked }))
                                        }}
                                    />
                                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-[#00CEC9] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </label>
                                <span className="text-xs text-white">Allow us to showcase your content in our ads</span>
                            </div>
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
                            id="direct-tagUs"
                            name="tagUs"
                            placeholder="@BrandHandle"
                            className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]"
                            value={formData.tagUs}
                            onChange={handleInputChange}
                        />
                        {/* Error message */}
                        <p id="direct-tagUs-error" className="text-xs text-red-500 mt-1 hidden">
                            Tag information is required
                        </p>
                    </div>

                    <div>
                        <label htmlFor="hashtags" className="block text-xs text-white mb-1">
                            Required Hashtags
                        </label>
                        <HashtagsInput hashtags={hashtags} onAddHashtag={addHashtag} onRemoveHashtag={removeHashtag} />
                    </div>

                    <div>
                        <label htmlFor="keepItAuthentic" className="block text-xs text-white mb-1">
                            Keep it authentic
                        </label>
                        <Input
                            type="text"
                            id="direct-keepItAuthentic"
                            name="keepItAuthentic"
                            placeholder="E.g., Be yourself, make it engaging"
                            className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]"
                            value={formData.keepItAuthentic}
                            onChange={handleInputChange}
                        />
                        {/* Error message */}
                        <p id="direct-keepItAuthentic-error" className="text-xs text-red-500 mt-1 hidden">
                            This field is required
                        </p>
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
                            className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]"
                            value={formData.dontDo}
                            onChange={handleInputChange}
                        />
                        {/* Error message */}
                        <p id="direct-dontDo-error" className="text-xs text-red-500 mt-1 hidden">
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
    )
}
