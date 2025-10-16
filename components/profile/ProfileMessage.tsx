"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ArrowLeft, Map, MapPin, Paperclip, Search, Send, Star, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { PiInstagramLogoFill, PiTiktokLogoFill } from "react-icons/pi"
import { FaYoutube } from "react-icons/fa"
import Link from "next/link"

interface Message {
    id: string
    content: string
    timestamp: string
    sender: "user" | "contact"
    image?: string
    isSequential?: boolean
}

interface Contact {
    id: string
    name: string
    avatar: string
    lastMessage: string
    timestamp: string
    campaign: string
    platform: string
    campaignId: string
    unread?: boolean
    badge?: number
}

export function ProfileMessage() {
    const [activeContact, setActiveContact] = useState<string>("jennifer")
    const [messageInput, setMessageInput] = useState("")
    const [showMobileConversation, setShowMobileConversation] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom of messages when new messages are added or when contact changes
    useEffect(() => {
        scrollToBottom()
    }, [activeContact])

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
        }
    }

    const contacts: Contact[] = [
        {
            id: "jennifer",
            name: "Jennifer Markus",
            avatar: "/placeholder.svg?height=40&width=40",
            lastMessage: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
            timestamp: "Today, 05:30 PM",
            campaign: "H&M - Spring Launch - TikTok",
            platform: "TikTok",
            campaignId: "#AD204",
            unread: true,
        },
        {
            id: "iva",
            name: "Iva Ryan",
            avatar: "/placeholder.svg?height=40&width=40",
            lastMessage: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
            timestamp: "Today, 05:30 PM",
            campaign: "H&M - Spring Launch - TikTok",
            platform: "TikTok",
            campaignId: "#AD204",
            badge: 3,
        },
        {
            id: "jerry",
            name: "Jerry Helfer",
            avatar: "/placeholder.svg?height=40&width=40",
            lastMessage: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
            timestamp: "Today, 05:30 PM",
            campaign: "H&M - Spring Launch - TikTok",
            platform: "TikTok",
            campaignId: "#AD204",
        },
        {
            id: "david",
            name: "David Elson",
            avatar: "/placeholder.svg?height=40&width=40",
            lastMessage: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
            timestamp: "Today, 05:30 PM",
            campaign: "H&M - Spring Launch - TikTok",
            platform: "TikTok",
            campaignId: "#AD204",
        },
    ]

    const messages: Record<string, Message[]> = {
        jennifer: [
            {
                id: "1",
                content: "Hey! I need your help with something.",
                timestamp: "Today, 05:30 PM",
                sender: "user",
            },
            {
                id: "2",
                content: "I need you to finish the Hi-Fi wireframes for flora app design.",
                timestamp: "Today, 05:30 PM",
                sender: "user",
            },
        ],
        iva: [
            {
                id: "1",
                content: "Hey! I need your help with something.",
                timestamp: "Today, 05:30 PM",
                sender: "user",
            },
            {
                id: "2",
                content: "I need you to finish the Hi-Fi wireframes for flora app design.",
                timestamp: "Today, 05:30 PM",
                sender: "user",
            },
            {
                id: "3",
                content: "I've attached a screenshot of the design. Let me know if you have any questions.",
                timestamp: "Today, 05:30 PM",
                sender: "user",
                image: "/placeholder.svg?height=200&width=200",
            },
            {
                id: "4",
                content: "Thanks!",
                timestamp: "Today, 05:30 PM",
                sender: "contact",
            },
        ],
        jerry: [
            {
                id: "1",
                content: "Hey! I need your help with something.",
                timestamp: "Today, 05:30 PM",
                sender: "user",
            },
            {
                id: "2",
                content: "I need you to finish the Hi-Fi wireframes for flora app design.",
                timestamp: "Today, 05:30 PM",
                sender: "user",
            },
            {
                id: "3",
                content: "I've attached a screenshot of the design. Let me know if you have any questions.",
                timestamp: "Today, 05:30 PM",
                sender: "user",
                image: "/placeholder.svg?height=200&width=200",
            },
            {
                id: "4",
                content: "Thanks!",
                timestamp: "Today, 05:30 PM",
                sender: "contact",
            },
        ],
        david: [
            {
                id: "1",
                content: "Hey! I need your help with something.",
                timestamp: "Today, 05:30 PM",
                sender: "user",
            },
            {
                id: "2",
                content: "I need you to finish the Hi-Fi wireframes for flora app design.",
                timestamp: "Today, 05:30 PM",
                sender: "user",
            },
            {
                id: "3",
                content: "I've attached a screenshot of the design. Let me know if you have any questions.",
                timestamp: "Today, 05:30 PM",
                sender: "user",
                image: "/placeholder.svg?height=200&width=200",
            },
            {
                id: "4",
                content: "Thanks!",
                timestamp: "Today, 05:30 PM",
                sender: "contact",
            },
        ],

    }

    // Mark sequential messages
    Object.keys(messages).forEach(contactId => {
        const contactMessages = messages[contactId];
        for (let i = 1; i < contactMessages.length; i++) {
            if (contactMessages[i].sender === contactMessages[i - 1].sender) {
                contactMessages[i].isSequential = true;
            }
        }
    });

    const activeContactData = contacts.find((contact) => contact.id === activeContact)
    const activeMessages = messages[activeContact] || []

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            // In a real app, you would send this to an API
            // For now, let's simulate adding a new message
            const newMessage = {
                id: `new-${Date.now()}`,
                content: messageInput,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                sender: "user" as const,
                isSequential: activeMessages.length > 0 && activeMessages[activeMessages.length - 1].sender === "user"
            }

            messages[activeContact] = [...(messages[activeContact] || []), newMessage]
            setMessageInput("")

            // Force a re-render
            setActiveContact((prev) => prev)

            // Scroll to bottom after sending
            setTimeout(scrollToBottom, 100)
        }
    }

    return (
        <div className="md:min-h-[70vh] flex flex-col mt-3">

            <div className="flex gap-4 max-md:flex-col h-full">
                {/* User Profile */}
                <div
                    className={cn(
                        "w-full md:w-1/4 max-md:hidden bg-white/10 rounded-3xl overflow-y-auto hide-scrollbar",
                        showMobileConversation ? "hidden md:block" : "block",
                        "h-[70vh]", // Fixed height for contacts list
                    )}
                >
                    <div className="flex flex-col gap-4 max-md:hidden">
                        <div className="relative h-[350px] w-full overflow-hidden">
                            <Image src={'/insta2.png'} alt="" fill className="object-cover center rounded-3xl -mt-1" />
                            <div className="absolute bottom-5 left-5 flex items-center gap-1 rounded-full text-white">
                                <Star className="h-7 w-7 fill-[#ffffff] text-[#ffffff]" />
                                <span className="text-lg font-light">4.5</span>
                            </div>
                            <div className="absolute bottom-5 right-5 flex items-center gap-2">
                                <a href={`https://www.youtube.com/c/`} target="_blank" rel="noreferrer">
                                    <FaYoutube className="w-7 h-7 text-[#ffffff]" />
                                </a>
                                <a href={`https://www.instagram.com/`} target="_blank" rel="noreferrer">
                                    <PiInstagramLogoFill className="w-7 h-7 text-[#ffffff]" />
                                </a>
                                <a href={`https://www.tiktok.com/`} target="_blank" rel="noreferrer">
                                    <PiTiktokLogoFill className="w-7 h-7 text-[#ffffff]" />
                                </a>
                            </div>
                        </div>

                        <div className="py-2 px-5">

                            <span
                                className={`rounded-full px-3 py-2 text-xs font-medium bg-epiclinx-semiteal text-black`}
                            >
                                Lifestyle
                            </span>
                            <h2 className="text-xl font-bold mt-4">Courtney Henry</h2>
                            <div className="flex flex-col gap-2 mt-4">
                                <div className="flex items-center gap-2">
                                    <Users size={20} />
                                    <span className="font-light">1000+ Followers</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={20} />
                                    <span className="font-light">New York</span>
                                </div>
                            </div>



                        </div>
                    </div>
                </div>

                {/* Chat Area - Shown on mobile only when a conversation is selected */}

                <div
                    className={cn(
                        "flex flex-col bg-white/10 rounded-3xl overflow-hidden",
                        "flex-1 min-h-0", // ✅ allow children to shrink properly
                    )}
                >
                    {/* Chat Header */}
                    <div className="p-4 border-b w-full border-[#3A3A3A] flex items-center justify-between">
                        {/* Left - Contact Info */}
                        <div className={cn("flex items-center gap-3", showMobileConversation ? "md:flex" : "flex")}>
                            <Image
                                src={activeContactData.avatar || "/placeholder.svg"}
                                alt={activeContactData.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <div>
                                <h3 className="font-medium text-white">{activeContactData.name}</h3>
                                {/* <p className="text-xs text-[#AAAAAA]">{activeContactData.timestamp}</p> */}
                            </div>
                        </div>

                        {/* Right - Mobile Only Button */}
                        {/* <div className="md:hidden flex items-center">
                            <Link href="/profile/creator">
                                <button className="bg-white/10 hover:bg-white/20 transition-all duration-300 text-white rounded-full px-4 py-2">
                                    View Profile
                                </button>
                            </Link>
                        </div> */}
                    </div>


                    {/* Messages - Flex grow to take available space */}
                    <div
                        className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar"
                        ref={messagesEndRef}
                        style={{ maxHeight: "calc(100% - 140px)" }} // Ensure there's space for header and input
                    >
                        {activeMessages.map((message, index) => {
                            const isLast = index === activeMessages.length - 1 ||
                                activeMessages[index + 1].sender !== message.sender;

                            return (
                                <div key={message.id} className={cn(
                                    "max-w-[70%]",
                                    message.sender === "user" ? "ml-auto" : "mr-auto",
                                    message.isSequential ? "mt-1" : "mt-4"
                                )}>
                                    <div
                                        className={cn(
                                            "p-4",
                                            message.sender === "user"
                                                ? "bg-[#00E5C7] text-[#2A2A2A]"
                                                : "bg-[#3A3A3A] text-white",

                                            // Message grouping logic
                                            message.isSequential
                                                ? message.sender === "user"
                                                    ? isLast
                                                        ? "rounded-t-3xl rounded-l-3xl" // bottom-right intentionally not rounded
                                                        : "rounded-t-3xl rounded-l-3xl"
                                                    : isLast
                                                        ? "rounded-t-3xl rounded-r-3xl" // bottom-left not rounded
                                                        : "rounded-t-3xl"
                                                : message.sender === "user"
                                                    ? isLast
                                                        ? "rounded-t-3xl rounded-bl-3xl" // no bottom-right rounding
                                                        : "rounded-3xl"
                                                    : isLast
                                                        ? "rounded-t-3xl rounded-br-3xl" // no bottom-left rounding
                                                        : "rounded-3xl"
                                        )}
                                    >
                                        <p className="whitespace-pre-line break-words text-left">{message.content}</p>
                                        {message.image && (
                                            <div className="mt-2">
                                                <Image
                                                    src={message.image}
                                                    alt="Shared image"
                                                    width={200}
                                                    height={150}
                                                    className="rounded-3xl"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        className={cn(
                                            "text-xs mt-1",
                                            message.sender === "user" ? "text-right text-[#AAAAAA]" : "text-[#AAAAAA]",
                                        )}
                                    >
                                        {message.timestamp}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Message Input - Fixed at bottom */}
                    <div className="p-4 border-t border-[#3A3A3A] mt-auto">
                        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-2 relative w-full">

                            {/* Input Section - relative wrapper for paperclip and send */}
                            <div className="relative flex-1 w-full">
                                <button className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6A6A6A] hover:text-[#00E5C7]">
                                    <Paperclip size={20} />
                                </button>

                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type your message here..."
                                    className="w-full bg-[#3A3A3A] text-white rounded-full px-12 py-3 focus:outline-none focus:ring-1 focus:ring-[#00E5C7]"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleSendMessage();
                                        }
                                    }}
                                />

                                <button
                                    onClick={handleSendMessage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00E5C7] hover:text-[#00E5C7]/80"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}