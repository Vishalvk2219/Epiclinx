import { JobsList } from '@/components/brand/dashboard/JobList'
import ProfileView from '@/components/brand/dashboard/ProfileView'
import React from 'react'

const Page = () => {
    return (
        <div className='min-h-screen px-4'>
            <main className='max-w-7xl mx-auto py-6'>
                <ProfileView />
                <div className='mt-6'>
                    <JobsList />
                </div>
            </main>
        </div>
    )
}

export default Page