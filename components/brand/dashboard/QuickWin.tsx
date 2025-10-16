"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Briefcase, Check, ClipboardList, FileText, History, Search, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
    id: string
    title: string
    icon: React.ReactNode
    href: string
    completed: boolean
}

export function QuickWins() {
    const [steps] = useState<Step[]>([
        {
            id: "profile",
            title: "Complete your profile",
            icon: <User className="h-6 w-6" />,
            href: "/dashboard/brand/profile",
            completed: true,
        },
        {
            id: "job",
            title: "Launch your first job",
            icon: <Briefcase className="h-6 w-6" />,
            href: "/brand/post-a-job",
            completed: false,
        },
        {
            id: "discover",
            title: "Discover jobs",
            icon: <ClipboardList className="h-6 w-6" />,
            href: "/dashboard/brand/jobs",
            completed: false,
        },
    ])

    const completedSteps = steps.filter((step) => step.completed).length
    const totalSteps = steps.length
    const progress = Math.round((completedSteps / totalSteps) * 100)

    return (
        <div>
            <div className="bg-white/20 relative rounded-3xl p-6 relative mt-4">
                {/* Header */}
                <div className="flex gap-3 items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Quick Wins</h2>
                    <span className="text-white/50 font-bold text-lg">{completedSteps}/{totalSteps}</span>
                </div>

                {/* Progress Info */}
                <div className="flex items-center gap-2 mb-0">
                    {/* Progress Bar */}
                    <div className="flex-1 relative h-2 bg-white/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#00E5C7] rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Progress Text */}
                    <span className="text-white text-sm font-medium w-10 text-right">
                        {progress}%
                    </span>
                </div>



                <div className="absolute top-0 right-0 overflow-hidden rounded-tr-3xl">
                    <Image src="/X1.svg" width={80} height={80} alt="logo" />
                </div>



            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {steps.map((step) => (
                    <Link
                        key={step.id}
                        href={step.href}
                        className={cn(
                            "flex items-center gap-3 p-4 rounded-3xl h-24 transition-colors",
                            step.completed
                                ? "bg-[#00E5C7] text-[#2A2A2A]"
                                : "bg-white/20 text-white hover:bg-white/30"
                        )}
                    >
                        <div
                            className={cn(
                                "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
                                step.completed ? "bg-white/40 text-epiclinx-teal" : "bg-white/10 text-epiclinx-teal"
                            )}
                        >
                            {step.completed ? <Check className="h-8 w-8" /> : step.icon}
                        </div>
                        <span className="font-medium">{step.title}</span>
                    </Link>
                ))}
            </div>

            <div className="flex justify-end">
                <div className="mt-5 cursor-pointer btn-hover font-light right-6 w-16 h-16 rounded-full bg-epiclinx-teal text-black flex items-center justify-center text-3xl shadow-lg z-50">
                    <span>?</span>
                </div>
            </div>

        </div>
    )
}
