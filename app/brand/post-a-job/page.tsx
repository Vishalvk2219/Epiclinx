import React from 'react'
import Footer from '@/components/Footer'
import Newsletter from '@/components/Newsletter'
import JobPostingForm from '@/components/brand/JobPosting/PostAJob'

const Page = () => {
    return (
        <div className="min-h-screen text-white mx-3 py-4">
            <JobPostingForm />
            <Newsletter />
            <Footer />
        </div>
    )
}

export default Page