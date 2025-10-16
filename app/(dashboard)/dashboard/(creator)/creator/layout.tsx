import Navbar from '@/components/creator/dashboard/Navbar'
import Footer from '@/components/Footer' // Make sure to import Footer
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default layout
