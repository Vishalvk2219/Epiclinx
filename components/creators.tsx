"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Star,
  MapPin,
  Users,
  X,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import FilterSidebar from "./filtersidebar";
import { PiInstagramLogoFill, PiTiktokLogoFill } from "react-icons/pi";
import { FaYoutube } from "react-icons/fa";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { apiFetch, apiPost } from "@/lib/api";
import { IUser } from "@/models/User";

type Creator = {
  id: number;
  name: string;
  image: string;
  rating: string;
  followers: number;
  location: string;
  categories: string[];
  platforms: string[];
  unlocked: boolean;
};

type FilterState = {
  categories: string[];
  followers: string[];
  platforms: string[];
  location: string;
  featured: boolean;
};

export default function SpotlightedCreators({
  bgColor = "bg-white/20",
  textColor = "text-black",
  pagination = false,
}: {
  bgColor?: string;
  textColor?: string;
  pagination?: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [creators, setCreators] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const itemsPerPage = 8;

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    followers: [],
    platforms: [],
    location: "",
    featured: true,
  });

  // const creators: Creator[] = [
  //   {
  //     id: 1,
  //     name: "Courtney Henry",
  //     image: "/insta2.png",
  //     rating: "4,8",
  //     followers: 1344,
  //     location: "New York",
  //     categories: ["Lifestyle"],
  //     platforms: ["instagram", "tiktok"],
  //     unlocked: false,
  //   },
  //   {
  //     id: 2,
  //     name: "Courtney Henry",
  //     image: "/insta2.png",
  //     rating: "4,8",
  //     followers: 1344,
  //     location: "New York",
  //     categories: ["Lifestyle"],
  //     platforms: ["instagram", "tiktok"],
  //     unlocked: false,
  //   },
  //   {
  //     id: 3,
  //     name: "Kathryn Murphy",
  //     image: "/insta3.png",
  //     rating: "5,0",
  //     followers: 12022,
  //     location: "Washington DC",
  //     categories: ["Fashion", "Beauty"],
  //     platforms: ["instagram", "tiktok", "youtube"],
  //     unlocked: true,
  //   },
  //   {
  //     id: 4,
  //     name: "Robert Fox",
  //     image: "/insta4.png",
  //     rating: "5,0",
  //     followers: 2650,
  //     location: "Washington DC",
  //     categories: ["Lifestyle", "Fitness"],
  //     platforms: ["instagram", "tiktok", "youtube"],
  //     unlocked: true,
  //   },
  //   {
  //     id: 5,
  //     name: "Cameron Williamson",
  //     image: "/insta5.png",
  //     rating: "5,0",
  //     followers: 10069,
  //     location: "Washington DC",
  //     categories: ["Travel", "Food"],
  //     platforms: ["instagram", "tiktok", "youtube"],
  //     unlocked: true,
  //   },
  //   {
  //     id: 6,
  //     name: "Courtney Henry",
  //     image: "/insta2.png",
  //     rating: "4,8",
  //     followers: 1344,
  //     location: "New York",
  //     categories: ["Lifestyle"],
  //     platforms: ["instagram", "tiktok"],
  //     unlocked: true,
  //   },
  //   {
  //     id: 7,
  //     name: "Kathryn Murphy",
  //     image: "/insta3.png",
  //     rating: "5,0",
  //     followers: 12022,
  //     location: "Washington DC",
  //     categories: ["Fashion", "Beauty"],
  //     platforms: ["instagram", "tiktok", "youtube"],
  //     unlocked: true,
  //   },
  //   {
  //     id: 8,
  //     name: "Robert Fox",
  //     image: "/insta4.png",
  //     rating: "5,0",
  //     followers: 2650,
  //     location: "Washington DC",
  //     categories: ["Lifestyle", "Fitness"],
  //     platforms: ["instagram", "tiktok", "youtube"],
  //     unlocked: true,
  //   },
  //   {
  //     id: 9,
  //     name: "Cameron Williamson",
  //     image: "/insta5.png",
  //     rating: "5,0",
  //     followers: 10069,
  //     location: "Washington DC",
  //     categories: ["Travel", "Food"],
  //     platforms: ["instagram", "tiktok", "youtube"],
  //     unlocked: true,
  //   },
  //   {
  //     id: 10,
  //     name: "Courtney Henry",
  //     image: "/insta2.png",
  //     rating: "4,8",
  //     followers: 1344,
  //     location: "New York",
  //     categories: ["Lifestyle"],
  //     platforms: ["instagram", "tiktok"],
  //     unlocked: false,
  //   },
  //   {
  //     id: 11,
  //     name: "Courtney Henry",
  //     image: "/insta2.png",
  //     rating: "4,8",
  //     followers: 1344,
  //     location: "New York",
  //     categories: ["Lifestyle"],
  //     platforms: ["instagram", "tiktok"],
  //     unlocked: false,
  //   },
  //   {
  //     id: 12,
  //     name: "Kathryn Murphy",
  //     image: "/insta3.png",
  //     rating: "5,0",
  //     followers: 12022,
  //     location: "Washington DC",
  //     categories: ["Fashion", "Beauty"],
  //     platforms: ["instagram", "tiktok", "youtube"],
  //     unlocked: true,
  //   },
  //   {
  //     id: 13,
  //     name: "Robert Fox",
  //     image: "/insta4.png",
  //     rating: "5,0",
  //     followers: 2650,
  //     location: "Washington DC",
  //     categories: ["Lifestyle", "Fitness"],
  //     platforms: ["instagram", "tiktok", "youtube"],
  //     unlocked: true,
  //   },
  //   {
  //     id: 14,
  //     name: "Cameron Williamson",
  //     image: "/insta5.png",
  //     rating: "5,0",
  //     followers: 10069,
  //     location: "Washington DC",
  //     categories: ["Travel", "Food"],
  //     platforms: ["instagram", "tiktok", "youtube"],
  //     unlocked: true,
  //   },
  //   {
  //     id: 15,
  //     name: "Courtney Henry",
  //     image: "/insta2.png",
  //     rating: "4,8",
  //     followers: 1344,
  //     location: "New York",
  //     categories: ["Lifestyle"],
  //     platforms: ["instagram", "tiktok"],
  //     unlocked: true,
  //   },
  //   {
  //     id: 16,
  //     name: "Kathryn Murphy",
  //     image: "/insta3.png",
  //     rating: "5,0",
  //     followers: 12022,
  //     location: "Washington DC",
  //     categories: ["Fashion", "Beauty"],
  //     platforms: ["instagram", "tiktok", "youtube"],
  //     unlocked: true,
  //   },
  //   {
  //     id: 17,
  //     name: "Robert Fox",
  //     image: "/insta4.png",
  //     rating: "5,0",
  //     followers: 2650,
  //     location: "Washington DC",
  //     categories: ["Lifestyle", "Fitness"],
  //     platforms: ["instagram", "tiktok", "youtube"],
  //     unlocked: true,
  //   },
  //   {
  //     id: 18,
  //     name: "Cameron Williamson",
  //     image: "/insta5.png",
  //     rating: "5,0",
  //     followers: 10069,
  //     location: "Washington DC",
  //     categories: ["Travel", "Food"],
  //     platforms: ["instagram", "tiktok", "youtube"],
  //     unlocked: true,
  //   },
  // ]

  const allCreators = async () => {
    try {
      const data = await apiFetch("/creator");
      const requiredCreatorsField = (data?.creators || []).map(
        (creator: IUser) => ({
          id: creator._id || creator.id,
          name: `${creator.firstName} ${creator.lastName}`,
          image: creator.profileImageUrl,
          rating: creator.rating || "",
          followers: creator.followers || 1000,
          location: creator.location,
          categories: creator.categories || [],
          platforms: [
            creator?.instagram && "instagram",
            creator?.facebook && "facebook",
            creator?.tiktok && "tiktok",
          ].filter(Boolean),
          instagram: creator.instagram,
          facebook: creator.facebook,
          tiktok: creator.tiktok,
          unlocked: true,
        })
      );
      setCreators(requiredCreatorsField);
    } catch (error: any) {
      console.log("Failed to fetch creators...", error);
      setCreators([]);
    }
  };

  useEffect(() => {
    allCreators();
  }, []);

  // Filter creators based on search and filters
  const filteredCreators = creators.filter((creator) => {
    // Search filter
    if (
      searchTerm &&
      !creator.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !creator.categories.some((cat) =>
        cat.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      !creator.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (
      filters.categories.length > 0 &&
      !creator.categories.some((cat) => filters.categories.includes(cat))
    ) {
      return false;
    }

    // Follower size filter (simplified implementation)
    if (filters.followers.length > 0) {
      const followerCount = creator.followers;
      let matchesFollowerSize = false;

      for (const range of filters.followers) {
        if (
          range === "1000 to 10,000" &&
          followerCount >= 1000 &&
          followerCount <= 10000
        ) {
          matchesFollowerSize = true;
          break;
        } else if (
          range === "10,000 to 50,000" &&
          followerCount > 10000 &&
          followerCount <= 50000
        ) {
          matchesFollowerSize = true;
          break;
        } else if (
          range === "50,000 to 250,000" &&
          followerCount > 50000 &&
          followerCount <= 250000
        ) {
          matchesFollowerSize = true;
          break;
        } else if (range === "250,000+" && followerCount > 250000) {
          matchesFollowerSize = true;
          break;
        }
      }

      if (!matchesFollowerSize) {
        return false;
      }
    }

    if (
      filters.platforms.length > 0 &&
      !creator.platforms.some((p) =>
        filters.platforms.some((fp) => fp.toLowerCase() === p)
      )
    ) {
      return false;
    }
    // Location filter
    if (
      filters.location &&
      creator.location.toLowerCase() !== filters.location.toLowerCase()
    ) {
      return false;
    }

    // Featured filter (assuming unlocked means featured)
    if (filters.featured && !creator.unlocked) {
      return false;
    }

    return true;
  });

  // Get active filter labels for display
  const getActiveFilterLabels = () => {
    const activeLabels: string[] = [];

    filters.categories.forEach((cat) => activeLabels.push(cat));
    filters.followers.forEach((follower) => activeLabels.push(follower));
    filters.platforms.forEach((platform) => activeLabels.push(platform));
    if (filters.location) activeLabels.push(filters.location);
    if (searchTerm) activeLabels.push(`Search: ${searchTerm}`);

    return activeLabels;
  };

  const activeFilterLabels = getActiveFilterLabels();

  // Remove a specific filter
  const removeFilter = (filter: string) => {
    if (filter.startsWith("Search:")) {
      setSearchTerm("");
    } else if (filters.categories.includes(filter)) {
      setFilters({
        ...filters,
        categories: filters.categories.filter((c) => c !== filter),
      });
    } else if (filters.followers.includes(filter)) {
      setFilters({
        ...filters,
        followers: filters.followers.filter((f) => f !== filter),
      });
    } else if (filters.platforms.includes(filter)) {
      setFilters({
        ...filters,
        platforms: filters.platforms.filter((p) => p !== filter),
      });
    } else if (filter === filters.location) {
      setFilters({ ...filters, location: "" });
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredCreators.length / itemsPerPage);
  const paginatedCreators = filteredCreators.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="mx-auto max-w-7xl py-12 text-black">
      <div className="px-0 py-8">
        {pagination ? (
          <h2 className="mb-8 text-start text-3xl font-bold text-white">
            Creators
          </h2>
        ) : (
          <h2 className="mb-8 text-center text-3xl font-bold text-black">
            Spotlighted Creators in our 1,000+ strong network
          </h2>
        )}

        <div className="mb-6 flex items-center gap-3">
          <FilterSidebar
            openSidebar={()=>setSidebarOpen(true)}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            categories={filters.categories}
            followers={filters.followers}
            platforms={filters.platforms}
            location={filters.location}
            featured={filters.featured}
            onChange={(newFilters) => setFilters(newFilters)}
          />

          <div className="relative flex-1">
            <Search
              className={
                pagination
                  ? "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-100"
                  : "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700"
              }
            />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when search changes
              }}
              className={`w-full rounded-full py-2 pl-10 pr-4 text-sm ${
                pagination
                  ? "bg-transparent border border-gray-400 text-white"
                  : "border border-gray-700 text-black"
              }`}
            />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {activeFilterLabels.map((filter) => (
            <span
              key={filter}
              className="flex cursor-pointer items-center gap-1 rounded-full bg-white px-3 py-1 text-xs"
              onClick={() => removeFilter(filter)}
            >
              {filter}
              <X className="h-4 w-4" />
            </span>
          ))}
        </div>
        <span className="text-white/90 text-xs">{`${filteredCreators?.length} creators found`}</span>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(pagination ? paginatedCreators : filteredCreators.slice(0, 7)).map(
            (creator) => (
              <div
                key={creator.id}
                className={`overflow-hidden rounded-3xl border border-gray-800 ${bgColor}`}
              >
                <div className="relative h-[300px] w-full overflow-hidden">
                  <Image
                    src={creator.image || "/placeholder.svg"}
                    alt={creator.name}
                    fill
                    className="object-cover center rounded-3xl -mt-1"
                  />
                  <div className="absolute bottom-5 left-5 flex items-center gap-1 rounded-full text-white">
                    <Star className="h-7 w-7 fill-[#ffffff] text-[#ffffff]" />
                    <span className="text-lg font-light">{creator.rating}</span>
                  </div>
                  <div className="absolute bottom-5 right-5 flex items-center gap-2">
                    {creator.platforms.includes("instagram") && (
                      <a
                        href={`${creator.instagram}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <PiInstagramLogoFill className="w-7 h-7 text-[#ffffff]" />
                      </a>
                    )}
                    {creator.platforms.includes("tiktok") && (
                      <a
                        href={`${creator.tiktok}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <PiTiktokLogoFill className="w-7 h-7 text-[#ffffff]" />
                      </a>
                    )}
                    {creator.platforms.includes("youtube") && (
                      <a
                        href={`https://www.youtube.com/c/${creator.name}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FaYoutube className="w-7 h-7 text-[#ffffff]" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {creator.categories.map((category) => (
                      <span
                        key={category}
                        className={`rounded-full px-3 py-2 text-xs font-medium ${
                          category === "Lifestyle"
                            ? "bg-epiclinx-semiteal text-black"
                            : "bg-epiclinx-semiteal text-black"
                        }`}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <h3 className={`mb-3 text-lg font-bold ${textColor}`}>
                    {creator.name}
                  </h3>
                  <div
                    className={`mb-1 flex items-center gap-2 text-sm ${textColor}`}
                  >
                    <Users className="h-4 w-4" />
                    <span>{creator.followers.toLocaleString()} followers</span>
                  </div>
                  <div
                    className={`mb-4 flex items-center gap-2 text-sm ${textColor}`}
                  >
                    <MapPin className="h-4 w-4" />
                    <span>{creator.location}</span>
                  </div>

                  <Link
                    href={`/profile/creator/${creator.id}`}
                    className={`block w-full rounded-full py-3 btn-hover mb-5 text-center text-sm font-medium ${
                      creator.unlocked
                        ? "bg-[#00e0ca] text-black"
                        : "bg-[#042c30] text-white"
                    }`}
                    onClick={(e) => {
                      if (!creator.unlocked) {
                        e.preventDefault();
                      }
                    }}
                  >
                    {creator.unlocked ? "Link me with them" : "Unlock"}
                  </Link>
                </div>
              </div>
            )
          )}
        </div>

        {/* Pagination - Updated to match the image */}
        {pagination && (
          <div className="flex justify-center items-center gap-2 !my-10">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center text-white font-light text-xs disabled:opacity-50 px-2"
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>

            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              // Show first 3 pages
              const pageNum = i + 1;

              return (
                <button
                  key={i}
                  onClick={() => goToPage(pageNum)}
                  className={cn(
                    "w-6 h-6 flex items-center justify-center rounded-md",
                    currentPage === pageNum
                      ? "bg-epiclinx-teal text-[#2A2A2A]"
                      : "text-xs text-white"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 3 && (
              <>
                <span className="text-white">...</span>

                {/* Show second last page */}
                {totalPages > 4 && (
                  <button
                    onClick={() => goToPage(totalPages - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-sm bg-epiclinx-teal text-white"
                  >
                    {totalPages - 1}
                  </button>
                )}

                {/* Show last page */}
                <button
                  onClick={() => goToPage(totalPages)}
                  className="w-8 h-8 flex items-center justify-center rounded-sm bg-epiclinx-teal text-white"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center text-white font-light text-xs disabled:opacity-50 px-2"
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
