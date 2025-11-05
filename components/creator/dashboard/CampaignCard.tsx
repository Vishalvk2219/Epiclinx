"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Briefcase,
  Calendar,
  DollarSign,
  Gavel,
  Users,
  Locate,
  Tag,
  Hash,
  FileCheck2,
} from "lucide-react";
import { FaSackDollar } from "react-icons/fa6";
import { cn, followerRanges } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
import { PlatformIcons } from "@/components/ui/platformIcons";

export default function CampaignCard({
  campaignId,
  setViewAmount
}: {
  campaignId: string | null;
  setViewAmount:React.Dispatch<React.SetStateAction<boolean>>

}) {
  const [campaign, setCampaign] = useState<any | null>(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (!campaignId) return;
    const fetchJobData = async () => {
      try {
        const response = await apiFetch(`/jobs/${campaignId}`);
        if (response?.job) {
          const campaignData = transformJobData(response.job);
          setCampaign(campaignData);
        }
      } catch (error) {
        console.error("Failed to fetch campaign:", error);
      }
    };
    fetchJobData();
  }, [campaignId]);

  if (!campaign) return null;
  if (campaign.offerType === "bid"){
    setViewAmount(true)
  }

  return (
    <div className="rounded-3xl p-6 mb-0 bg-epiclinx-primary shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row gap-4 items-start">
      
        <div className="relative flex-shrink-0">
          <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-sm overflow-hidden">
            {campaign.logo ? (
              <Image
                src={campaign.logo}
                alt={campaign.companyName}
                width={100}
                height={100}
                className="object-cover w-24 h-24 rounded-full"
              />
            ) : (
              <div className="w-24 h-24 flex items-center justify-center text-gray-400 text-sm">
                No Logo
              </div>
            )}
          </div>

          <span
            className={cn(
              "absolute left-16 -bottom-3 rounded-full flex items-center justify-center w-8 h-8 border text-sm",
              campaign.icon === "gavel"
                ? "bg-white border-gray-300 text-black"
                : "bg-black text-white border-black"
            )}
          >
            {campaign.icon === "gavel" ? (
              <Gavel size={16} />
            ) : (
              <FaSackDollar size={14} />
            )}
          </span>
        </div>

       
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {campaign.title || "Untitled Campaign"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {campaign.companyName || "Unknown Brand"}
              </p>
            </div>

            {campaign.status && (
              <span
                className={cn(
                  "px-3 py-1 text-xs rounded-full font-medium capitalize",
                  campaign.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                )}
              >
                {campaign.status}
              </span>
            )}
          </div>

          <div className="mt-2">
            <PlatformIcons platforms={campaign.platforms || []} />
          </div>

          {campaign.shortDescription && (
            <p className="text-gray-700 mt-3">{campaign.shortDescription}</p>
          )}

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <Countdown targetSeconds={campaign.remainingSeconds} />
          </div>

          <button
            onClick={() => setShowMore(!showMore)}
            className="mt-4 text-sm text-black/80 border border-black/80 px-3 py-1 rounded-full font-medium"
          >
            {showMore ? "Show Less" : "Show More"}
          </button>

          <AnimatePresence>
            {showMore && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-5 space-y-4 text-sm text-gray-800"
              >
                {campaign.longDescription.goal && (
                  <DetailBlock
                    title="Campaign Goal"
                    content={campaign.longDescription.goal}
                  />
                )}

                <DetailList
                  title="Requirements"
                  items={campaign.longDescription.typeOfContent}
                />
                <DetailList
                  title="Caption Guidelines"
                  items={campaign.longDescription.captionGuidelines}
                />
                <DetailList
                  title="Don't Do"
                  items={campaign.longDescription.dontDo}
                />

               
                <div className="pt-3 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Payment Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-gray-700 text-sm">
                    <MetaItem
                      icon={<DollarSign className="w-4 h-4" />}
                      label="Budget"
                      value={`${campaign.payment || 0}`}
                    />
                    
                    <MetaItem
                      icon={<FileCheck2 className="w-4 h-4" />}
                      label="Payment Type"
                      value={campaign.paymentType || "N/A"}
                    />
                    <MetaItem
                      icon={<Briefcase className="w-4 h-4" />}
                      label="Collaboration"
                      value={campaign.collaborationType || "N/A"}
                    />
                  </div>
                </div>

               
                <div className="pt-3 border-t border-gray-200 grid md:grid-cols-2 gap-3 text-sm">
                  <MetaRow
                    icon={<Users />}
                    label="Creator Type"
                    value={campaign.creatorType || "N/A"}
                  />
                  <MetaRow
                    icon={<Briefcase />}
                    label="Content Type"
                    value={campaign.contentType || "N/A"}
                  />
                  <MetaRow
                    icon={<Locate />}
                    label="Location"
                    value={campaign.location || "N/A"}
                  />
                  <MetaRow
                    icon={<Tag />}
                    label="Offer Type"
                    value={campaign.offerType || "N/A"}
                  />
                  <MetaRow
                    icon={<Hash />}
                    label="Niches"
                    value={campaign.niche?.join(", ") || "None"}
                  />
                  <MetaRow
                    icon={<Hash />}
                    label="Hashtags"
                    value={
                      campaign.hashtags?.length
                        ? campaign.hashtags.map((h) => `#${h}`).join(", ")
                        : "None"
                    }
                  />
                </div>

               
                <div className="pt-3 border-t border-gray-200 text-sm text-gray-700">
                  <strong>Terms & Conditions:</strong>
                  <ul className="list-disc list-inside">
                    {campaign.contentApproval && (
                      <li>Content approval required before posting</li>
                    )}
                    {campaign.allowShowcase && (
                      <li>Allow campaign to be showcased publicly</li>
                    )}
                    {campaign.agreeToTerms && (
                      <li>Agreed to brand terms and conditions</li>
                    )}
                    {!campaign.contentApproval &&
                      !campaign.allowShowcase &&
                      !campaign.agreeToTerms && <li>No terms provided</li>}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function DetailBlock({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <strong>{title}:</strong>
      <p className="mt-1">{content || "N/A"}</p>
    </div>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <strong>{title}:</strong>
      <ul className="list-disc list-inside mt-1">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-gray-700">
      <span className="w-4 h-4">{icon}</span>
      <span>
        <strong>{label}: </strong>
        {value}
      </span>
    </div>
  );
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {icon}
      <span>
        <strong>{label}: </strong>
        {value}
      </span>
    </div>
  );
}


export function Countdown({ targetSeconds }: { targetSeconds: number }) {
  const [remaining, setRemaining] = useState(targetSeconds || 0);

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


export function transformJobData(job: any) {
  const splitByCommaOrNewline = (str: string | undefined) =>
    str
      ? str
          .split(/[,•\n]/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  const endDate = Date.parse(job.postDeadline || new Date().toISOString());
  const now = new Date().getTime();
  const remainingSeconds = Math.max(0, Math.floor((endDate - now) / 1000));

  return {
    id: job._id,
    logo: job.companyId?.profileImageUrl || null,
    companyName: job.companyId?.companyName || "Brand",
    icon: job.icon || "gavel",
    title: job.campaignName || "Untitled Campaign",
    status: job.status || "",
    shortDescription: job.campaignBrief || "",
    creatorType: followerRanges[job.followerSize] || "Any",
    contentType: job.contentType || "UGC",
    collaborationType: job.collaborationType || "N/A",
    postDeadline: job.postDeadline || "",
    location: job.location || "N/A",
    offerType: job.offerType || "Fixed",
    paymentType: job.paymentType || "Paid",
    niche: job.niche || [],
    hashtags: job.hashtags || [],
    contentApproval: !!job.contentApproval,
    allowShowcase: !!job.allowShowcase,
    agreeToTerms: !!job.agreeToTerms,
    payment: job.budget || 0,
    platforms: job.selectedPlatforms || [],
    longDescription: {
      goal: job.campaignGoal || "",
      typeOfContent: splitByCommaOrNewline(job.requirements),
      captionGuidelines: splitByCommaOrNewline(job.captionGuidelines),
      dontDo: splitByCommaOrNewline(job.dontDo),
    },
    remainingSeconds,
  };
}
