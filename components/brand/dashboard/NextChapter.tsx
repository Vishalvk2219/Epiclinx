"use client";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import Image from "next/image";

export function NextChapter() {
  const { user } = useAuthStore();
  return (
    <div className="bg-epiclinx-semiteal rounded-3xl p-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Left Side (Content) */}
        <div className="w-full md:w-5/5">
          {/* Title + Buttons Row for Desktop */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4 mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-[#2A2A2A]">
              Your next big chapter.
            </h2>

            {/* Buttons Group */}
            <div className="flex flex-row flex-wrap gap-4 md:gap-3 w-full md:w-auto">
              <Link
                href="/dashboard/brand/find-creators"
                className="flex-1  border w-40 flex h-12 items-center justify-center border-[#2A2A2A] bg-transparent text-[#2A2A2A] font-medium rounded-full px-4 py-2 text-center hover:bg-black/5"
              >
                Find creators
              </Link>
              <Link
                href="/dashboard/brand/jobs"
                className="flex-1  border flex h-12 items-center justify-center border-[#2A2A2A] bg-transparent text-[#2A2A2A] font-medium rounded-full px-4 py-2 text-center hover:bg-black/5"
              >
                Campaigns
              </Link>
              <Link
                href="/brand/post-a-job"
                className="w-full md:w-auto flex h-12 items-center justify-center bg-[#00E5C7] hover:bg-[#00E5C7]/90 text-[#2A2A2A] font-medium rounded-full px-6 py-2 text-center"
              >
                Post a job
              </Link>
            </div>
          </div>

          {/* Paragraph */}
          <p className="text-[#2A2A2A] mb-4">
            Your brand's next chapter starts here. Explore creators, post a job,
            or jump into collabs already making waves.{" "}
            <span className="max-md:hidden">
              Let's create something unforgettable together.
            </span>
          </p>

          <span className="md:hidden text-black">
            Let's create something unforgettable together.
          </span>
        </div>

        {/* Right Side (Image) */}
        <div className="w-full md:w-1/5 flex justify-start md:justify-end">
          <div className="w-[130px] h-[130px] rounded-full bg-white flex items-center justify-center">
            {user?.profileImageUrl ? (
              <Image
                src={user.profileImageUrl}
                alt="Post Job"
                width={130}
                height={130}
                className="object-cover h-[130px] w-[130px] rounded-full"
              />
            ) : (
              <span className="text-[#FF0000] font-bold text-3xl">
                {" "}
                {user?.companyName?.at(0) || user?.displayName?.at(0) || "E" } {" "}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
