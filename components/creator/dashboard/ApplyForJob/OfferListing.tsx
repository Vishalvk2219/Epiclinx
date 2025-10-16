"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { PiInstagramLogoFill, PiTiktokLogoFill } from "react-icons/pi"
import { FaYoutube } from "react-icons/fa"

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

export function OffersList() {
  const [offers] = useState(mockOffers)

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-400">{offers.length} offers received</div>
      </div>

      <div className="space-y-3">
        {offers.map((offer) => (
          <div key={offer.id} className="flex bg-white/10 justify-between items-center p-3 rounded-full">
            <div className="flex items-center gap-2 ">
              <div className="font-medium">{offer.creator}</div>
              <div className="flex gap-1">
                <div className="w-5 h-5 rounded-full bg-epiclinx-semiteal flex items-center justify-center"><PiInstagramLogoFill className="w-3 h-3 text-black/80" /></div>
                <div className="w-5 h-5 rounded-full bg-epiclinx-semiteal flex items-center justify-center"><PiTiktokLogoFill className="w-3 h-3 text-black/80" /></div>
                <div className="w-5 h-5 rounded-full bg-epiclinx-semiteal flex items-center justify-center"><FaYoutube className="w-3 h-3 text-black/80" /></div>
              </div>
            </div>
            <div className="font-medium">
              <span className="text-gray-100 font-light text-sm">Offer:</span> ${offer.offer.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
