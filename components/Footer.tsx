import Image from 'next/image'
import React from 'react'

const Footer = () => {
    return (
        <>

            {/* Footer */}
            <footer className="max-lg:px-3">
                <div className="mx-auto flex max-w-7xl  py-6 border-t border-gray-700 max-md:flex-col max-md:gap-3 md:items-center justify-between">
                    <div className="flex items-center">
                        <span className="text-xl flex items-center gap-2 font-bold text-white">
                            <Image src="/logo.svg" alt="logo" width={20} height={20} />
                            <span>Epiclinx</span>
                        </span>
                    </div>
                    <div className="text-xs text-gray-400">© 2025 Epiclinx. All rights reserved.</div>
                </div>
            </footer>
        </>
    )
}

export default Footer