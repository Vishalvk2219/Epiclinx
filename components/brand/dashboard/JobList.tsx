"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Gavel,
  Users,
} from "lucide-react";
import { cn, followerRanges } from "@/lib/utils";
import { PiInstagramLogoFill, PiTiktokLogoFill } from "react-icons/pi";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { Messages } from "./Messages";
import Link from "next/link";
import { ActionMenu } from "@/components/ActionDropdown";
import { FaSackDollar } from "react-icons/fa6";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";
import { EmptyState, LoadingState } from "@/components/LoadingAndNotFound";

interface RequiredFieldJob {
  id: string;
  logo?: string;
  title: string;
  brand: string;
  description?: string;
  platforms?: string[];
  requirements?: string;
  payment?: number;
  status?: string;
  applicants?: number;
  bids?: number;
  collaborationType?: "Paid" | "Barter" | "Gifted" | "Other";
  icon?: string;
  contentType?: string;
}

export function JobsList({ tab = "jobs" }: { tab: string }) {
  const [activeTab, setActiveTab] = useState<string>("All Jobs");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<RequiredFieldJob[]>([]);
  const [activeSection, setActiveSection] = useState<"jobs" | "messages">(
    tab || "jobs"
  );
  const itemsPerPage = 5;
  const { user } = useAuthStore();

  const tabs = ["All Jobs", "Active", "Pending Review", "Closed", "Drafts"];

  const getJobs = async () => {
    setLoading(true);
    try {
      const companyJobs = await apiFetch("/jobs");
      const requiredFieldJobs = (companyJobs.jobs || []).map((jobs) => ({
        id: jobs._id,
        logo: jobs.campaignImageUrl || jobs.companyId.profileImageUrl,
        title: jobs.campaignName,
        brand: jobs.companyId.companyName,
        description: jobs.campaignBrief,
        platforms: jobs.selectedPlatforms,
        requirements: followerRanges[jobs.followerSize],
        payment: jobs.budget,
        status: jobs.status,
        applicants: jobs.applicants?.length || 0,
        bids: jobs.bids?.length || 0,
        collaborationType: jobs.collaborationType,
        icon: jobs.icon,
        contentType: jobs.contentType,
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
  const currentJobs: RequiredFieldJob[] = filteredJobs.slice(
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
        {/* Header */}
        <div className="flex items-center max-md:flex-col max-md:items-start max-md:gap-4 justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <Image
                src={
                  user?.profileImageUrl ||
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/2560px-H%26M-Logo.svg.png"
                }
                alt="User"
                width={30}
                height={30}
                className="rounded-full object-cover w-12 h-12"
              />
            </div>
            <h2 className="text-xl font-bold text-white">Hello there!</h2>
          </div>

          {/* Tabs */}
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
              All Jobs Posted
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

        {activeSection === "jobs" ? (
          <>
            <div className="text-white mb-6 text-xs font-light">
              You posted {jobs.length} jobs
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

            <div className="space-y-4">
              {loading ? (
                <LoadingState />
              ) : currentJobs.length === 0 ? (
                <EmptyState />
              ) : (
                currentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 relative"
                  >
                    {/* === MOBILE VIEW === */}
                    <div className="md:hidden flex flex-col space-y-4">
                      {/* Header Row */}
                      <div className="flex items-center justify-between">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
                            <Image
                              src={job.logo || "/placeholder.svg"}
                              alt="brand logo"
                              width={48}
                              height={48}
                              className="rounded-full object-cover w-12 h-12"
                            />
                          </div>
                          <span className="absolute left-8 -bottom-4 bg-black/90 rounded-full flex items-center justify-center w-8 h-8 border border-[#3A3A3A] text-white text-sm">
                            {job.icon === "gavel" ? (
                              <Gavel size={16} className="text-black/80" />
                            ) : (
                              <FaSackDollar size={14} />
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {job.status && (
                            <span className="bg-white/20 font-light text-white text-xs px-2 py-1 rounded-md">
                              {job.status === "Pending Review"
                                ? "Pending"
                                : job.status}
                            </span>
                          )}
                          {job.payment && (
                            <span className="text-white font-bold">
                              <span className="font-normal text-sm">
                                Budget: $
                              </span>
                              {job.payment}
                            </span>
                          )}
                          <ActionMenu
                            detailLink={`/brand/jobs/${job.id}`}
                            deleteLink={`/brand/jobs/${job.id}`}
                          />
                        </div>
                      </div>

                      {/* Title */}
                      <Link href={`/brand/jobs/${job.id}`}>
                        <h3 className="text-white font-medium">{job.title}</h3>
                      </Link>

                      {/* Platforms */}
                      {job.platforms?.length > 0 && (
                        <div className="flex space-x-2">
                          {job.platforms.map((platform, index) => {
                            const name = platform.toLowerCase();
                            const platformMap: Record<
                              string,
                              { icon: JSX.Element; url: string }
                            > = {
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
                            if (!platformData) return null;
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
                      )}

                      {/* Description */}
                      {job.description && (
                        <p className="text-white text-sm font-light">
                          {job.description}
                        </p>
                      )}

                      {/* Requirements */}
                      {job.requirements && (
                        <div className="flex items-center gap-2 text-white text-sm font-light">
                          <Users className="w-4 h-4" />
                          {job.requirements}
                        </div>
                      )}

                      {/* Content Type */}
                      {job.contentType && (
                        <div className="flex items-center gap-1 text-white text-xs font-light">
                          <Briefcase className="w-4 h-4" />
                          {job.contentType}
                        </div>
                      )}

                      {/* Collaboration Type */}
                      {job.collaborationType && (
                        <div className="flex items-center gap-1 text-white text-sm font-light">
                          <DollarSign className="w-4 h-4" />
                          {job.collaborationType}
                        </div>
                      )}

                      {/* Bids */}
                      <div className="text-white text-sm">
                        {job.bids ?? 0} Bids
                      </div>
                    </div>

                    {/* === DESKTOP VIEW === */}
                    <div className="hidden md:flex items-start gap-4">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden">
                          <Image
                            src={job.logo || "/placeholder.svg"}
                            alt="brand logo"
                            width={100}
                            height={100}
                            className="rounded-full object-cover w-24 h-24"
                          />
                        </div>
                        <span className="absolute left-8 -bottom-4 bg-black/90 rounded-full flex items-center justify-center w-8 h-8 border border-[#3A3A3A] text-white">
                          {job.icon === "gavel" ? (
                            <Gavel size={16} className="text-black/80" />
                          ) : (
                            <FaSackDollar size={14} />
                          )}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex max-md:flex-col gap-2">
                            <Link href={`/dashboard/brand/jobs/${job.id}`}>
                              <h3 className="text-white font-medium">
                                {job.title}
                              </h3>
                            </Link>

                            {job.platforms?.length > 0 && (
                              <div className="flex space-x-2">
                                {job.platforms.map((platform, index) => {
                                  const name = platform.toLowerCase();
                                  const platformMap: Record<
                                    string,
                                    { icon: JSX.Element; url: string }
                                  > = {
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
                                  if (!platformData) return null;
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
                            )}
                          </div>

                          <div className="flex items-center gap-4">
                            {job.status && (
                              <span className="bg-white/20 font-light text-white text-xs px-2 py-1 rounded-md">
                                {job.status === "Pending Review"
                                  ? "Pending"
                                  : job.status}
                              </span>
                            )}
                            {job.payment && (
                              <span className="text-white font-bold text-lg">
                                <span className="font-normal text-sm">
                                  Budget: $
                                </span>
                                {job.payment}
                              </span>
                            )}
                            <ActionMenu
                              detailLink={`/dashboard/brand/jobs/${job.id}`}
                              deleteLink={`/dashboard/brand/jobs/${job.id}`}
                            />
                          </div>
                        </div>

                        {job.description && (
                          <p className="text-white text-sm mb-4 font-light">
                            {job.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4">
                          {job.requirements && (
                            <div className="flex items-center gap-2 text-white text-sm font-light">
                              <Users className="w-5 h-5" />
                              {job.requirements}
                            </div>
                          )}

                          {job.contentType && (
                            <div className="flex items-center gap-1 text-white text-xs font-light">
                              <Briefcase className="w-5 h-5" />
                              {job.contentType}
                            </div>
                          )}

                          {job.collaborationType && (
                            <div className="flex items-center gap-1 text-white text-sm font-light">
                              <DollarSign className="w-5 h-5" />
                              {job.collaborationType}
                            </div>
                          )}

                          <div className="ml-auto text-white text-xs font-light">
                            {job.applicants
                              ? `${job.applicants} Applicants`
                              : `${job.bids ?? 0} Bids`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
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
          </>
        ) : (
          <Messages />
        )}
      </div>
    </div>
  );
}
