"use client"
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/stores/useAuthStore";

export function NextChapter() {
  const { user } = useAuthStore();
  return (
    <div className="bg-epiclinx-semiteal rounded-3xl p-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Left Side (Content) */}
        <div className="w-full md:w-5/5">
          {/* Title + Buttons Row for Desktop */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4 mb-4">
            <h2 className="text-3xl md:text-3xl font-bold text-[#2A2A2A]">
              Your next big chapter.
            </h2>

            {/* Buttons Group */}
            <div className="flex flex-row flex-wrap gap-4 md:gap-3 w-full md:w-auto">
              <Link
                href="/dashboard/creator/jobs"
                className="w-full md:w-auto flex h-12 items-center justify-center border border-gray-800 text-[#2A2A2A] font-medium rounded-full px-6 py-2 text-center"
              >
                Browse job ads
              </Link>
            </div>
          </div>

          {/* Paragraph */}
          <p className="text-[#2A2A2A] mb-4">
            You’re one step closer to your next big collab. Explore live brand
            briefs, sharpen your profile, and pitch to the projects that fire
            you up. Let’s turn your creativity into real opportunity.{" "}
            <span className="max-md:hidden">
              Let's create something unforgettable together.
            </span>
          </p>
        </div>

        {/* Right Side (Image) */}
        <div className="w-full md:w-1/5 flex justify-start md:justify-end">
          <div className="w-[130px] h-[130px] rounded-full bg-white flex items-center justify-center">
            <Image
              src={
                user?.profileImageUrl ||
                "https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://media.easy-peasy.ai/fb9a7875-06f1-48d6-b719-ba908fd7217f/f8225861-19d3-4b7e-8bdc-d4cee17872ca.png"
              }
              alt="Post Job"
              width={130}
              height={130}
              className="object-cover h-[130px] w-[130px] rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
