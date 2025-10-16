
import React from 'react'
import Footer from '@/components/Footer'
import Newsletter from '@/components/Newsletter'
import Banner from '@/components/creator/banner'
import { MultiStepForm } from '@/components/creator/become-creator/BrandSetupForm'

const Page = () => {
    return (
        <div className="min-h-screen text-white mx-3 py-4">
            <Banner />
            <MultiStepForm />
            <Newsletter />
            <Footer />
        </div>
    )
}

export default Page