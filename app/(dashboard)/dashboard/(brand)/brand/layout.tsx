import Navbar from '@/components/brand/dashboard/Navbar'
import Footer from '@/components/Footer'
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
