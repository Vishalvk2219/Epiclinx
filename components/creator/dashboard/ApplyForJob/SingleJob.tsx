"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { OffersList } from "@/components/creator/dashboard/ApplyForJob/OfferListing"
import CampaignCard from "../CampaignCard"
import Image from "next/image"
import { ChevronDown, ChevronUp } from "lucide-react"
import { SingleOrderMessage } from "./SingleOrderMessage"

type JobStatus = "pending" | "submitted" | "in-progress" | "accepted" | "completed" | "declined"

export function SingleJob() {
    const [status, setStatus] = useState<JobStatus>("accepted")
    const [offerAmount, setOfferAmount] = useState("3,000")
    const [activeSection, setActiveSection] = useState<"offers" | "messages">("offers")
    const [showMore, setShowMore] = useState(false)

    const toggleShowMore = () => setShowMore(prev => !prev)

    return (
        <div className="flex flex-col gap-4">
            {/* Job Card */}
            <div className="bg-epiclinx-semiteal !text-black rounded-3xl overflow-hidden shadow-lg">

                {/* Job Header */}
                <CampaignCard campaignId={"AD204"} />
            </div>

            {/* Your Bid Section */}
            <div className="bg-white rounded-3xl p-4 flex justify-between items-center shadow-md">
                <h2 className="font-bold text-xl text-black">Your Bid</h2>
                <div className="flex items-center gap-4">
                    <span className="font-bold text-black">${offerAmount}</span>
                    {status === "pending" && (
                        <button className="text-red-500 text-sm font-medium border border-red-500 hover:bg-red-50 px-4 py-1 rounded-full">
                            Cancel Application
                        </button>
                    )}
                </div>
            </div>

            {/* Placeholder for pending status */}
            {status === "pending" && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-[#00d4c5]">
                        <Image src={'/shapes/shape4.svg'} alt="Shape" width={50} height={50} />
                    </div>
                    <h3 className="font-medium text-xl mt-4 md:max-w-md">
                        Hang tight — once you're accepted, the full opportunity unlocks right here.
                    </h3>
                </div>
            )}

            {/* Section Toggle Buttons */}
            <div className="flex items-center justify-between my-10">
                <div className="text-2xl font-bold">
                    {activeSection === "offers" ? "All Offers" : "Messages"}
                </div>
                <div className="flex rounded-full bg-[#3A3A3A] p-1">
                    <button
                        onClick={() => setActiveSection("offers")}
                        className={cn(
                            "rounded-full px-4 py-2 text-sm transition-colors",
                            activeSection === "offers" ? "bg-[#00E5C7] text-[#2A2A2A]" : "text-white hover:text-[#00E5C7]"
                        )}
                    >
                        Offers
                    </button>
                    <button
                        onClick={() => setActiveSection("messages")}
                        className={cn(
                            "rounded-full px-4 py-2 text-sm transition-colors",
                            activeSection === "messages" ? "bg-[#00E5C7] text-[#2A2A2A]" : "text-white hover:text-[#00E5C7]"
                        )}
                    >
                        Messages
                    </button>
                </div>
            </div>

            {/* Conditionally Render Section */}
            {activeSection === "offers" && (
                <div>
                    {/* Replace this with actual jobs listing */}
                    <OffersList />
                </div>
            )}

            {activeSection === "messages" && (
                <div>
                    {/* Replace this with actual messages */}
                    <SingleOrderMessage />
                </div>
            )}
        </div>
    )
}
