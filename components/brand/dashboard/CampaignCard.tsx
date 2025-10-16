import { Briefcase, Calendar, DollarSign, Instagram, TwitterIcon as TikTok, Users, Youtube } from "lucide-react"
import Image from "next/image"
import { FaYoutube } from "react-icons/fa"
import { PiInstagramLogoFill, PiTiktokLogoFill } from "react-icons/pi"

export default function CampaignCard() {
    return (
        <div className="bg-epiclinx-semiteal text-black rounded-3xl p-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="flex-shrink-0 max-md:hidden bg-white rounded-full p-2 w-24 h-24 flex items-center justify-center">
                    <Image
                        src="https://1000logos.net/wp-content/uploads/2017/02/Hennes-logo.jpg"
                        alt="H&M Logo"
                        width={100}
                        height={100}
                        className="object-contain"
                    />
                </div>
                <div className="flex items-center justify-between gap-2 w-full md:hidden">
                    <div className="flex-shrink-0  bg-white rounded-full p-2 w-16 h-16 flex items-center justify-center">
                        <Image
                            src="https://1000logos.net/wp-content/uploads/2017/02/Hennes-logo.jpg"
                            alt="H&M Logo"
                            width={50}
                            height={50}
                            className="object-contain"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="bg-[#D8E6F6] text-black/80 text-xs border border-blue-500 font-semibold px-2 py-1 rounded-md">Live</span>
                        <span className="font-bold text-xl">$3,000</span>
                    </div>
                </div>
                <div className="flex-grow space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex md:items-center max-md:flex-col gap-4">
                            <h2 className="text-xl font-bold">H&M – Spring Launch – TikTok – #AD204</h2>
                            {/* Row 3: Platform logos */}
                            <div className="flex space-x-2">
                                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                                    <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="w-5 h-5 text-black/80">
                                        <PiInstagramLogoFill className="w-5 h-5 text-black/80" />
                                    </a>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                                    <a href="https://www.tiktok.com" target="_blank" rel="noreferrer" className="w-5 h-5 text-black/80">
                                        <PiTiktokLogoFill className="w-5 h-5 text-black/80" />
                                    </a>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                                    <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="w-5 h-5 text-black/80">
                                        <FaYoutube className="w-5 h-5 text-black/80" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 max-md:hidden">
                            <span className="bg-[#D8E6F6] text-black/80 text-xs border border-blue-500 font-semibold px-2 py-1 rounded-md">Live</span>
                            <span className="font-bold text-xl">$3,000</span>
                        </div>
                    </div>
                    <p className="text-sm !my-4">
                        We're launching our fresh Spring Collection and looking for creators to help us bring it to life! We need
                        short, vibrant TikTok videos showing off your favorite Spring outfits – energy, personality, and creativity
                        are a must.
                    </p>
                    <div className="flex flex-wrap max-md:flex-col gap-6 mt-2 text-sm !my-5">
                        <div className="flex items-center gap-1">
                            <Users className="w-5 h-5 text-black/80" />
                            <span>Nano (1,000 - 10,000 followers)</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Briefcase className="w-5 h-5 text-black/80" />
                            <span>UGC</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <DollarSign className="w-5 h-5 text-black/80" />
                            <span>Paid</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-5 h-5 text-black/80" />
                            <span>04/11/2025-04/20/2025</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
