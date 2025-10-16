import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Cta = () => {
  return (
    <div className="mx-auto max-w-7xl py-20">
      <div className="relative flex flex-col md:flex-row overflow-hidden rounded-3xl bg-[#00e0ca] p-8 text-black">
        
        {/* Text Section */}
        <div className="flex-1 z-10">
          <h2 className="mb-4 text-3xl font-bold">You don't need an agent. You need control.</h2>
          <p className="mb-6">
            This is how it should be. Simple terms, secure payments and a platform that respects your value.
            <br />
            You earn, we handle the boring stuff.
          </p>
          <Link href={"/creator"}>
            <button className="rounded-full max-md:flex bg-black px-6 py-3 font-medium text-white">Join as a Creator</button>
          </Link>
        </div>

        {/* Image Section */}
        <div className="mt-8 md:mt-0 md:absolute md:bottom-0 md:right-8 max-md:flex max-md:justify-end">
          <Image
            src="/Group17.png"
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

export default Cta
