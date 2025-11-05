"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Star,
  Users,
  X,
  Youtube,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PiInstagramLogoFill, PiTiktokLogoFill } from "react-icons/pi";
import { FaYoutube } from "react-icons/fa";
import { apiFetch } from "@/lib/api";

export function OffersList({ jobId }) {
  const [activeFilters, setActiveFilters] = useState<string[]>([
    "Lifestyle",
    "5,000-10,000",
    "TikTok",
    "AUS",
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [influencers, setInfluencers] = useState([]);

  useEffect(() => {
    if (!jobId) return;
    const fetchBids = async () => {
      try {
        const bidsData = await apiFetch(`/bids?id=${jobId}`);
        const requiredFieldBids = bidsData.bids.map((bids) => ({
          id: bids.creatorId._id,
          name: bids.creatorId.username || bids.creatorId.firstName,
          avatar: bids.creatorId.profileImageUrl,
          rating: bids.creatorId.rating,
          followers: bids.creatorId.followers || 1000,
          location: bids.creatorId.location,
          bid: bids.amount,
          tags: bids.creatorId.categories,

        }));
        console.log(requiredFieldBids);
        setInfluencers(requiredFieldBids);
      } catch (error: any) {
        console.log("Unable to fetch bids for the campaign", error.message);
      }
    };
    fetchBids();
  }, [jobId]);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(influencers.length / itemsPerPage);
  const currentInfluencers = influencers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  if (influencers.length === 0) {
    return <p>No Bids Found...</p>;
  }
  return (
    <div className="space-y-4 max-md:mt-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {influencers.length} bids received
        </h2>
      </div>

      <div className="space-y-4">
        {currentInfluencers.map((influencer) => (
          <div
            key={influencer.id}
            className="bg-white/10 rounded-3xl px-6 py-4 flex flex-col gap-4"
          >
            {/* Row 1: Avatar + Info + Stats */}
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              {/* Left: Avatar + Info */}
              <div className="flex gap-4">
                <Image
                  src={influencer.avatar || "/placeholder.svg"}
                  alt={influencer.name}
                  width={60}
                  height={60}
                  className="rounded-full object-cover w-16 h-16"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-white">
                      {influencer.name}
                    </h3>
                    <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center place-content-center">
                      <PiInstagramLogoFill className="w-5 h-5 text-white/80" />
                    </div>
                    <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                      <PiTiktokLogoFill className="w-5 h-5 text-white/80" />
                    </div>
                    <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                      <FaYoutube className="w-5 h-5 text-white/80" />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {influencer.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-[#9ef4ec] text-black text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Stats */}
              <div className="grid grid-cols-2 md:flex md:items-center md:gap-12 gap-6 text-white w-full md:w-auto">
                {/* Rating */}
                <div className="flex flex-col md:items-center max-md:items-start justify-center gap-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#0ABAB5] text-[#0ABAB5]" />
                    <span>{influencer.rating}</span>
                  </div>
                  <span className="text-xs text-gray-400">Rating</span>
                </div>

                <Separator
                  orientation="vertical"
                  className="hidden md:block h-6"
                />

                {/* Followers */}
                <div className="flex flex-col md:items-center max-md:items-start justify-center gap-1">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{influencer.followers.toLocaleString()}</span>
                  </div>
                  <span className="text-xs text-gray-400">Followers</span>
                </div>

                <Separator
                  orientation="vertical"
                  className="hidden md:block h-6"
                />

                {/* Location */}
                <div className="flex flex-col md:items-center max-md:items-start justify-center gap-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{influencer.location}</span>
                  </div>
                  <span className="text-xs text-gray-400">Location</span>
                </div>

                {influencer.bid && <><Separator
                  orientation="vertical"
                  className="hidden md:block h-6"
                />
                 <div className="flex flex-col md:items-center max-md:items-start justify-center gap-1">
                  <div className="font-bold">${influencer.bid}</div>
                  <span className="text-xs text-gray-400">Bid</span>
                </div></>}
              </div>
            </div>
            
          </div>
        ))}
      </div>

      {/* Pagination - Updated to match the image */}
      <div className="flex justify-center items-center gap-2 !my-10">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center text-white font-light text-xs disabled:opacity-50 px-2"
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </button>

        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
          // Show first 3 pages
          const pageNum = i + 1;

          return (
            <button
              key={i}
              onClick={() => goToPage(pageNum)}
              className={cn(
                "w-6 h-6 flex items-center justify-center rounded-md",
                currentPage === pageNum
                  ? "bg-epiclinx-teal text-[#2A2A2A]"
                  : "text-xs"
              )}
            >
              {pageNum}
            </button>
          );
        })}

        {totalPages > 3 && (
          <>
            <span className="text-white">...</span>

            {/* Show second last page */}
            {totalPages > 4 && (
              <button
                onClick={() => goToPage(totalPages - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-sm bg-epiclinx-teal text-white"
              >
                {totalPages - 1}
              </button>
            )}

            {/* Show last page */}
            <button
              onClick={() => goToPage(totalPages)}
              className="w-8 h-8 flex items-center justify-center rounded-sm bg-epiclinx-teal text-white"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center text-white font-light text-xs disabled:opacity-50 px-2"
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
}
