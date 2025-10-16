import Image from 'next/image'
import React from 'react'

const Brand = () => {

    const slider = [
        { src: '/nike.png', alt: 'Nike' },
        { src: '/starbucks.png', alt: 'Starbucks' },
        { src: '/webflow.png', alt: 'Webflow' },
        { src: '/nike.png', alt: 'Nike' },
        { src: '/starbucks.png', alt: 'Starbucks' },
        { src: '/webflow.png', alt: 'Webflow' },
    ]
    return (
        <div className="mx-auto max-w-7xl py-12">
            <p className="mb-10 text-center text-lg font-medium text-white">
                <span className="px-2 py-1 rounded text-white">1,000+ businesses and creators scale faster with Epiclinx</span>
            </p>

            {/* Logo Section - scrollable on small screens */}
            <div className="overflow-hidden w-full py-6">
                <div className="scroll-marquee">
                    <div className="flex items-center gap-12 md:gap-[120px] px-2">
                        {slider.map((item, index) => (
                            <Image key={index} src={item.src} alt={item.alt} width={80} height={40} />
                        ))}
                        {slider.map((item, index) => (
                            <Image key={index} src={item.src} alt={item.alt} width={80} height={40} />
                        ))}
                    </div>
                </div>
            </div>


            {/* Stats Grid */}



            <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-0 lg:gap-4">
                {/* Left Side */}
                <div className="grid sm:grid-cols-2 gap-4 md:col-span-2 lg:gap-4">
                    {[
                        { number: '1,200', label: 'Businesses finding their perfect match' },
                        { number: '4,000', label: 'Jobs posted by growing brands' },
                        { number: '5,400', label: 'Creators ready to collab' },
                        { number: '6,111', label: 'Projects completed and counting' },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="rounded-3xl bg-[#ffffff]/20 p-6 text-white"
                        >
                            <div className="flex flex-col md:gap-2 md:flex-row md:items-center md:justify-between h-full">
                                <h3 className="text-6xl max-md:text-5xl font-bold mb-2 md:mb-0">{item.number}</h3>
                                <p className="text-lg max-md:text-sm font-light md:text-right">{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Side */}
                <div className="rounded-3xl bg-[#ffffff]/20 mt-4 md:mt-4 lg:mt-0 p-6 text-white md:col-span-1 flex flex-col justify-between md:flex-row lg:flex-col w-full min-h-full">
                    <h3 className="text-6xl max-md:text-5xl font-bold">4,400</h3>
                    <p className="text-lg max-md:text-sm font-light">Epiclinx created</p>
                </div>
            </div>



        </div>
    )
}

export default Brand
