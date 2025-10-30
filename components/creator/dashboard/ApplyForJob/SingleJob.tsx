"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { OffersList } from "@/components/creator/dashboard/ApplyForJob/OfferListing";
import CampaignCard from "../CampaignCard";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SingleOrderMessage } from "./SingleOrderMessage";
import { useSearchParams } from "next/navigation";
import { apiFetch, apiPost } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type bidStatus = "pending" | "accepted" | "rejected";

export function SingleJob() {
  const [status, setStatus] = useState<bidStatus | null>(null);
  const [bidNotSubmitted, setBidNotSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState<"offers" | "messages">(
    "offers"
  );
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [bid, setBid] = useState({ offerAmount: "", proposal: "" });
  const toggleShowMore = () => setShowMore((prev) => !prev);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  function handleChange(e) {
    setBid((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  const handleApplyJob = async () => {
    try {
      setLoading(true);
      const response = await apiPost("/bids", { ...bid, jobId: id });
      if (response?.success) {
        setBid({
          offerAmount: response.bid.amount,
          proposal: response.bid.proposal,
        });
        setStatus(response.bid.status);
        setBidNotSubmitted(false)
        toast({
          variant: "success",
          title: "Bid submitted successfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error submitting bid",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const bidData = async () => {
      setLoading(true);
      try {
        const response = await apiFetch(`/jobs/${id}`);
        if (response.success && response.bid) {
          setBid({
            offerAmount: response.bid.amount,
            proposal: response.bid.proposal,
          });
          setStatus(response.bid.status);
          setBidNotSubmitted(false)
        } else {
          setBidNotSubmitted(true)
        }
      } catch (error: any) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) bidData();
  }, [id]);

  if (loading)
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="bg-gray-200 h-40 rounded-2xl"></div>
        <div className="bg-gray-200 h-60 rounded-2xl"></div>
      </div>
    );

  return (
   <div className="flex flex-col gap-4">
      {/* Job Card */}
      <div className="bg-epiclinx-semiteal !text-black rounded-3xl overflow-hidden shadow-lg">
        {/* Job Header */}
        <CampaignCard campaignId={id} />
      </div>

      {!loading && bidNotSubmitted ? (
        <div className="bg-white shadow-lg rounded-2xl p-4 w-full mx-auto flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-white text-center bg-gray-700 mx-auto p-2 rounded-sm">
            Submit Your Bid
          </h2>

          {/* Offer Amount */}
          <div className="flex flex-col">
            <label
              htmlFor="offerAmount"
              className="text-sm font-medium text-gray-600 mb-1"
            >
              Your Bid ($)
            </label>
            <input
              id="offerAmount"
              name="offerAmount"
              type="number"
              placeholder="Enter your bid amount"
              value={bid.offerAmount}
              onChange={handleChange}
              required={true}
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition shadow-sm text-gray-800"
            />
          </div>

          {/* Proposal */}
          <div className="flex flex-col">
            <label
              htmlFor="proposal"
              className="text-sm font-medium text-gray-600 mb-1"
            >
              Proposal
            </label>
            <textarea
              id="proposal"
              name="proposal"
              placeholder="Write your proposal here..."
              value={bid.proposal}
              onChange={handleChange}
              rows={4}
              required={true}
              className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition shadow-sm text-gray-800 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleApplyJob}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-200 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-1"
          >
            Apply for Job
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 shadow-lg flex flex-col gap-4 w-full">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-2xl text-gray-800">Your Bid</h2>
            {/* Status Badge */}
            <span
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : status === "accepted"
                  ? "bg-green-100 text-green-800"
                  : status === "declined"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              )}
            >
              {status ? status.replace("-", " ") : "Pending"}
            </span>
          </div>

          {/* Bid Details */}
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-semibold text-gray-700">Amount:</span>{" "}
              <span className="text-gray-900 text-lg font-bold">
                ${bid.offerAmount}
              </span>
            </p>
            <p>
              <span className="font-semibold text-gray-700">Proposal:</span>{" "}
              <span className="text-gray-900">{bid.proposal}</span>
            </p>
          </div>

          {/* Cancel Button */}
          {status === "pending" && (
            <button className="self-start text-red-500 text-sm font-medium border border-red-500 hover:bg-red-50 px-4 py-1 rounded-full transition-colors duration-200">
              Cancel Application
            </button>
          )}
        </div>
      )}

      {/* Placeholder for pending status */}
      {status === "pending" && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-[#00d4c5]">
            <Image
              src={"/shapes/shape4.svg"}
              alt="Shape"
              width={50}
              height={50}
            />
          </div>
          <h3 className="font-medium text-xl mt-4 md:max-w-md">
            Hang tight — once you're accepted, the full opportunity unlocks
            right here.
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
              activeSection === "offers"
                ? "bg-[#00E5C7] text-[#2A2A2A]"
                : "text-white hover:text-[#00E5C7]"
            )}
          >
            Offers
          </button>
          <button
            onClick={() => setActiveSection("messages")}
            className={cn(
              "rounded-full px-4 py-2 text-sm transition-colors",
              activeSection === "messages"
                ? "bg-[#00E5C7] text-[#2A2A2A]"
                : "text-white hover:text-[#00E5C7]"
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
          <OffersList jobId={id} />
        </div>
      )}

      {activeSection === "messages" && (
        <div>
          {/* Replace this with actual messages */}
          <SingleOrderMessage />
        </div>
      )}
    </div>
  );
}
