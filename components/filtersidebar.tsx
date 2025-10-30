"use client";

import { SlidersHorizontal, X, ChevronDown, Radio } from "lucide-react";
import { countries } from "@/lib/countries";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
const categoriesList = [
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

const followerSizes = [
  "1000 to 10,000",
  "10,000 to 50,000",
  "50,000 to 250,000",
  "250,000+",
];

const platformsList = [
  "TikTok",
  "Instagram",
  "YouTube",
  "Facebook",
  "Snapchat",
  "Twitch",
  "Kiki",
];

export default function FilterSidebar({
  openSidebar,
  isOpen,
  onClose,
  categories,
  followers,
  platforms,
  location,
  featured,
  jobType,
  onChange,
  customStyle = "border border-gray-700 text-black/90",
}: {
  openSidebar: () => void;
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  followers: string[];
  platforms: string[];
  location: string;
  featured: boolean;
  jobType: string;
  onChange: (newFilters: {
    categories: string[];
    followers: string[];
    platforms: string[];
    location: string;
    featured: boolean;
  }) => void;
  customStyle?: string;
}) {
  const toggleItem = (item: string, list: string[]) => {
    return list.includes(item)
      ? list.filter((i) => i !== item)
      : [...list, item];
  };

  const clearAll = () => {
    onChange({
      categories: [],
      followers: [],
      platforms: [],
      location: "",
      featured: true,
    });
  };

  return (
    <>
      <button
        onClick={() => openSidebar()}
        className={`flex items-center gap-2 border border-gray-400 text-white px-4 py-2 rounded-full text-sm text-black dark:text-white`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose}></div>
      )}

      <div
        className={`fixed top-0 left-0 z-50 h-full w-[90%] max-w-sm bg-white dark:bg-[#111] p-4 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Filters
          </h3>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-black dark:text-white" />
          </button>
        </div>
        {/* Category Filter */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-black dark:text-white">
              Category
            </h4>
            {categories.length > 0 && (
              <button
                onClick={() =>
                  onChange({
                    ...{
                      categories: [],
                      followers,
                      platforms,
                      location,
                      featured,
                    },
                    categories: [],
                  })
                }
                className="text-xs text-[#00a196] underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categoriesList.map((cat) => {
              const selected = categories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() =>
                    onChange({
                      categories: toggleItem(cat, categories),
                      followers,
                      platforms,
                      location,
                      featured,
                    })
                  }
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    selected
                      ? "bg-[#00e0ca] text-black"
                      : "bg-[#00e0ca]/20 text-[#005e5a] dark:text-[#00e0ca]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
        <hr className="my-4 border-gray-300 dark:border-gray-600" />
        {/* Follower Size */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-black dark:text-white">
              Follower Size
            </h4>
            {followers.length > 0 && (
              <button
                onClick={() =>
                  onChange({
                    categories,
                    followers: [],
                    platforms,
                    location,
                    featured,
                  })
                }
                className="text-xs text-[#00a196] underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {followerSizes.map((size) => (
              <label
                key={size}
                className="flex items-center gap-2 text-sm cursor-pointer text-black dark:text-white"
              >
                <input
                  type="checkbox"
                  checked={followers.includes(size)}
                  onChange={() =>
                    onChange({
                      categories,
                      followers: toggleItem(size, followers),
                      platforms,
                      location,
                      featured,
                    })
                  }
                  className="accent-[#00e0ca] cursor-pointer"
                />
                {size}
              </label>
            ))}
          </div>
        </div>
        <hr className="my-4 border-gray-300 dark:border-gray-600" />
        {/* Platforms */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-black dark:text-white">
              Platform
            </h4>
            {platforms.length > 0 && (
              <button
                onClick={() =>
                  onChange({
                    categories,
                    followers,
                    platforms: [],
                    location,
                    featured,
                  })
                }
                className="text-xs text-[#00a196] underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {platformsList.map((platform) => (
              <label
                key={platform}
                className="flex items-center gap-2 text-sm cursor-pointer text-black dark:text-white"
              >
                <input
                  type="checkbox"
                  checked={platforms.includes(platform)}
                  onChange={() =>
                    onChange({
                      categories,
                      followers,
                      platforms: toggleItem(platform, platforms),
                      location,
                      featured,
                    })
                  }
                  className="accent-[#00e0ca] cursor-pointer"
                />
                {platform}
              </label>
            ))}
          </div>
        </div>
        <hr className="my-4 border-gray-300 dark:border-gray-600" />
        {/* Location */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-black dark:text-white">
              Location
            </h4>
            {location && (
              <button
                onClick={() =>
                  onChange({
                    categories,
                    followers,
                    platforms,
                    location: "",
                    featured,
                  })
                }
                className="text-xs text-[#00a196] underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="relative">
            <select
              value={location}
              onChange={(e) =>
                onChange({
                  categories,
                  followers,
                  platforms,
                  location: e.target.value,
                  featured,
                })
              }
              className="w-full border border-gray-300 dark:border-gray-600 rounded-full cursor-pointer px-3 py-2 text-sm appearance-none bg-white dark:bg-[#1b1b1b] text-black dark:text-white focus:outline-none"
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.label} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <hr className="my-4 border-gray-300 dark:border-gray-600" />
        {jobType && (
          <div className="flex flex-col gap-2 mt-4">
            <label className="text-sm font-medium text-white">Job Type</label>
            <RadioGroup
              defaultValue={formData.jobType}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, jobType: val }))
              }
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="public" id="public" />
                <label htmlFor="public" className="text-sm text-white">
                  Public
                </label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="direct" id="direct" />
                <label htmlFor="direct" className="text-sm text-white">
                  Direct
                </label>
              </div>
            </RadioGroup>
          </div>
        )}
        {/* Featured Toggle */}
        {featured ? (
          <div className="mb-4 flex items-center gap-2 text-black dark:text-white">
            <input
              type="checkbox"
              checked={featured}
              onChange={() =>
                onChange({
                  categories,
                  followers,
                  platforms,
                  location,
                  featured: !featured,
                })
              }
              className="accent-[#00e0ca] cursor-pointer"
            />
            <span className="text-sm cursor-pointer">Featured Creators</span>
          </div>
        ) : null}
        {/* Footer Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={clearAll}
            className="text-sm underline text-gray-600 dark:text-gray-400"
          >
            Clear all
          </button>
          <button
            onClick={onClose}
            className="bg-black dark:bg-white text-white dark:text-black px-5 py-2 rounded-full text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
