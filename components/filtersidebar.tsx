"use client"

import { useState } from "react"
import { X, SlidersHorizontal, ChevronDown } from "lucide-react"
import { countries } from "@/lib/countries"

const categories = [
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
]

const followerSizes = ["1000 to 10,000", "10,000 to 50,000", "50,000 to 250,000", "250,000+"]

const platforms = ["TikTok", "Instagram", "YouTube", "Facebook", "Snapchat", "Twitch", "Kiki"]

export default function FilterSidebar({
  onApply,
  customStyle = "border border-gray-700 text-black/90",
}: {
  onApply: (filters: {
    categories: string[]
    followers: string[]
    platforms: string[]
    location: string
    featured: boolean
  }) => void
  customStyle?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedFollowers, setSelectedFollowers] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(true)

  const toggleItem = (item: string, list: string[], setter: (val: string[]) => void) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item])
  }

  const clearAll = () => {
    setSelectedCategories([])
    setSelectedFollowers([])
    setSelectedPlatforms([])
    setSelectedLocation("")
    setFeaturedOnly(true)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 ${customStyle} px-4 py-2 rounded-full text-sm text-black dark:text-white`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>

      {isOpen && <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsOpen(false)}></div>}

      <div
        className={`fixed top-0 left-0 z-50 h-full w-[90%] max-w-sm bg-white dark:bg-[#111] p-4 overflow-y-auto transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-white">Filters</h3>
          <button onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6 text-black dark:text-white" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-black dark:text-white">Category</h4>
            {selectedCategories.length > 0 && (
              <button onClick={() => setSelectedCategories([])} className="text-xs text-[#00a196] underline">
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const selected = selectedCategories.includes(cat)
              return (
                <button
                  key={cat}
                  onClick={() => toggleItem(cat, selectedCategories, setSelectedCategories)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    selected ? "bg-[#00e0ca] text-black" : "bg-[#00e0ca]/20 text-[#005e5a] dark:text-[#00e0ca]"
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
        <hr className="my-4 border-gray-300 dark:border-gray-600" />

        {/* Follower Size */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-black dark:text-white">Follower Size</h4>
            {selectedFollowers.length > 0 && (
              <button onClick={() => setSelectedFollowers([])} className="text-xs text-[#00a196] underline">
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {followerSizes.map((size) => (
              <label key={size} className="flex items-center gap-2 text-sm cursor-pointer text-black dark:text-white">
                <input
                  type="checkbox"
                  checked={selectedFollowers.includes(size)}
                  onChange={() => toggleItem(size, selectedFollowers, setSelectedFollowers)}
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
            <h4 className="text-sm font-medium text-black dark:text-white">Platform</h4>
            {selectedPlatforms.length > 0 && (
              <button onClick={() => setSelectedPlatforms([])} className="text-xs text-[#00a196] underline">
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {platforms.map((platform) => (
              <label
                key={platform}
                className="flex items-center gap-2 text-sm cursor-pointer text-black dark:text-white"
              >
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes(platform)}
                  onChange={() => toggleItem(platform, selectedPlatforms, setSelectedPlatforms)}
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
            <h4 className="text-sm font-medium text-black dark:text-white">Location</h4>
            {selectedLocation && (
              <button onClick={() => setSelectedLocation("")} className="text-xs text-[#00a196] underline">
                Clear
              </button>
            )}
          </div>
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-full cursor-pointer px-3 py-2 text-sm appearance-none bg-white dark:bg-[#1b1b1b] text-black dark:text-white focus:outline-none"
            >
              <option value="">Select a country</option>
             {countries.map((country)=>(
              <option value={country.value}>
                {country.label}
              </option>
             ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <hr className="my-4 border-gray-300 dark:border-gray-600" />

        {/* Featured Toggle */}
        <div className="mb-4 flex items-center gap-2 text-black dark:text-white">
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={() => setFeaturedOnly((prev) => !prev)}
            className="accent-[#00e0ca] cursor-pointer"
          />
          <span className="text-sm cursor-pointer">Featured Creators</span>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button onClick={clearAll} className="text-sm underline text-gray-600 dark:text-gray-400">
            Clear all
          </button>
          <button
            onClick={() => {
              onApply({
                categories: selectedCategories,
                followers: selectedFollowers,
                platforms: selectedPlatforms,
                location: selectedLocation,
                featured: featuredOnly,
              })
              setIsOpen(false)
            }}
            className="bg-black dark:bg-white text-white dark:text-black px-5 py-2 rounded-full text-sm"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  )
}
