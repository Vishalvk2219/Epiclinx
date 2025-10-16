"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import SignInForm from "./SigninForm"

interface LinkMeProps {
    isOpen: boolean
    onClose: () => void
}

const LinkMe: React.FC<LinkMeProps> = ({ isOpen, onClose }) => {
    const router = useRouter()
    const [signInOpen, setSignInOpen] = useState(false)

    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose()
            }
        }

        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }

        window.addEventListener("keydown", handleEscKey)
        return () => {
            window.removeEventListener("keydown", handleEscKey)
            document.body.style.overflow = ""
        }
    }, [isOpen, onClose])

    const openSignInAndCloseLinkMe = (e: React.MouseEvent) => {
        e.preventDefault()
        onClose() // close LinkMe form
        setTimeout(() => {
            setSignInOpen(true) // open SignInForm after sidebar closes
        }, 300) // match transition duration
    }

    const closeSignIn = () => {
        setSignInOpen(false)
    }

    const navigateToBrand = (e: React.MouseEvent) => {
        e.preventDefault()
        onClose() // close the sidebar
        router.push("/brand/create-a-brand")
    }

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* LinkMe Sidebar */}
            <div
                className={cn(
                    "fixed top-0 right-0 z-50 h-full bg-[#3c3c3c] text-white flex flex-col p-6 transition-transform duration-300 ease-in-out",
                    "overflow-y-auto md:w-1/2",
                    isOpen ? "translate-x-0" : "translate-x-full",
                )}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <span className="text-sm text-gray-400"></span>
                    <X onClick={onClose} className="h-6 w-6 cursor-pointer" />
                </div>

                {/* Body */}
                <div className="flex flex-col justify-start mt-10 h-full max-w-xl mx-auto">
                    <h1 className="text-3xl font-normal mb-10">Link with [Creator Name]</h1>
                    <p className="font-light">
                        Create your free Epiclinx account to connect with this creator and start a conversation.
                    </p>

                    <button
                        onClick={navigateToBrand}
                        className="bg-epiclinx-teal text-black h-12 px-6 rounded-full mt-8 mb-3 self-start"
                    >
                        Create Account to Link
                    </button>


                    <div className="space-y-6">
                        <div className="pt-4">
                            <p className="text-white font-light">
                                Already have an account?{" "}
                                <button onClick={openSignInAndCloseLinkMe} className="text-epiclinx-teal hover:underline">
                                    Log In
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SignIn Form */}
            <SignInForm isOpen={signInOpen} onClose={closeSignIn} />
        </>
    )
}

export default LinkMe
