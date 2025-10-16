"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { PiInstagramLogoFill, PiTiktokLogoFill } from "react-icons/pi"
import { FaYoutube } from "react-icons/fa"
import JobFilter, { JobFilterValues } from "../BrowseJobs/JobFilter"
import { Search } from "lucide-react"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"

// Mock data for offers
const mockOffers = [
    { id: 1, creator: "Creator #1", offer: 2500 },
    { id: 2, creator: "Creator #2", offer: 3000 },
    { id: 3, creator: "Creator #3", offer: 2200 },
    { id: 4, creator: "Creator #4", offer: 3200 },
    { id: 5, creator: "Creator #5", offer: 2900 },
    { id: 6, creator: "Creator #6", offer: 3100 },
    { id: 7, creator: "Creator #7", offer: 2800 },
    { id: 8, creator: "Creator #8", offer: 3300 },
]


export function BidssList() {
    const [offers] = useState(mockOffers)
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState<JobFilterValues>({
        sort: "Most Recent",
        location: "",
        niches: [],
        platforms: ["ALL"] ,
        deliverables: [],
    })

    const handleApplyFilters = (newFilters: JobFilterValues) => {
        setFilters(newFilters)
        setCurrentPage(1) // Reset to first page when filters change
    }

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8
    const currentJobs = offers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return (
        <div className="">
            <div className="flex items-center justify-between my-5">
                <h2 className="text-2xl font-bold">Bids Portal</h2>
            </div>
            <div className="flex items-center  gap-3 w-full">
                <JobFilter onApply={handleApplyFilters} />
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-100" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-full py-2 pl-10 w-full pt-3 pr-4 text-sm bg-transparent border border-gray-400 text-white"
                    />
                </div>
            </div>
            <div className="flex justify-between items-center mb-4 mt-4">
                <div className="text-sm text-gray-400">{offers.length} offers received</div>
            </div>

            <div className="space-y-3">
                {offers.map((offer) => (
                    <div key={offer.id} className="flex max-md:flex-col max-md:gap-5 bg-white/10 justify-between md:items-center p-5 rounded-3xl">
                        <div className="flex items-start gap-2 ">
                            <div className="flex flex-col gap-2">
                                <div className="font-medium">{offer.creator}</div>
                                <span className="text-epiclinx-teal max-md:hidden font-light text-xs ">Job AD: #{offer.id}</span>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-5 h-5 rounded-full bg-epiclinx-semiteal flex items-center justify-center"><PiInstagramLogoFill className="w-3 h-3 text-black/80" /></div>
                                <div className="w-5 h-5 rounded-full bg-epiclinx-semiteal flex items-center justify-center"><PiTiktokLogoFill className="w-3 h-3 text-black/80" /></div>
                                <div className="w-5 h-5 rounded-full bg-epiclinx-semiteal flex items-center justify-center"><FaYoutube className="w-3 h-3 text-black/80" /></div>
                            </div>
                        </div>

                        <div className="font-medium flex gap-10 md:px-5 items-center">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-start gap-2">
                                    <Image src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZWT5Z_gRV6MyfV5mYSEHX4eXXSa1-QH1d3Q&s"} alt="Brand Logo" width={20} height={20} className="rounded-full" />
                                    <div className="flex flex-col gap-1">
                                        <span className="text-epiclinx-teal font-light text-xs">Brand Name</span>
                                        <span className="text-gray-100 font-light text-xs">Brand</span>
                                    </div>
                                </div>

                            </div>
                            <Separator orientation="vertical" className="h-10 !bg-white/40" />
                            <div className="flex items-center flex-col gap-2">
                                <span className="text-epiclinx-teal font-medium text-sm">
                                    ${offer.offer.toLocaleString()}
                                </span>
                                <span className="text-gray-100 font-light text-xs">Bid</span>
                            </div>

                        </div>

                        <span className="text-epiclinx-teal md:hidden font-light text-xs ">Job AD: #{offer.id}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
