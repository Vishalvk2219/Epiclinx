
import Banner from '@/components/banner'
import ProfileManagement from '@/components/brand/dashboard/ProfileManagement/ProfileManagement'
import Footer from '@/components/Footer'
import React from 'react'

const Page = () => {
    return (
        <div className="flex flex-col min-h-[90vh] mx-3">
            {/* Main content area */}
            <main className="flex-grow py-4 max-md:pb-20">
                <Banner />
                <ProfileManagement />
            </main>
        </div>
    )
}

export default Page