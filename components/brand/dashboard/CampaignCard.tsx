"use client";
import { apiFetch } from "@/lib/api";
import { followerRanges } from "@/lib/utils";
import {
  Briefcase,
  Calendar,
  DollarSign,
  Instagram,
  TwitterIcon as TikTok,
  Users,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { PiInstagramLogoFill, PiTiktokLogoFill } from "react-icons/pi";

export default function CampaignCard() {
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(`/jobs/${id}`);
        const job = data.job;
        const requiredFieldJobs = {
          id: job._id,
          logo: job.companyId.profileImageUrl,
          title: job.campaignName,
          brand: job.companyId.companyName,
          description: job.campaignBrief,
          platforms: job.selectedPlatforms,
          requirements: followerRanges[job.followerSize],
          payment: job.budget,
          status: job.status,
          campaignDuration: job.campaignDuration,
          postDeadline: job.postDeadline,
          collaborationType: job.collaborationType,
          applicants: job.applicants?.length || 0,
          bids: job.bids?.length || 0,
          icon: job.icon,
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

  if (loading) return <p>Loading... </p>;
  if (!job) return null;
  return (
    <div className="bg-epiclinx-semiteal text-black rounded-3xl p-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="flex-shrink-0 max-md:hidden bg-white rounded-full w-24 h-24 flex items-center justify-center overflow-hidden">
          <Image
            src={job.logo}
            alt={job.brand}
            width={100}
            height={100}
            className="object-cover"
          />
        </div>
        <div className="flex items-center justify-between gap-2 w-full md:hidden">
          <div className="flex-shrink-0 bg-white rounded-full w-16 h-16 flex items-center justify-center">
            <Image
              src={job.logo}
              alt={job.brand}
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-2">
            {/* <span className="bg-[#D8E6F6] text-black/80 text-xs border border-blue-500 font-semibold px-2 py-1 rounded-md">
              Live
            </span> */}
            <span className="font-bold text-xl">${job.payment}</span>
          </div>
        </div>
        <div className="flex-grow space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex md:items-center max-md:flex-col gap-4">
              <h2 className="text-xl font-bold">{job.title}</h2>
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
            </div>
            <div className="flex items-center gap-2 max-md:hidden">
              {/* <span className="bg-[#D8E6F6] text-black/80 text-xs border border-blue-500 font-semibold px-2 py-1 rounded-md">
                Live
              </span> */}
              <span className="font-bold text-xl">${job.payment}</span>
            </div>
          </div>
          <p className="text-sm !my-4">{job.campaignBrief}</p>
          <div className="flex flex-wrap max-md:flex-col gap-6 mt-2 text-sm !my-5">
            <div className="flex items-center gap-1">
              <Users className="w-5 h-5 text-black/80" />
              <span>{job.requirements}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-5 h-5 text-black/80" />
              <span>UGC</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-5 h-5 text-black/80" />
              <span>{job.collaborationType}</span>
            </div>
            <div className="flex items-center gap-1">
              {(job.campaignDuration || job.postDeadline) && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-black/80" />
                  <span>
                    {job.campaignDuration ?? ""}
                    {job.campaignDuration && job.postDeadline ? " - " : ""}
                    {job.postDeadline ?? ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
