"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Calendar,
  Search,
  Target,
  ChevronLeft,
  ChevronRight,
  FileSearch,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Separator } from "@/components/ui/separator";
import { PlatformIcons } from "@/components/ui/platformIcons";
import Link from "next/link";
import BidFilter, { BidFilterValues } from "./BidFilter";
import { cn } from "@/lib/utils";
import { EmptyState, LoadingState } from "@/components/loadingAndEmpty";

export function BidssList() {
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<BidFilterValues>({
    sort: "Most Recent",
    location: "",
    niches: [],
    platforms: ["All"],
    deliverables: [],
    bidStatus: "All",
  });

  const itemsPerPage = 6;

  const filteredBids = bids
    .filter((bid) => {
      if (
        searchTerm &&
        !(
          (bid.campaignName &&
            bid.campaignName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (bid.brandName &&
            bid.brandName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (bid.description &&
            bid.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      ) {
        return false;
      }

      if (
        filters.bidStatus !== "All" &&
        bid.bidStatus.toLowerCase() !== filters.bidStatus.toLowerCase()
      ) {
        return false;
      }

      if (
        filters.location &&
        bid.location?.toLowerCase() !== filters.location.toLowerCase()
      ) {
        return false;
      }

      if (
        filters.niches.length > 0 &&
        !bid.niche?.some((n: string) => filters.niches.includes(n))
      ) {
        return false;
      }

      if (
        !filters.platforms.includes("All") &&
        !bid.campaignPlatforms.some((p: string) =>
          filters.platforms
            .map((fp) => fp.toLowerCase())
            .includes(p.toLowerCase())
        )
      ) {
        return false;
      }

      if (
        filters.deliverables.length > 0 &&
        !bid.deliverables?.some((d: string) => filters.deliverables.includes(d))
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "Most Recent") {
        return (
          new Date(b.bidCreatedAt).getTime() -
          new Date(a.bidCreatedAt).getTime()
        );
      } else if (filters.sort === "Highest Bid") {
        return Number.parseInt(b.bidAmount) - Number.parseInt(a.bidAmount);
      } else if (filters.sort === "Lowest Bid") {
        return Number.parseInt(a.bidAmount) - Number.parseInt(b.bidAmount);
      } else if (filters.sort === "Deadline") {
        const dateA = new Date(a.deadline || 0).getTime();
        const dateB = new Date(b.deadline || 0).getTime();
        const safeDateA = isNaN(dateA) ? Infinity : dateA;
        const safeDateB = isNaN(dateB) ? Infinity : dateB;
        return safeDateA - safeDateB;
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredBids.length / itemsPerPage);
  const currentBids = filteredBids.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleApplyFilters = (newFilters: BidFilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const fetchBids = async () => {
    try {
      setLoading(true);
      const response: any = await apiFetch("/bids/fetch-all-bids");
      if (response.success) {
        const formattedBids = response.allApplications.map((bid: any) => ({
          bidId: bid._id,
          bidAmount: bid.offerType==="bid" ? bid.amount : bid.jobId.budget,
          bidStatus: bid.status,
          bidCreatedAt: bid.createdAt,
          campaignId: bid.jobId?._id?.toString() || "",
          campaignName: bid.jobId?.campaignName,
          campaignGoal: bid.jobId?.campaignGoal,
          campaignPlatforms: bid.jobId?.selectedPlatforms || [],
          brandName: bid.jobId?.companyId?.companyName,
          brandLogo: bid.jobId?.companyId?.profileImageUrl,
          location: bid.jobId?.location || "",
          niche: bid.jobId?.niche || [],
          deliverables: bid.jobId?.deliverables || [],
          deadline: bid.jobId?.deadline || null,
          description: bid.jobId?.description || "",
          offerType:bid.offerType
        }));
        setBids(formattedBids);
      }
    } catch (err) {
      console.error("Error fetching bids:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Bids Overview</h2>
      <div className="flex items-center gap-3 w-full">
        <BidFilter onApply={handleApplyFilters} />
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-100" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-full py-2 pl-10 w-full pt-3 pr-4 text-sm bg-transparent border border-gray-400 text-white"
          />
        </div>
      </div>

      <div className="space-y-3 mt-6">
        {loading ? <LoadingState message="Loading your Bids"/>: (
          <>
            {currentBids.length === 0 ? (
              <EmptyState message="No bids found"/>
            ) : (
              <>
                {currentBids.map((bid) => (
                  <div
                    key={bid.bidId}
                    className="flex justify-between items-center gap-6 bg-white/10 p-5 rounded-3xl hover:bg-white/15 transition-all flex-col md:flex-row w-full"
                  >
                    {/* Brand */}
                    <div className="flex items-center gap-3 min-w-[150px] w-full md:w-[200px] md:basis-1/4 flex-shrink-0">
                      <Image
                        src={bid.brandLogo || "https://via.placeholder.com/40"}
                        alt="Brand Logo"
                        width={45}
                        height={45}
                        className="rounded-full object-cover"
                      />
                      <span className="text-epiclinx-teal font-semibold text-sm truncate w-full md:w-auto">
                        <Link
                          href={`/dashboard/creator/apply-for-job?id=${bid.campaignId}`}
                          className="hover:underline"
                        >
                          {bid.brandName || "Unknown Brand"}
                        </Link>
                      </span>
                    </div>

                    <Separator
                      orientation="vertical"
                      className="hidden md:block h-10 bg-white/40 mx-4"
                    />

                    {/* Campaign Info */}
                    <div className="flex flex-col justify-center flex-1 md:w-[320px] w-full">
                      <Link
                        href={`/dashboard/creator/apply-for-job?id=${bid.campaignId}`}
                        className="font-medium hover:underline text-white"
                      >
                        {bid.campaignName || "Unnamed Campaign"}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
                        <Target className="h-3 w-3 text-epiclinx-teal" />
                        <span>{bid.campaignGoal || "No goal"}</span>
                      </div>
                      <PlatformIcons platforms={bid.campaignPlatforms} />
                    </div>

                    <Separator
                      orientation="vertical"
                      className="hidden md:block h-10 bg-white/40 mx-4"
                    />

                    {/* Bid Info */}
                    <div className="flex flex-col items-end md:items-center gap-1 md:w-[150px]">
                      <span className="text-epiclinx-teal font-medium text-lg">
                        {bid.offerType === "bid" ? bid.bidAmount : (bid.bidAmount+"(Fixed)")}
                      </span>
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(bid.bidCreatedAt).toLocaleDateString()}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-medium rounded-full px-3 py-1 border mt-1",
                          bid.bidStatus === "accepted"
                            ? "bg-epiclinx-teal text-black border-[#0ABAB5]"
                            : bid.bidStatus === "rejected"
                            ? "text-red-400 border-red-400"
                            : "text-gray-400 border-gray-500"
                        )}
                      >
                        {bid.bidStatus === "accepted"
                          ? "Accepted"
                          : bid.bidStatus === "rejected"
                          ? "Rejected"
                          : "Pending"}
                      </span>
                    </div> : 
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center text-white font-light text-xs disabled:opacity-50 px-2"
          >
            <ChevronLeft size={16} className="mr-1" />
            Previous
          </button>

          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={i}
                onClick={() => goToPage(pageNum)}
                className={cn(
                  "w-6 h-6 flex items-center justify-center rounded-md",
                  currentPage === pageNum
                    ? "bg-epiclinx-teal text-[#2A2A2A]"
                    : "text-xs text-white"
                )}
              >
                {pageNum}
              </button>
            );
          })}

          {totalPages > 3 && (
            <>
              <span className="text-white">...</span>
              {totalPages > 4 && (
                <button
                  onClick={() => goToPage(totalPages - 1)}
                  className="w-6 h-6 flex items-center justify-center rounded-md bg-epiclinx-teal text-[#2A2A2A]"
                >
                  {totalPages - 1}
                </button>
              )}
              <button
                onClick={() => goToPage(totalPages)}
                className="w-6 h-6 flex items-center justify-center rounded-md bg-epiclinx-teal text-[#2A2A2A]"
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
      )}
    </div>
  );
}
