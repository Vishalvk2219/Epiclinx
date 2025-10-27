"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  MessageSquare,
  Search,
  Star,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import FilterSidebar from "@/components/filtersidebar";
import { cn } from "@/lib/utils";
import { PiInstagramLogoFill, PiTiktokLogoFill } from "react-icons/pi";
import { FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

type FilterState = {
  categories: string[];
  followers: string[];
  platforms: string[];
  location: string;
  featured: boolean;
};

type Creator = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  followers: number;
  location: string;
  bid: number;
  categories: string[];
  tags: string[];
  proposal: string;
  platforms?: string[];
  unlocked?: boolean;
};

export default function InfluencerList({ jobId }) {
  const pagination = false;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    followers: [],
    platforms: [],
    location: "",
    featured: true,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [creators, setCreators] = useState<Creator[]>([]);

  useEffect(() => {
    if (!jobId) return;
    const fetchBids = async () => {
      try {
        const bidsData = await apiFetch(`/bids?id=${jobId}`);
        const requiredFieldBids = bidsData.bids.map((bids) => ({
          id: bids.creatorId._id,
          name: bids.creatorId.username || bids.creatorId.firstName,
          avatar: bids.creatorId.profileImageUrl,
          rating: bids.creatorId.rating || 0,
          followers: bids.creatorId.followers || 1000,
          location: bids.creatorId.location || "",
          bid: bids.amount,
          categories: bids.creatorId.categories || [],
          tags: bids.creatorId.categories || [],
          proposal: bids.proposal,
          platforms: bids.creatorId.platforms || [],
          unlocked: bids.creatorId.unlocked || false,
        }));
        setCreators(requiredFieldBids);
      } catch (error: any) {
        console.log("Unable to fetch bids for the campaign", error.message);
      }
    };
    fetchBids();
  }, [jobId]);

  const itemsPerPage = 3;

  const filteredCreators = creators.filter((creator) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = creator.name.toLowerCase().includes(searchLower);
      const categoryMatch = creator.categories.some((cat) =>
        cat.toLowerCase().includes(searchLower)
      );
      const locationMatch = creator.location.toLowerCase().includes(searchLower);

      if (!nameMatch && !categoryMatch && !locationMatch) {
        return false;
      }
    }

    if (
      filters.categories.length > 0 &&
      !creator.categories.some((cat) => filters.categories.includes(cat))
    ) {
      return false;
    }

    if (filters.followers.length > 0) {
      const followerCount = creator.followers;
      let matchesFollowerSize = false;

      for (const range of filters.followers) {
        if (range === "1000 to 10,000" && followerCount >= 1000 && followerCount <= 10000) {
          matchesFollowerSize = true;
          break;
        } else if (range === "10,000 to 50,000" && followerCount > 10000 && followerCount <= 50000) {
          matchesFollowerSize = true;
          break;
        } else if (range === "50,000 to 250,000" && followerCount > 50000 && followerCount <= 250000) {
          matchesFollowerSize = true;
          break;
        } else if (range === "250,000+" && followerCount > 250000) {
          matchesFollowerSize = true;
          break;
        }
      }

      if (!matchesFollowerSize) {
        return false;
      }
    }

    if (
      filters.platforms.length > 0 &&
      creator.platforms &&
      !creator.platforms.some((p) =>
        filters.platforms.some((fp) => fp.toLowerCase() === p)
      )
    ) {
      return false;
    }

    if (filters.location && creator.location.toLowerCase() !== filters.location.toLowerCase()) {
      return false;
    }

    // if (filters.featured && !creator.unlocked) {
    //   return false;
    // }

    return true;
  });

  const getActiveFilterLabels = () => {
    const activeLabels: string[] = [];

    filters.categories.forEach((cat) => activeLabels.push(cat));
    filters.followers.forEach((follower) => activeLabels.push(follower));
    filters.platforms.forEach((platform) => activeLabels.push(platform));
    if (filters.location) activeLabels.push(filters.location);
    if (searchTerm) activeLabels.push(`Search: ${searchTerm}`);

    return activeLabels;
  };

  const activeFilterLabels = getActiveFilterLabels();

  const removeFilter = (filter: string) => {
    if (filter.startsWith("Search:")) {
      setSearchTerm("");
    } else if (filters.categories.includes(filter)) {
      setFilters({
        ...filters,
        categories: filters.categories.filter((c) => c !== filter),
      });
    } else if (filters.followers.includes(filter)) {
      setFilters({
        ...filters,
        followers: filters.followers.filter((f) => f !== filter),
      });
    } else if (filters.platforms.includes(filter)) {
      setFilters({
        ...filters,
        platforms: filters.platforms.filter((p) => p !== filter),
      });
    } else if (filter === filters.location) {
      setFilters({ ...filters, location: "" });
    }
  };

  const totalPages = Math.ceil(filteredCreators.length / itemsPerPage);
  const paginatedCreators = filteredCreators.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-4 md:mt-20 max-md:mt-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your offers are in</h2>
      </div>
      
      <div className="mb-6 flex items-center gap-3">
        <FilterSidebar
          customStyle={
            pagination
              ? "border border-gray-400 text-white"
              : "border border-gray-700 text-black"
          }
          onApply={(newFilters) => {
            setFilters(newFilters);
            setCurrentPage(1);
          }}
        />
        <div className="relative flex-1">
          <Search
            className={
              pagination
                ? "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-100"
                : "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700"
            }
          />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={`w-full rounded-full py-2 pl-10 pr-4 text-sm ${
              pagination
                ? "bg-transparent border border-gray-400 text-white"
                : "border border-gray-700 text-black"
            }`}
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {activeFilterLabels.map((filter) => (
          <span
            key={filter}
            className="flex cursor-pointer items-center gap-1 rounded-full bg-white px-3 py-1 text-xs text-black"
            onClick={() => removeFilter(filter)}
          >
            {filter}
            <X className="h-4 w-4" />
          </span>
        ))}
      </div>

      <p className="text-sm text-gray-400 my-4">
        {filteredCreators.length} bids received
      </p>

      <div className="space-y-4">
        {paginatedCreators.map((influencer) => (
          <div
            key={influencer.id}
            className="bg-white/10 rounded-3xl px-6 py-4 flex flex-col gap-4"
          >
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
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

              <div className="grid grid-cols-2 md:flex md:items-center md:gap-12 gap-6 text-white w-full md:w-auto">
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

                <div className="flex flex-col md:items-center max-md:items-start justify-center gap-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{influencer.location}</span>
                  </div>
                  <span className="text-xs text-gray-400">Location</span>
                </div>

                <Separator
                  orientation="vertical"
                  className="hidden md:block h-6"
                />

                <div className="flex flex-col md:items-center max-md:items-start justify-center gap-1">
                  <div className="font-bold">${influencer.bid}</div>
                  <span className="text-xs text-gray-400">Bid</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <p className="text-sm text-gray-300 md:w-1/2">
                {influencer.proposal}
              </p>

              <div className="grid grid-cols-2 gap-2 md:flex md:w-1/2 md:justify-end">
                <Link href={`/profile/creator/${influencer.id}`}>
                  <Button
                    size="sm"
                    className="w-full border border-gray-400 bg-transparent text-white rounded-full"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Profile
                  </Button>
                </Link>
                <Link href={`/dashboard/brand/jobs?tab=messages`}>
                  <Button
                    size="sm"
                    className="w-full border border-gray-400 bg-transparent text-white rounded-full"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                </Link>
                <Button
                  size="sm"
                  className="w-full rounded-full px-4 border border-red-400 text-red-400 bg-transparent"
                >
                  Decline
                </Button>
                <Button
                  size="sm"
                  className="w-full bg-epiclinx-teal border border-[#0ABAB5] text-black hover:bg-epiclinx-teal/90 rounded-full px-4"
                >
                  Accept
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

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

            {totalPages > 4 && (
              <button
                onClick={() => goToPage(totalPages - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-sm bg-epiclinx-teal text-white"
              >
                {totalPages - 1}
              </button>
            )}

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