'use client'

import { useRef } from 'react'
import {
  ShieldCheck,
  Handshake,
  MessageSquare,
  ListChecks,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'

const features = [
  {
    icon: ShieldCheck,
    title: 'Protected Payments',
    description: 'Get paid, no delays — your earnings are secured until the job is done.',
  },
  {
    icon: Handshake,
    title: 'Real Brand Connections',
    description: 'Work directly with verified businesses that actually value your content.',
  },
  {
    icon: MessageSquare,
    title: 'Direct Messaging',
    description: 'No DMs. No gatekeepers. You’re in control of the conversation.',
  },
  {
    icon: ListChecks,
    title: 'Job Matching That Makes Sense',
    description: 'See jobs based on your platform, audience size, and niche.',
  },
  {
    icon: BadgeCheck,
    title: 'No Managers. No Gatekeepers.',
    description: 'You drive the deal. You build the relationship. We just make it easier.',
  },
]

export default function WhyJoinEpiclinx() {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-10 text-white text-center">
      <h2 className="text-2xl font-bold">Why Join Epiclinx</h2>
      <p className="text-gray-400 mt-2 mb-6">
        Because great creators shouldn’t chase brands — they should choose them.
      </p>

      {/* Cards section */}
      <div className="relative">
        <div
          ref={scrollRef}
          className={`
            flex flex-nowrap overflow-x-auto hide-scrollbar gap-4 px-2
            sm:flex-nowrap
            md:flex-wrap md:justify-center md:overflow-x-visible md:gap-6
            lg:flex-nowrap lg:justify-between lg:overflow-visible
          `}
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`
                bg-epiclinx-semiteal rounded-3xl p-6 flex-shrink-0
                w-[80%] sm:w-[60%]
                md:w-[30%] md:mb-6
                lg:w-[18%]
              `}
            >
              <div className="bg-teal-600 text-white w-fit p-2 rounded-md mb-3">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-black font-bold text-base mb-2">{feature.title}</h3>
              <p className="text-black text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Scroll buttons - below cards on mobile only */}
        <div className="flex justify-end gap-4 mt-4 mr-2 md:hidden">
          <button
            onClick={() => scroll('left')}
            className="bg-epiclinx-teal p-2 rounded-full text-white shadow-md"
          >
            <ArrowLeft className="w-6 h-6 text-black" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="bg-epiclinx-teal p-2 rounded-full text-white shadow-md"
          >
            <ArrowRight className="w-6 h-6 text-black" />
          </button>
        </div>
      </div>
    </div>
  )
}
