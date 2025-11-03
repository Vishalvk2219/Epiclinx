"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Ellipsis,
  Gavel,
  Users,
} from "lucide-react";
import { cn, followerRanges } from "@/lib/utils";
import { PiInstagramLogoFill, PiTiktokLogoFill } from "react-icons/pi";
import { FaYoutube } from "react-icons/fa";

import Link from "next/link";
import { ActionMenu } from "@/components/ActionDropdown";
import { FaSackDollar } from "react-icons/fa6";
import { Messages } from "../Messages";
import CampaignList from "./CampaignList";
import { apiFetch } from "@/lib/api";
import { PlatformIcons } from "@/components/ui/platformIcons";
import { LoadingState } from "@/components/loadingAndEmpty";

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
}

export function CampaignTabs({ show = true }: { show?: boolean }) {
  const [activeTab, setActiveTab] = useState<string>("Pending Applications");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSection, setActiveSection] = useState<
    "campaigns" | "campaignStatus"
  >("campaigns");
  const [jobs, setJobs] = useState([]);
  const itemsPerPage = 5;

  const tabs = [
    "Pending Applications",
    "Accepted Jobs",
    "Jobs In Progress",
    "Submitted Jobs",
    "Completed Jobs",
    "Declined Jobs",
  ];
  const getJobs = async () => {
    setLoading(true);
    try {
      const companyJobs = await apiFetch("/jobs");
      const requiredFieldJobs = (companyJobs.jobs || []).map((jobs) => ({
        id: jobs._id,
        logo: jobs.companyId.profileImageUrl,
        title: jobs.campaignName,
        brand: jobs.companyId.companyName,
        description: jobs.campaignBrief,
        platforms: jobs.selectedPlatforms,
        followerSize: followerRanges[jobs.followerSize],
        payment: jobs.budget,
        status: jobs.status,
        applicants: jobs.applicants?.length || 0,
        bids: jobs.bids?.length || 0,
        collaborationType: jobs.collaborationType,
        icon: jobs.icon,
        contentType: jobs.contentType,
        niche: jobs.niche,
        follower: jobs.followerSize,
        location: jobs.location || "",
        jobType: jobs.jobType,
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
  const filteredJobs =
    activeTab === "All Jobs"
      ? jobs
      : jobs.filter((job) => job.status === activeTab);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="rounded-3xl overflow-hidden md:mt-20 mx-3">
      <div className="">
        <div className="flex items-center max-md:flex-col max-md:items-start max-md:gap-4 justify-between mb-6">
          <div></div>          {/* Tabs for All Jobs Posted and Messages */}
          <div className="flex rounded-full bg-[#3A3A3A] p-1">
            <button
              onClick={() => setActiveSection("campaigns")}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition-colors",
                activeSection === "campaigns"
                  ? "bg-[#00E5C7] text-[#2A2A2A]"
                  : "text-white hover:text-[#00E5C7]"
              )}
            >
              All Campaigns
            </button>
            <button
              onClick={() => setActiveSection("campaignStatus")}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition-colors",
                activeSection === "campaignStatus"
                  ? "bg-[#00E5C7] text-[#2A2A2A]"
                  : "text-white hover:text-[#00E5C7]"
              )}
            >
              Campaign Status
            </button>
          </div>
        </div>

        {activeSection === "campaignStatus" ? (
          <>
            <div className="border-b border-[#3A3A3A] mb-6 overflow-x-auto hide-scrollbar">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-10 py-3 font-light text-sm whitespace-nowrap",
                      activeTab === tab
                        ? "text-[#00E5C7] border-b-2 border-[#00E5C7]"
                        : "text-white hover:text-[#00E5C7]/80"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                <LoadingState message="Loading Campaigns" />
              ) : (
                <>
                  {currentJobs.map((job) => (
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
                          <h3 className="text-white font-medium">
                            {job.title}
                          </h3>
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
                  ))}
                </>
              )}
            </div>

            {/* Pagination - Updated to match the image */}
            {!loading && <div className="flex justify-center items-center mt-6 gap-2">
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
            </div>}
          </>
        ) : (
          <CampaignList jobs={jobs} loading={loading} />
        )}
      </div>
    </div>
  );
}
