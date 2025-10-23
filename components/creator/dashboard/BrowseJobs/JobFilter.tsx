"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { countries } from "@/lib/countries";

const niches = [
  "Fashion",
  "Fitness",
  "Wellness",
  "Health",
  "Nutrition",
  "Lifestyle",
  "Parenting",
  "Family",
  "Home",
  "Interior Design",
  "Tech",
  "Gadgets",
  "Gaming",
  "Esports",
  "Music",
  "Performing Arts",
  "Art",
  "Design",
  "Illustration",
  "Education",
  "Study",
  "Learning",
  "Motivation",
  "Mindset",
  "Self-help",
  "Cars",
  "Motorsports",
  "Pets",
  "Animals",
  "Sustainability",
  "Eco-Living",
  "Entertainment",
  "Pop Culture",
  "Memes",
];

const platforms = [
  "All",
  "TikTok",
  "Instagram",
  "YouTube",
  "Facebook",
  "Snapchat",
  "Twitch",
  "Kick",
];
const deliverables = ["Reel", "Video", "Photo", "Other"];
const sortOptions = ["Most Recent", "Highest Paid", "Lowest Paid", "Deadline"];

export type JobFilterValues = {
  sort: string;
  location: string;
  niches: string[];
  platforms: string[];
  deliverables: string[];
};

export default function JobFilter({
  onApply,
}: {
  onApply: (filters: JobFilterValues) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [sort, setSort] = useState<string>("Most Recent");
  const [location, setLocation] = useState<string>("");
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["All"]);
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>(
    []
  );

  const toggleNiche = (niche: string) => {
    setSelectedNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    );
  };

  const toggleDeliverable = (deliverable: string) => {
    setSelectedDeliverables((prev) =>
      prev.includes(deliverable)
        ? prev.filter((d) => d !== deliverable)
        : [...prev, deliverable]
    );
  };

  const togglePlatform = (platform: string) => {
    if (platform === "All") {
      setSelectedPlatforms(["All"]);
    } else {
      setSelectedPlatforms((prev) => {
        // Remove "All" if it's in the array
        const withoutAll = prev.filter((p) => p !== "All");

        // Toggle the selected platform
        if (withoutAll.includes(platform)) {
          const result = withoutAll.filter((p) => p !== platform);
          // If nothing is selected, default to "All"
          return result.length === 0 ? ["All"] : result;
        } else {
          return [...withoutAll, platform];
        }
      });
    }
  };

  const clearAll = () => {
    setSort("Most Recent");
    setLocation("");
    setSelectedNiches([]);
    setSelectedPlatforms(["All"]);
    setSelectedDeliverables([]);
  };

  const handleApply = () => {
    onApply({
      sort,
      location,
      niches: selectedNiches,
      platforms: selectedPlatforms,
      deliverables: selectedDeliverables,
    });
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 border border-gray-400 text-white px-4 py-2 rounded-full text-sm"
      >
        Filters
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 z-50 h-full w-[90%] max-w-sm bg-[#333] p-4 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          <button onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Sort by */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-white">Sort by</h4>
          </div>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full border border-gray-600 rounded-full cursor-pointer px-3 py-2 text-sm appearance-none bg-[#444] text-white focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <hr className="my-4 border-gray-600" />

        {/* Location */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-white">Location</h4>
            {location && (
              <button
                onClick={() => setLocation("")}
                className="text-xs text-[#00e0ca] underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="relative">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              // size={5}
              className="w-full border border-gray-600 rounded-full cursor-pointer px-3 py-2 text-sm appearance-none bg-[#444] text-white focus:outline-none"
            >
              <option value="">Select</option>
              {countries.map((country) => (
                <option
                  key={country.value}
                  value={country.value}
                >
                  {country.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <hr className="my-4 border-gray-600" />

        {/* Niche */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-white">Niche</h4>
            {selectedNiches.length > 0 && (
              <button
                onClick={() => setSelectedNiches([])}
                className="text-xs text-[#00e0ca] underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {niches.map((niche) => {
              const selected = selectedNiches.includes(niche);
              return (
                <button
                  key={niche}
                  onClick={() => toggleNiche(niche)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    selected
                      ? "bg-epiclinx-teal text-black"
                      : "bg-epiclinx-semiteal text-black"
                  }`}
                >
                  {niche}
                </button>
              );
            })}
          </div>
        </div>
        <hr className="my-4 border-gray-600" />

        {/* Platform */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-white">Platform</h4>
            {selectedPlatforms.length > 0 &&
              !selectedPlatforms.includes("All") && (
                <button
                  onClick={() => setSelectedPlatforms(["All"])}
                  className="text-xs text-[#00e0ca] underline"
                >
                  Clear
                </button>
              )}
          </div>
          <div className="flex flex-col gap-2">
            {platforms.map((platform) => (
              <label
                key={platform}
                className="flex items-center gap-2 text-sm cursor-pointer text-white"
              >
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes(platform)}
                  onChange={() => togglePlatform(platform)}
                  className="accent-[#00e0ca] cursor-pointer"
                />
                {platform}
              </label>
            ))}
          </div>
        </div>
        <hr className="my-4 border-gray-600" />

        {/* Deliverables */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-white">Deliverables</h4>
            {selectedDeliverables.length > 0 && (
              <button
                onClick={() => setSelectedDeliverables([])}
                className="text-xs text-[#00e0ca] underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {deliverables.map((deliverable) => {
              const selected = selectedDeliverables.includes(deliverable);
              return (
                <button
                  key={deliverable}
                  onClick={() => toggleDeliverable(deliverable)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    selected
                      ? "bg-epiclinx-teal text-black"
                      : "bg-epiclinx-semiteal text-black"
                  }`}
                >
                  {deliverable}
                </button>
              );
            })}
          </div>
        </div>
        <hr className="my-4 border-gray-600" />

        {/* Footer Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={clearAll}
            className="text-sm underline text-gray-400"
          >
            Clear all
          </button>
          <button
            onClick={handleApply}
            className="bg-[#00e0ca] text-black px-5 py-2 rounded-full text-sm"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}
