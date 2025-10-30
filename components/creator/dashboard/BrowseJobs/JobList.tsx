"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Gavel,
  Locate,
  Search,
  Users,
} from "lucide-react";
import { capitalize, cn, followerRanges } from "@/lib/utils";
import { PiInstagramLogoFill, PiTiktokLogoFill } from "react-icons/pi";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { FaLocationPin, FaSackDollar } from "react-icons/fa6";
import JobFilter, { JobFilterValues } from "./JobFilter";
import { Messages } from "../Messages";
import { apiFetch } from "@/lib/api";

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
  nano: boolean;
  niche?: string[];
  deliverables?: string[];
  location?: string;
  applied?: boolean;
}

export function JobsList({ show = true }: { show?: boolean }) {
  const [activeTab, setActiveTab] = useState<string>("Pending Applications");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSection, setActiveSection] = useState<"jobs" | "messages">(
    "jobs"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<JobFilterValues>({
    sort: "Most Recent",
    location: "",
    niches: [],
    platforms: ["All"],
    deliverables: [],
  });
  const getJobs = async () => {
    try {
      setLoading(true);
      const companyJobs = await apiFetch("/jobs");
      console.log(companyJobs);
      const requiredFieldJobs = (companyJobs.jobs || []).map((jobs) => ({
        id: jobs._id,
        logo: jobs.companyId.profileImageUrl,
        title: jobs.campaignName,
        brand: jobs.companyId.companyName,
        description: jobs.campaignBrief,
        platforms: jobs.selectedPlatforms,
        requirements: followerRanges[jobs.followerSize],
        payment: jobs.budget,
        collaborationType: jobs.collaborationType,
        status: jobs.status,
        applicants: jobs.applicants?.length || 0,
        bids: jobs.bids?.length || 0,
        icon: jobs.icon,
        niche: jobs.niche || [],
        location: capitalize(jobs.location || ""),
        deliverables: jobs.selectedContentTypes || [],
        deadline: jobs.postDeadline,
      }));
      setJobs(requiredFieldJobs);
    } catch (error: any) {
      console.log("Unable to load campaign or jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);
  const itemsPerPage = 6;

  // Filter jobs based on search term and filters
  const filteredJobs = jobs
    .filter((job) => {
      // First filter by tab
      if (activeTab !== "All Jobs" && job.status !== activeTab) {
        return false;
      }

      // Then filter by search term
      if (
        searchTerm &&
        !job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !job.brand.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !job.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Filter by location
      if (
        filters.location &&
        filters.location !== "" &&
        job.location.toLowerCase() !== filters.location.toLowerCase()
      ) {
        return false;
      }

      // Filter by niches
      if (
        filters.niches.length > 0 &&
        !job.niche?.some((n) => filters.niches.includes(n))
      ) {
        return false;
      }

      // Filter by platform
      if (
        !filters.platforms.includes("All") &&
        !job.platforms.some((p) =>
          filters.platforms
            .map((fp) => fp.toLowerCase())
            .includes(p.toLowerCase())
        )
      ) {
        return false;
      }

      // Filter by deliverables
      if (
        filters.deliverables.length > 0 &&
        !job.deliverables?.some((d) => filters.deliverables.includes(d))
      ) {
        return false;
      }

      return true;
    })
    // Sort jobs based on filter
    .sort((a, b) => {
      if (filters.sort === "Most Recent") {
        return 0; // Assuming they're already sorted by most recent
      } else if (filters.sort === "Highest Paid") {
        return (
          Number.parseInt(b.payment.replace(/[^0-9]/g, "")) -
          Number.parseInt(a.payment.replace(/[^0-9]/g, ""))
        );
      } else if (filters.sort === "Lowest Paid") {
        return (
          Number.parseInt(a.payment.replace(/[^0-9]/g, "")) -
          Number.parseInt(b.payment.replace(/[^0-9]/g, ""))
        );
      } else if (filters.sort === "Deadline") {
        const dateA = new Date(a.deadline).getTime();
        const dateB = new Date(b.deadline).getTime();

        const safeDateA = isNaN(dateA) ? Infinity : dateA;
        const safeDateB = isNaN(dateB) ? Infinity : dateB;
        return safeDateA - safeDateB;
      }

      return 0;
    });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const currentJobs = jobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleApplyFilters = (newFilters: JobFilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };
if (loading) return <p>Loading ...</p>;
if (!jobs) return <p>No jobs Available...</p>;
  return (
    <div className="overflow-hidden py-3">
      <div className="">
        {activeSection === "jobs" ? (
          <>
            <div className="flex items-center gap-3 w-full">
              <JobFilter onApply={handleApplyFilters} />
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
            <div className="flex items-center justify-between my-6">
              <div className="text-white text-xs font-light ml-3">
                {filteredJobs.length} jobs found
              </div>
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job) => (
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
                          <span className="bg-[#FFC5C5] border border-[#FFC5C5] text-white text-xs px-2 py-1 rounded-md md:rounded-full">
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
                    <Link
                      href={`/dashboard/creator/apply-for-job?id=${job.id}`}
                    >
                      <h3 className="text-white font-medium">{job.title}</h3>
                    </Link>

                    {/* Row 3: Platform logos */}
                    <div className="flex space-x-2">
                      {job.platforms.map((platform, index) => {
                        const name = platform.toLowerCase();

                        // Define all supported platforms once
                        const platformMap = {
                          instagram: {
                            icon: (
                              <PiInstagramLogoFill className="w-5 h-5 text-black/80" />
                            ),
                            url: "https://www.instagram.com",
                          },
                          tiktok: {
                            icon: (
                              <PiTiktokLogoFill className="w-5 h-5 text-black/80" />
                            ),
                            url: "https://www.tiktok.com",
                          },
                          youtube: {
                            icon: (
                              <FaYoutube className="w-5 h-5 text-black/80" />
                            ),
                            url: "https://www.youtube.com",
                          },
                          facebook: {
                            icon: (
                              <FaFacebook className="w-5 h-5 text-black/80" />
                            ),
                            url: "https://www.facebook.com",
                          },
                        };

                        const platformData = platformMap[name];

                        if (!platformData) return null; // skip unsupported ones

                        return (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full bg-epiclinx-semiteal flex items-center justify-center"
                          >
                            <a
                              href={platformData.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {platformData.icon}
                            </a>
                          </div>
                        );
                      })}
                    </div>
                    {/* Row 4: Description */}
                    <p className="text-white text-sm font-light">
                      {job.description}
                    </p>

                    {/* Row 5: Nano */}
                    <div className="flex items-center gap-2 text-white text-sm font-light">
                      <Users className="w-4 h-4" />
                      {job.requirements}
                    </div>

                    {/* Row 6: UGC */}
                    <div className="flex items-center gap-1 text-white text-xs font-light">
                      <Briefcase className="w-4 h-4" />
                      UGC
                    </div>

                    <div className="flex items-center gap-1 text-white text-xs font-light">
                      <FaLocationPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    {/* Row 7: Paid */}
                    <div className="flex items-center gap-1 text-white text-sm font-light">
                      <DollarSign className="w-4 h-4" />
                      {job.collaborationType}
                    </div>

                    {/* Row 8: Bids/Applicants */}
                    <div className="text-white text-sm flex items-center gap-2">
                      {job.applied && <div>Your Bid: {job.payment}</div>}
                      <div className="ml-auto text-white text-xs font-light">
                        {job.applied ? (
                          <button className="border border-red-500 bg-transparent rounded-full px-4 py-1 text-sm font-light text-red-500">
                            Cancel Application
                          </button>
                        ) : (
                          <Link
                            href={`/dashboard/creator/apply-for-job?id=${job.id}`}
                            className="bg-epiclinx-teal rounded-full px-4 py-2 text-sm text-black text-xs hover:bg-epiclinx-teal/90"
                          >
                            Apply for Job
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:flex items-start gap-4">
                    <div className="relative">
                      <div className="w-[100px] h-[100px] rounded-full bg-white flex-shrink-0 flex items-center justify-center overflow-hidden">
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
                          <Link
                            href={`/dashboard/creator/apply-for-job?id=${job.id}`}
                          >
                            <h3 className="text-white font-medium">
                              {job.title}
                            </h3>
                          </Link>
                          <div className="flex space-x-2">
                            {job.platforms.map((platform, index) => {
                              const name = platform.toLowerCase();

                              // Define all supported platforms once
                              const platformMap = {
                                instagram: {
                                  icon: (
                                    <PiInstagramLogoFill className="w-5 h-5 text-black/80" />
                                  ),
                                  url: "https://www.instagram.com",
                                },
                                tiktok: {
                                  icon: (
                                    <PiTiktokLogoFill className="w-5 h-5 text-black/80" />
                                  ),
                                  url: "https://www.tiktok.com",
                                },
                                youtube: {
                                  icon: (
                                    <FaYoutube className="w-5 h-5 text-black/80" />
                                  ),
                                  url: "https://www.youtube.com",
                                },
                                facebook: {
                                  icon: (
                                    <FaFacebook className="w-5 h-5 text-black/80" />
                                  ),
                                  url: "https://www.facebook.com",
                                },
                              };

                              const platformData = platformMap[name];

                              if (!platformData) return null; // skip unsupported ones

                              return (
                                <div
                                  key={index}
                                  className="w-8 h-8 rounded-full bg-epiclinx-semiteal flex items-center justify-center"
                                >
                                  <a
                                    href={platformData.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {platformData.icon}
                                  </a>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <p className="text-white text-sm mb-4 font-light">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 text-white text-sm font-light">
                          <Users className="w-5 h-5" />
                          {job.requirements}
                        </div>

                        <div className="flex items-center gap-1 text-white text-xs font-light">
                          <Briefcase className="w-5 h-5" />
                          UGC
                        </div>
                        <div className="flex items-center gap-1 text-white text-xs font-light">
                          <FaLocationPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1 text-white text-sm font-light">
                          <DollarSign className="w-5 h-5" />
                          {job.collaborationType}
                        </div>

                        <div className="ml-auto text-white text-xs font-light flex items-center gap-2">
                          {job.applied && <div>Your Bid: {job.payment}</div>}
                          <div className="ml-auto text-white text-xs font-light">
                            {job.applied ? (
                              job.status === "Pending Applications" ? (
                                <button className="border border-red-500 bg-transparent rounded-full px-4 py-1 text-sm font-light text-red-500">
                                  Cancel Application
                                </button>
                              ) : job.status === "Accepted Jobs" ? (
                                <Link
                                  href={`/creator/jobs/${job.id}/offer-portal`}
                                  className="bg-epiclinx-teal rounded-full px-4 py-2 text-sm text-black text-xs hover:bg-epiclinx-teal/90"
                                >
                                  Enter Offer Portal
                                </Link>
                              ) : null
                            ) : (
                              <Link
                                href={`/dashboard/creator/apply-for-job?id=${job.id}`}
                                className="bg-epiclinx-teal rounded-full px-4 py-2 text-sm text-black text-xs hover:bg-epiclinx-teal/90"
                              >
                                Apply for Job
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
          </>
        ) : (
          <Messages />
        )}
      </div>
    </div>
  );
}
