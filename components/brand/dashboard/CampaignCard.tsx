"use client";

import { apiFetch } from "@/lib/api";
import { followerRanges } from "@/lib/utils";
import {
  Briefcase,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  Clock,
  Target,
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle,
  Tag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { PiInstagramLogoFill, PiTiktokLogoFill } from "react-icons/pi";

export default function CampaignCard() {
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [showMore, setShowMore] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(`/jobs/${id}`);
        const job = data.job;
        console.log(job);
        const requiredFieldJobs = {
          id: job._id,
          logo: job.companyId.profileImageUrl,
          title: job.campaignName,
          brand: job.companyId.companyName,
          description: job.campaignBrief,
          goal: job.campaignGoal,
          requirements: job.requirements,
          captionGuidelines: job.captionGuidelines,
          tagUs: job.tagUs,
          keepItAuthentic: job.keepItAuthentic,
          dontDo: job.dontDo,
          platforms: job.selectedPlatforms,
          followerSize: followerRanges[job.followerSize],
          payment: job.budget,
          status: job.status,
          campaignStartDate: job?.campaignStartDate,
          campaignEndDate: job?.campaignEndDate,
          postDeadline: job.postDeadline,
          collaborationType: job.collaborationType,
          contentType: job.contentType,
          location: job.location || "Not specified",
          applicants: job.applicants?.length || 0,
          bids: job.bids?.length || 0,
          icon: job.icon,
          niche: job.niche || [],
        };
        setJob(requiredFieldJobs);
      } catch (error: any) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const getPlatformIcon = (platform: string) => {
    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform.includes("instagram"))
      return <PiInstagramLogoFill className="w-4 h-4" />;
    if (lowerPlatform.includes("facebook"))
      return <FaFacebook className="w-4 h-4" />;
    if (lowerPlatform.includes("youtube"))
      return <FaYoutube className="w-4 h-4" />;
    if (lowerPlatform.includes("tiktok"))
      return <PiTiktokLogoFill className="w-4 h-4" />;
    return null;
  };

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (!job) return null;

  return (
    <div className="bg-epiclinx-semiteal text-black rounded-2xl shadow-lg mx-auto overflow-hidden ">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-epiclinx-teal to-epiclinx-semiteal p-4">
        <div className="flex items-start gap-4">
          <div className="bg-white rounded-xl w-16 h-16 flex items-center justify-center overflow-hidden shadow-md flex-shrink-0">
            <Image
              src={job.logo}
              alt={job.brand}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 mb-1 truncate">
              {job.title}
            </h2>
            <p className="text-sm text-gray-800 font-medium mb-2">
              {job.brand}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-white/80 rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> {job.payment}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  job.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {job.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-white/40">
        <div className="flex items-center gap-2">
          <div className="bg-epiclinx-teal/20 p-2 rounded-lg">
            <Users className="w-4 h-4 text-epiclinx-teal" />
          </div>
          <div>
            <p className="text-xs text-gray-600">Applicants</p>
            <p className="text-lg font-bold text-gray-900">{job.applicants}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-epiclinx-teal/20 p-2 rounded-lg">
            <Target className="w-4 h-4 text-epiclinx-teal" />
          </div>
          <div>
            <p className="text-xs text-gray-600">Bids</p>
            <p className="text-lg font-bold text-gray-900">{job.bids}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-epiclinx-teal/20 p-2 rounded-lg">
            <Briefcase className="w-4 h-4 text-epiclinx-teal" />
          </div>
          <div>
            <p className="text-xs text-gray-600">Type</p>
            <p className="text-xs font-bold text-gray-900 truncate">
              {job.collaborationType}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-epiclinx-teal/20 p-2 rounded-lg">
            <FileText className="w-4 h-4 text-epiclinx-teal" />
          </div>
          <div>
            <p className="text-xs text-gray-600">Content</p>
            <p className="text-xs font-bold text-gray-900 truncate">
              {job.contentType}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-3">
        {/* Description */}
        <div className="bg-white/60 rounded-xl p-3">
          <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-epiclinx-teal" />
            Campaign Brief
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Goal */}
        <div className="bg-white/60 rounded-xl p-3">
          <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-epiclinx-teal" />
            Campaign Goal
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">{job.goal}</p>
        </div>

        {/* Platforms & Categories */}
        <div className="grid md:grid-cols-2 gap-3">
          <div className="bg-white/60 rounded-xl p-3">
            <h3 className="text-xs font-bold text-gray-700 mb-2">Platforms</h3>
            <div className="flex flex-wrap gap-1.5">
              {job.platforms?.map((platform: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 bg-epiclinx-teal/20 px-2 py-1 rounded-lg"
                >
                  {getPlatformIcon(platform)}
                  <span className="text-xs font-medium text-gray-800">
                    {platform}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/60 rounded-xl p-3">
            <h3 className="text-xs font-bold text-gray-700 mb-2">Categories</h3>
            <div className="flex flex-wrap gap-1.5">
              {job.niche.map((category: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-epiclinx-teal/20 px-2 py-1 rounded-lg text-xs font-medium text-gray-800"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="bg-white/60 rounded-xl p-3">
          <h3 className="text-sm font-bold text-gray-900 mb-2">
            Campaign Details
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {job.campaignStartDate && job.campaignEndDate ? (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600">Duration</p>
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {`${job.campaignStartDate.split("T")[0]} - ${job.campaignEndDate.split("T")[0]}` ||
                      "N/A"}
                  </p>
                </div>
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-600">Post Deadline</p>
                <p className="text-xs font-semibold text-gray-900 truncate">
                  {job.postDeadline
                    ? new Date(job.postDeadline).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-600">Location</p>
                <p className="text-xs font-semibold text-gray-900 truncate">
                  {job.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-600">Follower Size</p>
                <p className="text-xs font-semibold text-gray-900 truncate">
                  {job.followerSize || "Any"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Show More Section */}
        {showMore && (
          <div className="space-y-3">
            {/* Requirements */}
            <div className="bg-white/60 rounded-xl p-3">
              <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Requirements
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {job.requirements}
              </p>
            </div>

            {/* Caption Guidelines */}
            <div className="bg-white/60 rounded-xl p-3">
              <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-epiclinx-teal" />
                Caption Guidelines
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {job.captionGuidelines}
              </p>
            </div>

            {/* Tag Us */}
            <div className="bg-white/60 rounded-xl p-3">
              <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-epiclinx-teal" />
                Tag Us
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {job.tagUs}
              </p>
            </div>

            {/* Keep It Authentic */}
            <div className="bg-white/60 rounded-xl p-3">
              <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Keep It Authentic
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {job.keepItAuthentic}
              </p>
            </div>

            {/* Don't Do */}
            <div className="bg-white/60 rounded-xl p-3">
              <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-600" />
                Don't Do
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {job.dontDo}
              </p>
            </div>
          </div>
        )}

        {/* Show More/Less Button */}
        <button
          onClick={() => setShowMore(!showMore)}
          className="w-full bg-epiclinx-teal hover:bg-epiclinx-teal/90 text-white font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
        >
          {showMore ? (
            <>
              Show Less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show More Details <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
