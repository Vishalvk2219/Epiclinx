"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Gavel,
  Search,
  Users,
  X,
} from "lucide-react";
import { cn, followerRanges } from "@/lib/utils";
import { PiInstagramLogoFill, PiTiktokLogoFill } from "react-icons/pi";
import { FaFacebook, FaYoutube } from "react-icons/fa";

import Link from "next/link";
import { FaSackDollar } from "react-icons/fa6";
import FilterSidebar from "@/components/filtersidebar";
import { apiFetch } from "@/lib/api";
import { PlatformIcons } from "@/components/ui/platformIcons";
import { LoadingState } from "@/components/LoadingAndNotFound";

interface Job {
  id: string;
  logo: string;
  title: string;
  brand: string;
  description: string;
  platforms: string[];
  requirements: string;
  payment: string;
  status:
    | "Pending Applications"
    | "Accepted Jobs"
    | "Jobs In Progress"
    | "Submitted Jobs"
    | "Completed Jobs"
    | "Declined Jobs";
  applicants: number;
  bids: number;
  icon: string;
}

const CampaignList = ({ jobs ,loading}) => {
  const pagination = true;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const itemsPerPage = 5;

  type FilterState = {
    categories: string[];
    followers: string[];
    platforms: string[];
    location: string;
  };
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    followers: [],
    platforms: [],
    location: "",
  });

  const filteredJobs = jobs.filter((job) => {
    // Search filter
    if (
      searchTerm &&
      !job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !job.niche.some((cat) =>
        cat.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      !job.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (
      filters.categories.length > 0 &&
      !job.niche.some((cat) =>
        filters.categories.some((fc) => fc.toLowerCase() === cat.toLowerCase())
      )
    ) {
      return false;
    }

    // Follower size filter (string-based matching)
    const followerSizeMap: Record<string, string[]> = {
      "1000 to 10,000": ["Nano 1,000 - 10,000 followers"],
      "10,000 to 50,000": ["Micro 10,000 - 50,000 followers"],
      "50,000 to 250,000": ["Mid 50,000 - 500,000 followers"],
      "250,000+": ["Macro 500,000+ followers"],
    };

    if (filters.followers.length > 0) {
      let matchesFollowerSize = false;

      for (const range of filters.followers) {
        const validRanges = followerSizeMap[range] || [];
        if (validRanges.includes(job.followerSize)) {
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
      !job.platforms.some((p) =>
        filters.platforms.some((fp) => fp.toLowerCase() === p.toLowerCase())
      )
    ) {
      return false;
    }
    // Location filter
    if (
      filters.location &&
      job.location.toLowerCase() !== filters.location.toLowerCase()
    ) {
      return false;
    }

    return true;
  });

  // Get active filter labels for display
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

  // Remove a specific filter
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

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <FilterSidebar
          openSidebar={() => setSidebarOpen(true)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          categories={filters.categories}
          followers={filters.followers}
          platforms={filters.platforms}
          location={filters.location}
          onChange={(newFilters) => setFilters(newFilters)}
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
              setCurrentPage(1); // Reset to first page when search changes
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
            className="flex cursor-pointer items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-black"
            onClick={() => removeFilter(filter)}
          >
            {filter}
            <X className="h-4 w-4" />
          </span>
        ))}
      </div>
      {loading ? (
        <LoadingState message="Loading Campaigns..." />
      ) : (
        <>
          <span className="text-white/90 text-xs">{`${filteredJobs.length} campaigns found`}</span>
          <div className="space-y-4">
            {(pagination ? paginatedJobs : filteredJobs.slice(0, 7)).map(
              (job) => (
                <div
                  key={job.id}
                  className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 relative"
                >
                  {/* Mobile layout */}
                  <div className="md:hidden flex flex-col space-y-4">
                    {/* Row 1: Image, Status, Price, Menu */}
                    <div className="flex items-center justify-between">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-white flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <Image
                            src={job.logo || "/placeholder.svg"}
                            alt="brand logo"
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                        </div>
                        {job.icon === "gavel" ? (
                          <span className="absolute left-8 -bottom-4 bg-white rounded-full flex items-center justify-center w-8 h-8 border border-[#3A3A3A] text-white text-sm pointer-events-none max-md:left-auto max-md:top-0 max-md:-right-4 max-md:bottom-auto max-md:w-6 max-md:h-6">
                            <Gavel
                              size={20}
                              className="text-black/80 max-md:w-3 max-md:h-3"
                            />
                          </span>
                        ) : (
                          <span className="absolute left-8 -bottom-4 bg-black/90 rounded-full flex items-center justify-center w-8 h-8 border border-[#3A3A3A] text-white text-sm pointer-events-none max-md:left-auto max-md:top-0 max-md:-right-4 max-md:bottom-auto max-md:w-6 max-md:h-6">
                            <FaSackDollar
                              size={14}
                              className="text-white max-md:w-3 max-md:h-3"
                            />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {job.status === "Pending Applications" ? (
                          <span className="bg-gray-400/20 border border-white text-white text-xs px-2 py-1 rounded-md md:rounded-full">
                            Pending
                          </span>
                        ) : job.status === "Accepted Jobs" ? (
                          <span className="bg-[#50be4a] border border-[#45e368] text-white text-xs px-2 py-1 rounded-md md:rounded-full">
                            Accepted
                          </span>
                        ) : (
                          <span className="bg-[#8BC34A] border border-[#8BC34A] text-white text-xs px-2 py-1 rounded-md md:rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Title */}
                    <Link href={`/dashboard/brand/jobs/${job.id}`}>
                      <h3 className="text-white font-medium">{job.title}</h3>
                    </Link>

                    {/* Row 3: Platform logos */}
                    <PlatformIcons platforms={job.platforms} />
                    {/* Row 4: Description */}
                    <p className="text-white text-sm font-light">
                      {job.description}
                    </p>

                    {/* Row 5: Nano */}
                    {job.followerSize ? (
                      <div className="flex items-center gap-2 text-white text-sm font-light">
                        <Users className="w-4 h-4" />
                        {job.followerSize}
                      </div>
                    ) : null}

                    {/* Row 6: UGC */}
                    <div className="flex items-center gap-1 text-white text-xs font-light">
                      <Briefcase className="w-4 h-4" />
                      {job.contentType}
                    </div>

                    {/* Row 7: Paid */}
                    <div className="flex items-center gap-1 text-white text-sm font-light">
                      <DollarSign className="w-4 h-4" />
                      {job.collaborationType}
                    </div>

                    <div className="flex items-center gap-1 text-white text-sm font-light">
                      Type: {job.jobType}
                    </div>

                    {/* Row 8: Bids/Applicants */}
                    <div className="text-white text-sm">
                      {job.bids > 0 ? `${job.bids} Bids` : "0 Bids"}
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:flex items-start gap-4">
                    <div className="relative">
                      <div className=" w-[100px] h-[100px] rounded-full bg-white flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <Image
                          src={job.logo || "/placeholder.svg"}
                          alt="brand logo"
                          width={100}
                          height={100}
                          className="rounded-full"
                        />
                      </div>
                      {job.icon === "gavel" ? (
                        <span className="absolute left-8 -bottom-4 bg-white rounded-full flex items-center justify-center w-8 h-8 border border-[#3A3A3A] text-white text-sm pointer-events-none max-md:left-auto max-md:top-0 max-md:-right-4 max-md:bottom-auto max-md:w-6 max-md:h-6">
                          <Gavel
                            size={20}
                            className="text-black/80 max-md:w-3 max-md:h-3"
                          />
                        </span>
                      ) : (
                        <span className="absolute left-8 -bottom-4 bg-black/90 rounded-full flex items-center justify-center w-8 h-8 border border-[#3A3A3A] text-white text-sm pointer-events-none max-md:left-auto max-md:top-0 max-md:-right-4 max-md:bottom-auto max-md:w-6 max-md:h-6">
                          <FaSackDollar
                            size={14}
                            className="text-white max-md:w-3 max-md:h-3"
                          />
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex max-md:flex-col gap-2">
                          <Link href={`/dashboard/brand/jobs/${job.id}`}>
                            <h3 className="text-white font-medium">
                              {job.title}
                            </h3>
                          </Link>
                          {/* Row 3: Platform logos */}
                          <PlatformIcons
                            platforms={job.platforms}
                          ></PlatformIcons>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {job.status === "Pending Applications" ? (
                              <span className="bg-gray-400 border border-white text-white font-light text-[11px] px-2 py-1 rounded-md">
                                Pending
                              </span>
                            ) : job.status === "Accepted Jobs" ? (
                              <span className="bg-[#50be4a] border border-[#45e368] text-black font-light text-[11px] px-2 py-1 rounded-md">
                                Accepted
                              </span>
                            ) : job.status === "Completed Jobs" ? (
                              <span className="bg-epiclinx-semiteal border border-epiclinx-semiteal text-black font-light text-[11px] px-2 py-1 rounded-md">
                                Completed
                              </span>
                            ) : job.status === "Jobs In Progress" ? (
                              <span className="bg-epiclinx-semiteal border border-epiclinx-semiteal text-black font-light text-[11px] px-2 py-1 rounded-md">
                                In Progress
                              </span>
                            ) : job.status === "Submitted Jobs" ? (
                              <span className="bg-epiclinx-semiteal border border-epiclinx-semiteal text-black font-light text-[11px] px-2 py-1 rounded-md">
                                Submitted
                              </span>
                            ) : job.status === "Declined Jobs" ? (
                              <span className="bg-red-400 border border-red-400 text-black font-light text-[11px] px-2 py-1 rounded-md">
                                Rejected
                              </span>
                            ) : job.status === "Pending Applications" ? (
                              <span className="bg-epiclinx-semiteal border border-epiclinx-semiteal text-black font-light text-[11px] px-2 py-1 rounded-md">
                                Pending
                              </span>
                            ) : job.status === "Submitted Jobs" ? (
                              <span className="bg-blue-500 border border-blue-500 text-black font-light text-[11px] px-2 py-1 rounded-md">
                                Submitted
                              </span>
                            ) : job.status === "Declined Jobs" ? (
                              <span className="bg-epiclinx-semiteal border border-epiclinx-semiteal text-black font-light text-[11px] px-2 py-1 rounded-md">
                                Declined
                              </span>
                            ) : (
                              <span className="bg-epiclinx-semiteal border border-epiclinx-semiteal text-black font-light text-[11px] px-2 py-1 rounded-md">
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-white text-sm mb-4 font-light">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4">
                        {job.followerSize ? (
                          <div className="flex items-center gap-2 text-white text-sm font-light">
                            <Users className="w-5 h-5" />
                            {job.followerSize}
                          </div>
                        ) : null}

                        <div className="flex items-center gap-1 text-white text-xs font-light">
                          <Briefcase className="w-5 h-5" />
                          {job.contentType}
                        </div>

                        <div className="flex items-center gap-1 text-white text-sm font-light">
                          <DollarSign className="w-5 h-5" />
                          {job.collaborationType}
                        </div>

                        <div className="flex items-center gap-1 text-white text-sm font-light">
                          Type: {job.jobType}
                        </div>

                        <div className="ml-auto text-white text-xs font-light">
                          <div className="text-white text-sm">
                            {job.bids > 0 ? `${job.bids} Bids` : "0 Bids"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </>
      )}

      {/* Pagination - Updated to match the image */}
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
};

export default CampaignList;
