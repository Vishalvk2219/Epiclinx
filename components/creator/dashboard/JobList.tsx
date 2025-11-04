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
import { Messages } from "./Messages";
import Link from "next/link";
import { ActionMenu } from "@/components/ActionDropdown";
import { FaSackDollar } from "react-icons/fa6";
import { apiFetch } from "@/lib/api";
import { PlatformIcons } from "@/components/ui/platformIcons";

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

export function JobsList({
  show = true,
  publicProfile = false,
}: {
  show?: boolean;
  publicProfile?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<string>(
    publicProfile ? "Completed Jobs" : "Pending"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSection, setActiveSection] = useState<"jobs" | "messages">(
    "jobs"
  );
  const [jobs, setJobs] = useState([]);
  const itemsPerPage = 5;

  const tabs = publicProfile
    ? ["Completed Jobs"]
    : [
        "Pending",
        "Accepted Jobs",
        "Jobs In Progress",
        "Submitted Jobs",
        "Completed Jobs",
        "Declined Jobs",
      ];

  const allJobs = async () => {
    try {
      const fetchAllJobs = await apiFetch("/bids/fetch-all-bids");
      console.log(fetchAllJobs);
      const requiredFieldJobs = (fetchAllJobs.allApplications || []).map(
        (bids) => ({
          id: bids.jobId._id,
          logo: bids.jobId.companyId.profileImageUrl,
          title: bids.jobId.campaignName,
          brand: bids.jobId.companyId.companyName,
          description: bids.jobId.campaignBrief,
          platforms: bids.jobId.selectedPlatforms,
          followerSize: followerRanges[bids.jobId.followerSize],
          payment: bids.jobId.budget,
          status: bids.status === "Pending" ? bids.status : bids.jobId.status,
          collaborationType: bids.jobId.collaborationType,
          icon: bids.jobId.icon,
          contentType: bids.jobId.contentType,
          niche: bids.jobId.niche,
          follower: bids.jobId.followerSize,
          location: bids.jobId.location || "",
          jobType: bids.jobId.jobType,
        })
      );
      setJobs(requiredFieldJobs);
      console.log(requiredFieldJobs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    allJobs();
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
    <div className="rounded-3xl overflow-hidden">
      <div>
        <div className="flex items-center max-md:flex-col max-md:items-start max-md:gap-4 justify-between mb-6">
          {!publicProfile && (
            <div className="flex rounded-full bg-[#3A3A3A] p-1">
              <button
                onClick={() => setActiveSection("jobs")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition-colors",
                  activeSection === "jobs"
                    ? "bg-[#00E5C7] text-[#2A2A2A]"
                    : "text-white hover:text-[#00E5C7]"
                )}
              >
                All Your Jobs
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
          )}
        </div>

        {activeSection === "jobs" ? (
          <>
            {!publicProfile && (
              <>
                <div className="text-white mb-6 text-xs font-light">
                  {jobs.length} Jobs Applied For – Every move is building your
                  legacy.
                </div>

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
              </>
            )}

            <div className="space-y-4">
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
                        {job.status === "Pending" ? (
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
                    <Link href={`/dashboard/creator/apply-for-job`}>
                      <h3 className="text-white font-medium">{job.title}</h3>
                    </Link>

                    {/* Row 3: Platform logos */}
                    <PlatformIcons platforms={job.platforms} />

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

                    {/* Row 7: Paid */}
                    <div className="flex items-center gap-1 text-white text-sm font-light">
                      <DollarSign className="w-4 h-4" />
                      Paid
                    </div>

                    {/* Row 8: Bids/Applicants */}
                    <div className="text-white text-sm">
                      {job.applicants > 0
                        ? `${job.applicants} Applicants`
                        : `${job.bids} Bids`}
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
                          <Link href={`/dashboard/creator/apply-for-job`}>
                            <h3 className="text-white font-medium">
                              {job.title}
                            </h3>
                          </Link>
                          <PlatformIcons platforms={job.platforms} />
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {(() => {
                              const statusStyles: Record<string, string> = {
                                Pending:
                                  "bg-gray-400/20 border border-gray-400 text-gray-200",
                                "Accepted Jobs":
                                  "bg-blue-500/20 border border-blue-400 text-blue-200",
                                "Jobs In Progress":
                                  "bg-yellow-500/20 border border-yellow-400 text-yellow-200",
                                "Submitted Jobs":
                                  "bg-purple-500/20 border border-purple-400 text-purple-200",
                                "Completed Jobs":
                                  "bg-green-500/20 border border-green-400 text-green-200",
                                "Declined Jobs":
                                  "bg-red-500/20 border border-red-400 text-red-200",
                              };

                              const style =
                                statusStyles[job.status] ||
                                "bg-gray-500/20 border border-gray-400 text-gray-200";

                              return (
                                <span
                                  className={`${style} text-xs px-2 py-1 rounded-md md:rounded-full`}
                                >
                                  {job.status}
                                </span>
                              );
                            })()}
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

                        <div className="flex items-center gap-1 text-white text-sm font-light">
                          <DollarSign className="w-5 h-5" />
                          Paid
                        </div>

                        <div className="ml-auto text-white text-xs font-light">
                          {job.status === "Pending" ? (
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
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 ? (
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
            ) : null}
          </>
        ) : (
          <Messages />
        )}
      </div>
    </div>
  );
}
