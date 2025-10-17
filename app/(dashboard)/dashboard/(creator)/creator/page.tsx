

import { NextChapter } from '@/components/creator/dashboard/NextChapter'
import { QuickWins } from '@/components/creator/dashboard/QuickWin'
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

            {/* Footer always at the bottom */}
            {/* <Footer /> */}
        </div>
    )
}

export default Page