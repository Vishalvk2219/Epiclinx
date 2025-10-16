import Image from 'next/image'
import React from 'react'

const Banner = () => {
    return (
        <div className="max-w-7xl mx-auto relative rounded-3xl bg-epiclinx-semiteal p-6 md:p-10 mx-3">
            <h2 className="text-2xl text-black font-bold">
                I'm a Creator
            </h2>
            <span className="mt-2 block text-xs text-black">
                No managers. No hidden cuts. No dramas.
                <br />
            </span>
            <span className='!mt-5 block text-xs text-black'>
                Businesses × Creators = Epiclinx.
            </span>
            <div className="absolute bottom-0 top-1/3 right-5">
                <Image src={'/X2.svg'} width={80} height={80} alt="I am a creator" />
            </div>
        </div>
    )
}

export default Banner