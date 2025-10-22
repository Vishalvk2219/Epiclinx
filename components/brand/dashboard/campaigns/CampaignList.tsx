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
  Search,
  Users,
} from "lucide-react";
import { cn, followerRanges } from "@/lib/utils";
import { PiInstagramLogoFill, PiTiktokLogoFill } from "react-icons/pi";
import { FaFacebook, FaYoutube } from "react-icons/fa";

import Link from "next/link";
import { ActionMenu } from "@/components/ActionDropdown";
import { FaSackDollar } from "react-icons/fa6";
import { Messages } from "../Messages";
import CampaignList from "./CampaignList";
import FilterSidebar from "@/components/filtersidebar";
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
}

const CampaignList = () => {
  const [activeTab, setActiveTab] = useState<string>("Pending Applications");
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [activeSection, setActiveSection] = useState<
    "campaigns" | "submissions"
  >("campaigns");
  const itemsPerPage = 5;

  const tabs = [
    "Pending Applications",
    "Accepted Jobs",
    "Jobs In Progress",
    "Submitted Jobs",
    "Completed Jobs",
    "Declined Jobs",
  ];

  // const jobs: Job[] = [
  //     {
  //         id: "AD201",
  //         logo: "https://1000logos.net/wp-content/uploads/2017/02/Hennes-logo.jpg",
  //         title: "H&M - Spring Launch - TikTok",
  //         brand: "H&M",
  //         description:
  //             "We're launching our fresh Spring Collection and looking for creators to help us bring it to life! We need short, vibrant TikTok videos showing off your favorite Spring outfits – energy, personality, and creativity are a must.",
  //         platforms: ["Instagram", "TikTok", "Youtube"],
  //         requirements: "Nano (1,000 - 10,000 followers)",
  //         payment: "$900",
  //         status: "Pending Applications",
  //         applicants: 0,
  //         bids: 30,
  //         icon: "FaSackDollar",
  //         nano: true,
  //     },
  //     {
  //         id: "AD312",
  //         logo: "https://1000logos.net/wp-content/uploads/2017/02/Hennes-logo.jpg",
  //         title: "H&M - Campaign - Instagram Reels",
  //         brand: "H&M",
  //         description:
  //             "We're on the hunt for creators who live for simplicity, comfort, and style. Showcase your favorite looks from our Everyday Essentials line – how you wear them at home, at work, or out with friends. Keep it authentic, relatable, and real.",
  //         platforms: ["Instagram", "TikTok", "Youtube"],
  //         requirements: "Nano (1,000 - 10,000 followers)",
  //         payment: "$2000",
  //         status: "Accepted Jobs",
  //         applicants: 30,
  //         bids: 0,
  //         icon: "gavel",
  //         nano: true,
  //     },
  //     {
  //         id: "AD202",
  //         logo: "https://1000logos.net/wp-content/uploads/2017/02/Hennes-logo.jpg",
  //         title: "H&M - Fresh Fits - TikTok Activation",
  //         brand: "H&M",
  //         description:
  //             "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  //         platforms: ["Instagram", "TikTok", "Youtube"],
  //         requirements: "Nano (1,000 - 10,000 followers)",
  //         payment: "$650",
  //         status: "Jobs In Progress",
  //         applicants: 0,
  //         bids: 30,
  //         icon: "FaSackDollar",
  //         nano: true,
  //     },
  //     {
  //         id: "AD203",
  //         logo: "https://1000logos.net/wp-content/uploads/2017/02/Hennes-logo.jpg",
  //         title: "H&M - New Season Drop - Creator Collab",
  //         brand: "H&M",
  //         description:
  //             "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  //         platforms: ["Instagram", "TikTok", "Youtube"],
  //         requirements: "Nano (1,000 - 10,000 followers)",
  //         payment: "$300",
  //         status: "Submitted Jobs",
  //         applicants: 30,
  //         bids: 0,
  //         icon: "gavel",
  //         nano: true,
  //     },
  //     {
  //         id: "AD204",
  //         logo: "https://1000logos.net/wp-content/uploads/2017/02/Hennes-logo.jpg",
  //         title: "H&M - TikTok Activation",
  //         brand: "H&M",
  //         description:
  //             "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  //         platforms: ["Instagram", "TikTok", "Youtube"],
  //         requirements: "Nano (1,000 - 10,000 followers)",
  //         payment: "$1000",
  //         status: "Completed Jobs",
  //         applicants: 30,
  //         bids: 0,
  //         icon: "gavel",
  //         nano: true,
  //     },
  //     {
  //         id: "AD205",
  //         logo: "https://1000logos.net/wp-content/uploads/2017/02/Hennes-logo.jpg",
  //         title: "H&M - Summer Collection",
  //         brand: "H&M",
  //         description:
  //             "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  //         platforms: ["Instagram", "TikTok", "Youtube"],
  //         requirements: "Nano (1,000 - 10,000 followers)",
  //         payment: "$800",
  //         status: "Declined Jobs",
  //         applicants: 15,
  //         bids: 0,
  //         icon: "gavel",
  //         nano: true,
  //     },
  // ]

  const getJobs = async () => {
    try {
      const companyJobs = await apiFetch("/jobs");
      const requiredFieldJobs = (companyJobs.allJobs || []).map((jobs) => ({
        id: jobs._id,
        logo: jobs.companyId.profileImageUrl,
        title: jobs.campaignName,
        brand: jobs.companyId.companyName,
        description: jobs.campaignBrief,
        platforms: jobs.selectedPlatforms,
        requirements: followerRanges[jobs.followerSize],
        payment: jobs.budget,
        status: jobs.status,
        applicants: jobs.applicants?.length || 0,
        bids: jobs.bids?.length || 0,
        icon: jobs.icon,
      }));
      setJobs(requiredFieldJobs);
    } catch (error: any) {
      console.log("Unable to load campaign or jobs");
    }
  };

  useEffect(() => {
    getJobs();
  }, []);
  const filteredJobs =
    activeSection === "campaigns"
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
    <div>
      <div className="mb-6 flex items-center gap-3">
        <FilterSidebar
          customStyle="border border-gray-400 text-white/90"
          onApply={() => console.log("Filters applied")}
        />
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-full bg-transparent border border-gray-400 py-2 pl-10 pr-4 text-sm"
          />
        </div>
      </div>
      <span className="text-white/90 text-xs">{`${jobs.length} jobs found`}</span>
      <br />
      <br />
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
              <Link href={`/dashboard/brand/jobs/${job.id}`}>
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
                      icon: <FaYoutube className="w-5 h-5 text-black/80" />,
                      url: "https://www.youtube.com",
                    },
                    facebook: {
                      icon: <FaFacebook className="w-5 h-5 text-black/80" />,
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
              <p className="text-white text-sm font-light">{job.description}</p>

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
                    <Link href={`/dashboard/brand/jobs/${job.id}`}>
                      <h3 className="text-white font-medium">{job.title}</h3>
                    </Link>
                    {/* Row 3: Platform logos */}
                    <div className="flex space-x-2">
                      {job.platforms.map((platform, index) => {
                        const name = platform.toLowerCase();

                        // Define all supported platforms once
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
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {job.status === "Pending Applications" ? (
                        <span className="bg-gray-400 border border-white text-white font-light text-[11px] px-2 py-1 rounded-md">
                          Pending
                        </span>
                      ) : job.status === "Accepted Jobs" ? (
                        <span className="bg-[#FFC5C5] border border-red-400 text-black font-light text-[11px] px-2 py-1 rounded-md">
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
                    <div className="text-white text-sm">
                      {job.applicants > 0
                        ? `${job.applicants} Applicants`
                        : `${job.bids} Applicants`}
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
    </div>
  );
};

export default CampaignList;
