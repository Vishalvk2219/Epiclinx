import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Hero = () => {
    return (
        <>
            <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4 py-4 md:grid-cols-3">
                <div className="rounded-3xl h-[400px] bg-[#adfff7] p-8 text-black col-span-3 md:col-span-2">
                    <button className="rounded-full bg-black px-4 py-2 text-sm font-medium text-[#00e0ca]">
                        Sign up for a 7-day free trial
                    </button>
                    <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
                        Real brands. Real creators.
                        <br />
                        Real Results. Real Easy.
                    </h1>
                    <p className="mt-6">
                        No managers. No hidden cuts. No drama — just freedom to connect and create.
                        <br />
                        Businesses x Creators = Epiclinx
                    </p>
                </div>
                <div className="overflow-hidden rounded-3xl col-span-3 md:col-span-1">
                    <Image
                        src="/hero1.png"
                        alt="Person using phone"
                        width={400}
                        height={430}
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>

            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4  md:grid-cols-2">
                <Link href="/brand" className='hover:opacity-80 transition-all duration-300'>
                    <div className="relative rounded-3xl bg-[#ffffff]/20 p-8 shadow-md">
                        <h2 className="text-2xl font-bold">
                            I'm a Brand
                            <br />
                            looking for Creators
                        </h2>
                        <div className="absolute bottom-5 right-5">
                            <Image src={'X1.svg'} width={80} height={80} alt="X1" />
                        </div>
                    </div>
                </Link>
                <Link href="/creator" className='hover:opacity-80 transition-all duration-300'>
                    <div className="relative rounded-3xl bg-epiclinx-teal p-8 text-white shadow-md">
                        <h2 className="text-2xl font-bold">
                            I'm a Creator
                            <br />
                            looking for Brands
                        </h2>
                        <div className="absolute bottom-5 right-5">
                            <Image src={'X2.svg'} width={80} height={80} alt="X1" />
                        </div>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default Hero