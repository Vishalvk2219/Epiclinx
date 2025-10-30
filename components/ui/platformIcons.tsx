"use client";

import React from "react";
import { PiInstagramLogoFill, PiTiktokLogoFill } from "react-icons/pi";
import { FaYoutube, FaFacebook, FaTwitter, FaLinkedin, FaPinterest, FaSnapchatGhost, FaReddit, FaTwitch } from "react-icons/fa";
import { SiKick } from "react-icons/si";

export type Platform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "facebook"
  | "twitter"
  | "linkedin"
  | "pinterest"
  | "snapchat"
  | "reddit"
  | "twitch"
  | "kick";

interface PlatformIconsProps {
  platforms: string[]; 
  urls?: Record<string, string>; 
  size?: number; 
  className?: string;
}

export const PlatformIcons: React.FC<PlatformIconsProps> = ({
  platforms,
  urls = {},
  size = 5,
  className = "",
}) => {
  const platformMap: Record<string, { icon: JSX.Element; defaultUrl: string }> = {
    instagram: {
      icon: <PiInstagramLogoFill className={`w-${size} h-${size} text-black/80`} />,
      defaultUrl: "https://www.instagram.com",
    },
    tiktok: {
      icon: <PiTiktokLogoFill className={`w-${size} h-${size} text-black/80`} />,
      defaultUrl: "https://www.tiktok.com",
    },
    youtube: {
      icon: <FaYoutube className={`w-${size} h-${size} text-black/80`} />,
      defaultUrl: "https://www.youtube.com",
    },
    facebook: {
      icon: <FaFacebook className={`w-${size} h-${size} text-black/80`} />,
      defaultUrl: "https://www.facebook.com",
    },
    twitter: {
      icon: <FaTwitter className={`w-${size} h-${size} text-black/80`} />,
      defaultUrl: "https://www.twitter.com",
    },
    linkedin: {
      icon: <FaLinkedin className={`w-${size} h-${size} text-black/80`} />,
      defaultUrl: "https://www.linkedin.com",
    },
    pinterest: {
      icon: <FaPinterest className={`w-${size} h-${size} text-black/80`} />,
      defaultUrl: "https://www.pinterest.com",
    },
    snapchat: {
      icon: <FaSnapchatGhost className={`w-${size} h-${size} text-black/80`} />,
      defaultUrl: "https://www.snapchat.com",
    },
    reddit: {
      icon: <FaReddit className={`w-${size} h-${size} text-black/80`} />,
      defaultUrl: "https://www.reddit.com",
    },
    twitch: {
      icon: <FaTwitch className={`w-${size} h-${size} text-black/80`} />,
      defaultUrl: "https://www.twitch.tv",
    },
    kick: {
      icon: <SiKick className={`w-${size} h-${size} text-black/80`} />,
      defaultUrl: "https://kick.com",
    },
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {platforms.map((platform, index) => {
        const name = platform.toLowerCase();
        const platformData = platformMap[name];
        if (!platformData) return null;

        const url = urls[name] || platformData.defaultUrl;

        return (
          <div
            key={index}
            className="w-8 h-8 rounded-full bg-epiclinx-semiteal flex items-center justify-center"
          >
            <a href={url} target="_blank" rel="noopener noreferrer">
              {platformData.icon}
            </a>
          </div>
        );
      })}
    </div>
  );
};
