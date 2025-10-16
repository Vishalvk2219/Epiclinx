'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React, { useRef } from 'react'

const creators = [
  { src: '/insta1.png', alt: 'Creator 1' },
  { src: '/insta6.png', alt: 'Creator 2' },
  { src: '/insta7.png', alt: 'Creator 3' },
  { src: '/insta1.png', alt: 'Creator 4' },
]

const EpicContentSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 270
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="mx-auto bg-white max-w-7xl py-28 relative">
      <h2 className="text-4xl mx-auto text-black text-center md:max-w-md font-bold mb-2">
        Some of the epic content created through Epiclinx
      </h2>
      <p className="text-center text-gray-500 mx-auto mb-8">
        Your next campaign starts here. Let’s link you up.
      </p>

      {/* Cards container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto md:grid md:grid-cols-4 md:gap-6 mt-20 scroll-smooth hide-scrollbar"
      >
        {creators.map((creator, idx) => (
          <div
            key={idx}
            className="min-w-[250px] md:min-w-0 flex flex-col rounded-3xl overflow-hidden gap-4 shadow-sm bg-white"
          >
            <div>
              <Image
                src={creator.src}
                alt={creator.alt}
                width={500}
                height={500}
                className="object-cover"
              />
            </div>
            <div>
              <button className="w-full btn-hover rounded-full bg-[#00e0ca] px-4 py-3 font-medium text-black">
                See the results
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Left/Right Scroll Buttons */}
      <div className="md:hidden flex justify-end gap-4 mt-4 pr-1 absolute right-3 bottom-8 z-10">
        <button
          onClick={() => scroll('left')}
          className="bg-[#00e0ca] text-black p-2 rounded-full shadow transition-transform hover:scale-110 hover:bg-[#00c7b5]"
        >
          <ArrowLeft />
        </button>
        <button
          onClick={() => scroll('right')}
          className="bg-[#00e0ca] text-black p-2 rounded-full shadow transition-transform hover:scale-110 hover:bg-[#00c7b5]"
        >
          <ArrowRight />
        </button>
      </div>
    </section>
  )
}

export default EpicContentSection
