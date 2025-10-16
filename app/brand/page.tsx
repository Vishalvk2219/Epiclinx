"use client"
import Banner from '@/components/banner'
import Brand from '@/components/brand'
import ImageSection from '@/components/brand/image-section'
import Testimonials from "@/components/testimonials"
import Pricing from '@/components/brand/pricing'
import React from 'react'
import SpotlightedCreators from '@/components/creators'
import BrandBanner from '@/components/brand/banner'
import FAQs from '@/components/FAQs'
import Footer from '@/components/Footer'
import Newsletter from '@/components/Newsletter'

const Page = () => {
    return (
        <div className="min-h-screen text-white mx-3 py-4">
            <div className=''>
                <Banner />
                <ImageSection />
                <Brand />
            </div>

            <div className='bg-white mx-auto'>
                <Pricing />
            </div>

            <div className='md:py-24 pb-10 '>
                <Testimonials />
            </div>

            <div className='bg-white mx-auto pb-16'>
                <BrandBanner />
            </div>

            <div className="bg-epiclinx-lightteal">
                <SpotlightedCreators />
            </div>

            <FAQs />
            <Newsletter />
            <Footer />
        </div>
    )
}

export default Page