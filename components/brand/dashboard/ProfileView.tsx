"use client";

import { Camera, Pencil, Globe, MapPin } from "lucide-react";
import Image from "next/image";
import React from "react";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import { PiInstagramLogoFill, PiTiktokLogoFill } from "react-icons/pi";
import { useAuthStore } from "@/stores/useAuthStore";

const ProfileView = () => {
  const { user } = useAuthStore();

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111] text-white rounded-3xl shadow-xl overflow-hidden">
      {/* Cover Image Section */}
      <div className="relative w-full h-60 md:h-80 bg-gray-800">
        {user?.profileImageUrl ? (
          <Image
            src={user.coverImage ? user.coverImage : user.profileImageUrl}
            alt="Cover Image"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
            No Cover Image
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-3">
          <button className="flex items-center gap-2 bg-black/50 hover:bg-black/70 text-sm font-medium px-3 py-2 rounded-full backdrop-blur-md transition">
            <Camera size={16} /> Change Cover
          </button>
          <a 
          href="/dashboard/brand/profile-management"
          className="flex items-center gap-2 bg-[#00CEC9]/90 hover:bg-[#00CEC9] text-sm font-medium px-3 py-2 rounded-full transition">
            <Pencil size={16} /> Edit Profile
          </a>
        </div>
      </div>

      {/* Main Info Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 px-6 md:px-10 mt-[-4rem] relative z-10">
        {/* Profile Image */}
        <div className="relative w-36 h-36 rounded-full border-4 border-[#00CEC9] overflow-hidden bg-gray-900 shadow-lg">
          {user?.profileImageUrl ? (
            <Image
              src={user.profileImageUrl}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              No Image
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold md:mt-5">
            {user?.companyName || "Company Name"}
          </h1>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-4 text-gray-400 text-sm">
            {user?.shopAddress && (
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {user.shopAddress}
              </span>
            )}
            {user?.businessWebsite && (
              <a
                href={user.businessWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-[#00CEC9] transition"
              >
                <Globe size={14} /> {user.businessWebsite}
              </a>
            )}
            {user?.followers.length > 1 && (
              <span className="flex items-center gap-1">
                {user.followers} Followers
              </span>
            )}
          </div>

          {/* Social Links */}
          <div className="flex justify-center md:justify-start gap-3 mt-4">
            {user?.instagram && (
              <a
                href={user.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#222] hover:bg-[#00CEC9]/20 transition"
              >
                <PiInstagramLogoFill size={20} />
              </a>
            )}
            {user?.facebook && (
              <a
                href={user.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#222] hover:bg-[#00CEC9]/20 transition"
              >
                <FaFacebookF size={18} />
              </a>
            )}
            {user?.tiktok && (
              <a
                href={user.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#222] hover:bg-[#00CEC9]/20 transition"
              >
                <PiTiktokLogoFill size={20} />
              </a>
            )}
            {user?.otherSocial && (
              <a
                href={user.otherSocial}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#222] hover:bg-[#00CEC9]/20 transition"
              >
                <FaYoutube size={18} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="px-6 md:px-10 mt-8 mb-10">
        <h2 className="text-xl font-semibold mb-3 text-[#00CEC9]">
          About the Company
        </h2>
        <p className="text-gray-300 leading-relaxed">
          {user?.businessDescription ||
            "This company has not added a description yet."}
        </p>

        {user?.shopAddress && (
          <p className="mt-4 text-gray-400 text-sm">
            📍 <span className="font-medium">Address:</span> {user.shopAddress}
          </p>
        )}

        {user?.abn && (
          <p className="text-gray-400 text-sm mt-1">
            💼 <span className="font-medium">ABN:</span> {user.abn}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
