"use client"

import CampaignCard from '@/components/brand/dashboard/CampaignCard'
import InfluencerList from '@/components/brand/dashboard/InfluencerList'
import Footer from "@/components/Footer";
import { useParams } from 'next/navigation';
import React from 'react'

const Page = () => {
    const params = useParams()
    const id = params?.id as string
    return (
        <div className="min-h-screen px-4">
            <main className="max-w-7xl mx-auto py-6">
                <CampaignCard />
                <InfluencerList jobId={id}/>
            </main>
        </div>
    )
}

export default Page

