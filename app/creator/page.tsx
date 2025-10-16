"use client"

import Testimonials from "@/components/testimonials"
import Pricing from '@/components/creator/pricing'
import React from 'react'
import SpotlightedCreators from '@/components/creators'
import FAQs from '@/components/FAQs'
import Footer from '@/components/Footer'
import Newsletter from '@/components/Newsletter'
import Banner from '@/components/creator/banner'
import ImageSection from '@/components/creator/image-section'
import Numbers from "@/components/creator/numbers"
import WhyJoinEpiclinx from "@/components/creator/WhyJoinEpicLinx"

const Page = () => {
    return (
        <div className="min-h-screen text-white mx-3 py-4">
            <div className=''>
                <Banner />
                <ImageSection />
                <Numbers />
            </div>

            <div className='bg-white mx-auto'>
                <Pricing />
            </div>

            <div className='md:py-24 pb-10 '>
                <Testimonials />
            </div>

            <WhyJoinEpiclinx />

            <FAQs />
            <Newsletter />
            <Footer />
        </div>
    )
}

export default Page