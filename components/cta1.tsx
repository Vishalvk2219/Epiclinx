import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Cta1 = () => {
  return (
    <div className="mx-auto max-w-7xl pt-20">
      <div className="relative flex flex-col md:flex-row overflow-hidden rounded-3xl bg-[#313131] p-8 text-white">
        
        {/* Text Section */}
        <div className="flex-1 z-10">
          <h2 className="mb-4 text-3xl font-bold">You don't need an agent. You need control.</h2>
          <p className="mb-6">
            This is how it should be. Simple terms, secure payments and a platform that respects your value.
            <br />
            You earn, we handle the boring stuff.
          </p>
          <Link href={"/brand/create-a-brand"}>
            <button className="rounded-full max-md:flex bg-[#00e0ca] px-6 py-3 font-medium text-black btn-hover">Create a brand account</button>
          </Link>
        </div>

        {/* Image Section */}
        <div className="mt-8 md:mt-0 md:absolute md:bottom-0 md:right-8 max-md:flex max-md:justify-end">
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

export default Cta1
