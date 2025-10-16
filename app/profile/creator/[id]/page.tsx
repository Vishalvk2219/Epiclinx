"use client"
import { JobsList } from '@/components/creator/dashboard/JobList'
import ProfileView from '@/components/creator/dashboard/ProfileView'
import PublicReviews from '@/components/creator/PublicReviews'
import Footer from '@/components/Footer'
import { ProfileMessage } from '@/components/profile/ProfileMessage'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'

const Page = () => {
  const [activeSection, setActiveSection] = useState<"jobs" | "messages">("jobs")
  return (
    <div className='max-w-7xl mx-auto py-4 max-lg:px-3'>
      <ProfileView value={false} />
      <PublicReviews />
      <div className='mt-6'>
        <div className='flex items-center justify-between mb-6 mt-20'>
          <div>
            <h2 className='text-2xl font-semibold'>{activeSection === "jobs" ? "All Jobs" : "Messages"}</h2>
            <p className='text-xs font-light my-4 -mb-3'>{activeSection === "jobs" ? "200 completed jobs found" : ""}</p>
          </div>

          <div className="flex rounded-full bg-[#3A3A3A] p-1">
            <button
              onClick={() => setActiveSection("jobs")}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition-colors",
                activeSection === "jobs" ? "bg-[#00E5C7] text-[#2A2A2A]" : "text-white hover:text-[#00E5C7]",
              )}
            >
              Jobs
            </button>
            <button
              onClick={() => setActiveSection("messages")}
              className={cn(
                "rounded-full px-4 py-2 text-sm transition-colors",
                activeSection === "messages" ? "bg-[#00E5C7] text-[#2A2A2A]" : "text-white hover:text-[#00E5C7]",
              )}
            >
              Messages
            </button>
          </div>
        </div>

        {
          activeSection === "jobs" ? <JobsList show={false} publicProfile={true} /> : <ProfileMessage />
        }
      </div>
      <div className='mt-10'>
        <Footer />
      </div>
    </div>
  )
}

export default Page