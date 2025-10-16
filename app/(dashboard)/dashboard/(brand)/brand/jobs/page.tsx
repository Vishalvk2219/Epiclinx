'use client'

import { JobsList } from "@/components/brand/dashboard/JobList"; 
import { useSearchParams } from 'next/navigation'

export default function Jobs() {
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')
  console.log(tab)
  return (
    <div className="min-h-screen px-4">
      <main className="max-w-7xl mx-auto py-6">
        <JobsList tab={tab || "jobs"}/>
      </main>
    </div>
  )
}
