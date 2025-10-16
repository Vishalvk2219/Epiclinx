"use client";
import { Camera, Pencil } from "lucide-react";
import Image from "next/image";
import React from "react";
import { FaYoutube } from "react-icons/fa";
import { PiInstagramLogoFill, PiTiktokLogoFill } from "react-icons/pi";
import { useAuthStore } from "@/stores/useAuthStore";

const ProfileView = () => {
  const { user } = useAuthStore();

  return (
    <div>
      <div className="relative bg-epiclinx-semiteal rounded-3xl p-12 text-white">
        {/* Top-right buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="bg-black/50 text-white text-sm flex items-center gap-1 rounded-full px-3 py-1">
            <Camera className="w-4 h-4" />
            <span>Change Cover Image</span>
          </button>
          <a
            href="/dashboard/brand/profile-management"
            className="bg-black/50 text-white text-sm flex items-center gap-1 rounded-full px-3 py-1"
          >
            <Pencil className="w-4 h-4" />
            <span>Edit profile</span>
          </a>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row items-start md:items-center md:gap-8">
          {/* Left: Image */}
          <div className="flex-shrink-0 mx-auto md:mx-0 mb-4 md:mb-0">
            <Image
              src={user?.profileImageUrl || ""}
              alt="Logo"
              width={100}
              height={100}
              className="rounded-full object-cover bg-white p-2"
            />
          </div>

          {/* Right: Info */}
          <div className="flex flex-col w-full gap-3 text-black">
            {/* Name & Socials */}
            <div className="flex flex-col md:flex-row md:items-center  gap-2">
              <h3 className="text-2xl font-semibold">
                {user?.companyName}
              </h3>
              <div className="flex gap-3">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                  <PiInstagramLogoFill className="w-5 h-5 text-black/80" />
                </div>
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                  <PiTiktokLogoFill className="w-5 h-5 text-black/80" />
                </div>
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                  <FaYoutube className="w-5 h-5 text-black/80" />
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm max-w-2xl">
              {user?.businessDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex w-full max-md:flex-col justify-between mt-6 gap-4">
        <div className="flex w-full justify-between max-md:flex-col max-md:items-start gap-3 items-center bg-white/10 rounded-3xl p-10 text-center text-white">
          <p className="text-6xl font-bold">11</p>
          <p className="text-md mt-1">Jobs posted</p>
        </div>
        <div className="flex w-full justify-between items-center max-md:flex-col max-md:items-start gap-3 bg-white/10 rounded-3xl p-10 text-center text-white">
          <p className="text-6xl font-bold">32</p>
          <p className="text-md mt-1">Jobs completed</p>
        </div>
        <div className="flex w-full justify-between items-center max-md:flex-col max-md:items-start gap-3 bg-white/10 rounded-3xl p-10 text-center text-white">
          <p className="text-6xl font-bold">40</p>
          <p className="text-md mt-1">Sales completed</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
