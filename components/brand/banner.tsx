import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BrandBanner = () => {
  return (
    <div className="mx-auto max-w-7xl pt-20">
      <div className="relative overflow-hidden rounded-3xl bg-[#313131] p-8 text-white mx-4 min-h-[300px] flex items-center justify-center">
        
        {/* Text Section */}
        <div className="z-10 text-center max-w-3xl">
          <h2 className="mb-4 text-3xl font-bold">
            Post your job to 1,000+ ready creators. Watch offers roll in — you pick the perfect match.
          </h2>
          <p className="mb-6 md:max-w-xl mx-auto font-light my-10">
            Your message deserves more than getting lost in DMs. Post a job. Get seen. Build something real.
          </p>
          <Link href="/brand/post-a-job" className="rounded-full bg-epiclinx-teal px-6 py-3 font-medium text-black btn-hover">
            Post a Public Job
          </Link>
        </div>

        {/* Image Section */}
        <div className="hidden md:block absolute bottom-0 right-8">
          <Image
            src="/X2.png"
            alt="cta"
            width={180}
            height={180}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default BrandBanner
