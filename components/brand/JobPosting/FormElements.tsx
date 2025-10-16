"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { X, Plus } from "lucide-react"
import { Platform } from "@/lib/types"
import { Input } from "@/components/ui/input"

interface PlatformButtonsProps {
  selectedPlatforms: string[]
  onPlatformToggle: (platform: Platform) => void
}

export function PlatformButtons({ selectedPlatforms, onPlatformToggle }: PlatformButtonsProps) {
  const platforms: Platform[] = ["TikTok", "Instagram", "YouTube", "Facebook", "Snapchat", "Twitch", "Kick"]

  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map((platform) => (
        <button
          key={platform}
          onClick={() => onPlatformToggle(platform)}
          className={cn(
            "px-4 py-1 rounded-full text-sm transition-colors",
            selectedPlatforms.includes(platform)
              ? "bg-epiclinx-teal text-black"
              : "bg-epiclinx-semiteal text-black"
          )}
        >
          {platform}
        </button>
      ))}
    </div>
  )
}

interface ContentTypeButtonsProps {
  selectedContentTypes: string[]
  onContentTypeToggle: (type: string) => void
}

export function ContentTypeButtons({ selectedContentTypes, onContentTypeToggle }: ContentTypeButtonsProps) {
  const contentTypes: string[] = ["Video", "Photo", "Story", "Other"]

  return (
    <div className="flex flex-wrap gap-2">
      {contentTypes.map((type) => (
        <button
          key={type}
          onClick={() => onContentTypeToggle(type)}
          className={cn(
            "px-4 py-1 rounded-full text-sm transition-colors",
            selectedContentTypes.includes(type)
              ? "bg-epiclinx-teal text-black"
              : "bg-epiclinx-semiteal text-black"
          )}
        >
          {type}
        </button>
      ))}
    </div>
  )
}

interface OfferTypeButtonsProps {
  offerType: "fixed" | "bid"
  onOfferTypeChange: (type: "fixed" | "bid") => void
}

export function OfferTypeButtons({ offerType, onOfferTypeChange }: OfferTypeButtonsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onOfferTypeChange("fixed")}
        className={cn(
          "px-4 py-1 rounded-full text-sm transition-colors",
          offerType === "fixed" ? "bg-epiclinx-teal text-black" : "bg-epiclinx-semiteal text-black"
        )}
      >
        Fixed
      </button>
      <button
        onClick={() => onOfferTypeChange("bid")}
        className={cn(
          "px-4 py-1 rounded-full text-sm transition-colors",
          offerType === "bid" ? "bg-epiclinx-teal text-black" : "bg-epiclinx-semiteal text-black"
        )}
      >
        Bid (For Jobs $1000+ Only)
      </button>
    </div>
  )
}

interface HashtagsInputProps {
  hashtags: string[]
  onAddHashtag: (tag: string) => void
  onRemoveHashtag: (tag: string) => void
}

export function HashtagsInput({ hashtags, onAddHashtag, onRemoveHashtag }: HashtagsInputProps) {
  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value) {
      e.preventDefault()
      onAddHashtag(e.currentTarget.value)
      e.currentTarget.value = ""
    }
  }

  return (
    <div className="flex flex-col gap-2 bg-transparent">
  <Input
    type="text"
    placeholder="Type and press Enter"
    className="w-full rounded-full bg-transparent border border-gray-400 text-white focus:border-[#00CEC9]"
    onKeyDown={handleHashtagKeyDown}
  />

  <div className="flex flex-wrap gap-2">
    {hashtags.map((tag) => (
      <div
        key={tag}
        className="flex items-center bg-epiclinx-semiteal rounded-full text-black px-2 py-1 text-sm"
      >
        #{tag}
        <button
          onClick={() => onRemoveHashtag(tag)}
          className="ml-1 text-gray-400 hover:text-black"
        >
          <X size={14} color="black" />
        </button>
      </div>
    ))}
  </div>
</div>

  )
}

interface ToggleSwitchProps {
  name: string
  checked: boolean
  onChange: (name: string, checked: boolean) => void
  label: string
}

export function ToggleSwitch({ name, checked, onChange, label }: ToggleSwitchProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={() => onChange(name, !checked)}
        />
        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-epiclinx-teal peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
      </label>
      <span className="text-xs text-white">{label}</span>
    </div>
  )
}

interface NavigationButtonsProps {
  showBack?: boolean
  onBack?: () => void
  onNext: () => void
  nextLabel?: string
}

export function NavigationButtons({
  showBack = false,
  onBack,
  onNext,
  nextLabel = "Continue"
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-center gap-4 mt-8">
      {showBack ? (
        <button
          onClick={onBack}
          className="back-button"
        >
          Back
        </button>
      ) : (
        <div></div> // Empty div to maintain spacing
      )}

      <button
        onClick={onNext}
        className="next-button"
      >
        {nextLabel}
      </button>
    </div>
  )
}