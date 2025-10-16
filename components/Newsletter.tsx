import React from 'react'

const Newsletter = () => {
    return (
        <>
            {/* Newsletter Section */}
            <div className="mx-auto max-w-7xl md:py-20 pb-20">
                <div className="rounded-3xl bg-[#adfff7] p-8 text-black py-16">
                    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                        <div className="max-w-md">
                            <h3 className="text-3xl font-bold">Join our newsletter</h3>
                            <p className="mt-2 text-xs">
                                And you'll get a link to some epic deals and opportunities sent straight to your inbox.
                            </p>
                        </div>
                        <div className="w-full max-w-md">
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full rounded-full border bg-white border-gray-700 font-light text-black px-4 py-2 text-sm"
                                />
                                <button className="rounded-full bg-[#00e0ca] btn-hover px-4 py-2 text-sm font-medium text-black">
                                    Subscribe
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-gray-900">
                                By submitting you agree to our{' '}
                                <a href="#" className="underline">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Newsletter