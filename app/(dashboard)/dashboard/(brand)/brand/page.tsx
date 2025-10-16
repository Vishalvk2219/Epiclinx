
import { NextChapter } from '@/components/brand/dashboard/NextChapter'
import { QuickWins } from '@/components/brand/dashboard/QuickWin'
import Footer from '@/components/Footer'
import React from 'react'

const Page = () => {
    return (
        <div className="flex flex-col min-h-[90vh] mx-3">
            {/* Main content area */}
            <main className="flex-grow max-w-7xl mx-auto py-4 max-md:pb-20">
                <NextChapter />
                <QuickWins />
            </main>

        </div>
    )
}

export default Page