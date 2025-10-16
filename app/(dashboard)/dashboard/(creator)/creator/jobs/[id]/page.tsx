import CampaignCard from '@/components/brand/dashboard/CampaignCard'
import InfluencerList from '@/components/brand/dashboard/InfluencerList'
import Footer from "@/components/Footer";
import React from 'react'

const Page = () => {
    return (
        <div className="min-h-screen px-4">
            <main className="max-w-7xl mx-auto py-6">
                <CampaignCard />
                <InfluencerList />
            </main>
        </div>
    )
}

export default Page

