"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface JobTabsProps {
  activeTab: "public" | "direct"
  onTabChange: (tab: "public" | "direct") => void
}

export function JobTabs({ activeTab, onTabChange }: JobTabsProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-800 rounded-full p-1 flex">
        <button
          className={cn(
            "px-6 py-2 rounded-full transition-all duration-300",
            activeTab === "public" ? "bg-[#00CEC9] text-black" : "text-white"
          )}
          onClick={() => onTabChange("public")}
        >
          Public Job
        </button>
        <button
          className={cn(
            "px-6 py-2 rounded-full transition-all duration-300",
            activeTab === "direct" ? "bg-[#00CEC9] text-black" : "text-white"
          )}
          onClick={() => onTabChange("direct")}
        >
          Direct Offer
        </button>
      </div>
    </div>
  )
}