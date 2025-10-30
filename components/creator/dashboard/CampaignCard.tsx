// components/CampaignCard.tsx
"use client";

import { useState, useEffect } from "react";
import { FaClock, FaFacebook, FaYoutube } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { cn, followerRanges } from "@/lib/utils";
import { Briefcase, Calendar, DollarSign, Gavel, Users } from "lucide-react";
import Image from "next/image";
import { PiInstagramLogoFill, PiTiktokLogoFill } from "react-icons/pi";
import { FaSackDollar } from "react-icons/fa6";
import { apiFetch } from "@/lib/api";
import { PlatformIcons } from "@/components/ui/platformIcons";

export default function CampaignCard({
  campaignId,
}: {
  campaignId: string | null;
}) {
  const [campaign, setCampaign] = useState<any | null>(null);

  // const campaign = campaignsData.find((c) => c.id === campaignId);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      const response = await apiFetch(`/jobs/${campaignId}`);
      if (response?.job) {
        const campaignData = transformJobData(response.job);
        setCampaign(campaignData);
      }
    };
    fetchJobData();
  }, [campaignId]);

  if (!campaign) return null;
  return (
    <div className="rounded-3xl p-6 mb-0">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="max-md:w-full">
          <div className="relative flex-shrink-0 max-md:hidden bg-white rounded-full w-24 h-24 flex items-center justify-center">
            <Image
              src={campaign.logo}
              alt={campaign.companyName}
              width={100}
              height={100}
              className="object-cover w-24 h-24 rounded-full"
            />
            {campaign.icon === "gavel" ? (
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
          <div className="flex items-center justify-between gap-2 w-full md:hidden">
            <div className="relative flex-shrink-0  bg-white rounded-full w-16 h-16 flex items-center justify-center">
              <Image
                src={campaign.logo}
                alt={campaign.companyName}
                width={50}
                height={50}
                className="object-contain w-16 h-16 rounded-full"
              />
              <div>
                {campaign.icon === "gavel" ? (
                  <span className="absolute left-8 -bottom-4 bg-white rounded-full flex items-center justify-center w-8 h-8 border border-[#3A3A3A] text-white text-sm pointer-events-none max-md:left-auto max-md:top-0 max-md:-right-3 max-md:bottom-auto max-md:w-6 max-md:h-6">
                    <Gavel
                      size={20}
                      className="text-black/80 max-md:w-3 max-md:h-3"
                    />
                  </span>
                ) : (
                  <span className="absolute left-8 -bottom-4 bg-black/90 rounded-full flex items-center justify-center w-8 h-8 border border-[#3A3A3A] text-white text-sm pointer-events-none max-md:left-auto max-md:top-0 max-md:-right-3 max-md:bottom-auto max-md:w-6 max-md:h-6">
                    <FaSackDollar
                      size={14}
                      className="text-white max-md:w-3 max-md:h-3"
                    />
                  </span>
                )}
              </div>
            </div>
            <div className="">
              {campaign.status ? (
                <span
                  className={cn(
                    "px-2 py-1 text-xs rounded-md font-medium md:hidden capitalize",
                    campaign.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  )}
                >
                  {campaign.status === "inprogress"
                    ? "In Progress"
                    : campaign.status}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-start">
            <div className="flex max-md:flex-col gap-2 md:items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {campaign.title}
              </h2>
              <PlatformIcons platforms={campaign.platforms} />{" "}
            </div>

            {campaign.status ? (
              <span
                className={cn(
                  "flex items-end px-2 py-0.5 text-xs rounded-md font-medium max-md:hidden capitalize",
                  campaign.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                )}
              >
                {campaign.status === "inprogress"
                  ? "In Progress"
                  : campaign.status}
              </span>
            ) : null}
          </div>

          <p className="text-sm text-gray-700 mt-2">
            {campaign.shortDescription}
          </p>
          {
            <>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <Countdown targetSeconds={campaign.remainingSeconds} />
              </div>

              <button
                onClick={() => setShowMore(!showMore)}
                className="mt-2 text-black/80 border border-black/80 px-2 py-1 rounded-full text-sm font-medium !mt-4"
              >
                {showMore ? "Show Less" : "Show More"}
              </button>

              <AnimatePresence>
                {showMore && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-4 text-sm text-gray-700 space-y-4"
                  >
                    <div>
                      <strong>Campaign Goal:</strong>
                      <p>{campaign.longDescription.goal}</p>
                    </div>

                    <div>
                      <strong>Type of Content Needed:</strong>
                      <ul className="list-disc list-inside">
                        {campaign.longDescription.typeOfContent.map(
                          (item, index) => (
                            <li key={index}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>

                    <div>
                      <strong>Caption Guidelines:</strong>
                      <ul className="list-disc list-inside">
                        {campaign.longDescription.captionGuidelines.map(
                          (item, index) => (
                            <li key={index}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>

                    <div>
                      <strong>Don't Do:</strong>
                      <ul className="list-disc list-inside">
                        {campaign.longDescription.dontDo.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          }

          <div className="flex flex-wrap max-md:flex-col gap-6 mt-2 text-sm !my-5">
            <div className="flex items-center gap-1">
              <Users className="w-5 h-5 text-black/80" />
              <span>{campaign.creatorType}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-5 h-5 text-black/80" />
              <span>{campaign.contentType}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-5 h-5 text-black/80" />
              <span>{campaign.collaborationType}</span>
            </div>
            {campaign.camapignDuration && (
              <div className="flex items-center gap-1">
                <Calendar className="w-5 h-5 text-black/80" />
                <span>{campaign.campaignDuration}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Countdown({ targetSeconds }: { targetSeconds: number }) {
  const [remaining, setRemaining] = useState(targetSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const days = Math.floor(remaining / (3600 * 24));
  const hours = Math.floor((remaining % (3600 * 24)) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  return (
    <span className="bg-pink-100 text-black/80 px-2 py-1 rounded-full text-xs font-medium">
      {days}d {hours}h {minutes}m {seconds}s until closed
    </span>
  );
}

interface Job {
  _id: string;
  logo: string;
  companyName: string;
  icon?: string;
  status?: string;
  campaignName: string;
  campaignBrief: string;
  campaignGoal: string;
  requirements: string;
  captionGuidelines: string;
  dontDo: string;
  budget: string;
  followerSize: string;
  selectedPlatforms: string[];
  totalPayment: number | string;
  paymentType: string;
  taskType: string;
  campaignDuration: string;
  createdAt?: string;
  updatedAt?: string;
}

export function transformJobData(job) {
  const splitByCommaOrNewline = (str: string) =>
    str
      ? str
          .split(/[,•\n]/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  const postDeadline = job.postDeadline;
  const endDate = Date.parse(postDeadline);
  const now = new Date().getTime();
  const remainingSeconds = Math.max(0, Math.floor((endDate - now) / 1000));

  return {
    id: job._id,
    logo: job.companyId.profileImageUrl,
    icon: job.icon || "gavel",
    title: job.campaignName,
    status: job.status,
    shortDescription: job.campaignBrief,
    creatorType: followerRanges[job.followerSize],
    contentType: job.contentType || "UGC",
    collaborationType: job.collaborationType,
    campaignDuration:
      job.JobType === "direct"
        ? `${job.campaignStartDate} - ${job.campaignEndDate}`
        : "",
    postDeadline: job.postDeadline,
    longDescription: {
      goal: job.campaignGoal,
      typeOfContent: splitByCommaOrNewline(job.requirements),
      captionGuidelines: splitByCommaOrNewline(job.captionGuidelines),
      dontDo: splitByCommaOrNewline(job.dontDo),
    },
    payment: job.budget,
    platforms: job.selectedPlatforms || [],
    format: job.taskType,
    remainingSeconds,
  };
}
