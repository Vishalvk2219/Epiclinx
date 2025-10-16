import { JobsList } from '@/components/creator/dashboard/JobList'
import ProfileView from '@/components/creator/dashboard/ProfileView'
import Footer from '@/components/Footer'
import React from 'react'

const Page = () => {
    return (
        <div className='min-h-screen px-4'>
            <main className='max-w-7xl mx-auto py-6'>
                <ProfileView value={true} />
                <div className='mt-6'>
                    <JobsList show={false} />
                </div>
            </main>
        </div>
    )
}

export default Page