"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ArrowLeft, Paperclip, Search, Send } from "lucide-react"
import { cn } from "@/lib/utils"

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

export function Messages() {
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
        content: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
        timestamp: "05:30 PM",
        sender: "contact",
      },
      {
        id: "2",
        content: "Oh, hello! All perfectly.\nI will check it and get back to you soon",
        timestamp: "05:45 PM",
        sender: "user",
      },
      {
        id: "3",
        content: "Here's the design mockup I've been working on",
        timestamp: "05:46 PM",
        sender: "user",
        image: "https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg?auto=compress&cs=tinysrgb&w=600",
        isSequential: true,
      },
    ],
    iva: [
      {
        id: "1",
        content: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
        timestamp: "05:30 PM",
        sender: "contact",
      },
      {
        id: "2",
        content: "Yes, I've completed them. I'll send them over shortly!",
        timestamp: "05:45 PM",
        sender: "user",
      },
    ],
    jerry: [
      {
        id: "1",
        content: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
        timestamp: "05:30 PM",
        sender: "contact",
      },
      {
        id: "2",
        content: "Still working on them. Need a bit more time to polish the details.",
        timestamp: "05:45 PM",
        sender: "user",
      },
    ],
    david: [
      {
        id: "1",
        content: "Hey! Did you finish the Hi-Fi wireframes for flora app design?",
        timestamp: "05:30 PM",
        sender: "contact",
      },
      {
        id: "2",
        content: "Just finished them! Let me know what you think of the new layout.",
        timestamp: "05:45 PM",
        sender: "user",
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

  const handleContactClick = (contactId: string) => {
    setActiveContact(contactId)
    setShowMobileConversation(true)
    // Scroll to bottom when changing contacts
    setTimeout(scrollToBottom, 100)
  }

  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="text-white mb-6 text-xs font-light">You have {contacts.length} chats</div>

      <div className="flex gap-4 max-md:flex-col h-full">
        {/* Contacts List - Hidden on mobile when conversation is shown */}
        <div
          className={cn(
            "w-full md:w-1/3 bg-white/10 rounded-3xl overflow-y-auto hide-scrollbar",
            showMobileConversation ? "hidden md:block" : "block",
            "h-[70vh]", // Fixed height for contacts list
          )}
        >
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6A6A6A]" size={18} />
              <input
                type="text"
                placeholder="Search"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#3A3A3A] text-white rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#00E5C7]"
              />
            </div>

            <div className="space-y-2">
              {filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleContactClick(contact.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-3xl transition-colors relative",
                    activeContact === contact.id ? "bg-[#00E5C7]" : "hover:bg-[#3A3A3A]",
                  )}
                >
                  <div className="flex gap-3">
                    <div className="relative">
                      <Image
                        src={contact.avatar || "/placeholder.svg"}
                        alt={contact.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      {/* {contact.unread && <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00E5C7] rounded-full" />} */}
                      {contact.badge && (
                        <div className={cn("absolute -top-1 -right-1 min-w-5 h-5 flex pt-[1.5px] items-center justify-center bg-epiclinx-teal rounded-full px-1.5 text-xs font-bold text-[#2A2A2A]", activeContact === contact.id ? "bg-gray-800 text-gray-200" : "")}>
                          {contact.badge}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h3
                          className={cn(
                            "font-medium truncate",
                            activeContact === contact.id ? "text-[#2A2A2A]" : "text-white",
                          )}
                        >
                          {contact.name}
                        </h3>
                        <span
                          className={cn("text-xs", activeContact === contact.id ? "text-[#2A2A2A]" : "text-[#6A6A6A]")}
                        >
                          {contact.timestamp}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "text-sm truncate mt-2",
                          activeContact === contact.id ? "text-[#2A2A2A]" : "text-[#AAAAAA]",
                        )}
                      >
                        {contact.campaign} - {contact.campaignId}
                      </div>
                      <p
                        className={cn(
                          "text-xs truncate mt-2",
                          activeContact === contact.id ? "text-[#2A2A2A]" : "text-[#AAAAAA]",
                        )}
                      >
                        {contact.lastMessage}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Back button for mobile */}
        {showMobileConversation && (
          <button
            onClick={() => setShowMobileConversation(false)}
            className="md:hidden text-white flex items-center rounded-full p-2 justify-center text-xs w-40 gap-1 border border-gray-100"
          >
            <ArrowLeft size={16} />
            <span>Back to chats</span>
          </button>
        )}

        {/* Chat Area - Shown on mobile only when a conversation is selected */}
        {activeContactData && (
          <div
            className={cn(
              "flex flex-col bg-white/10 rounded-3xl overflow-hidden",
              showMobileConversation ? "flex" : "hidden md:flex",
              "flex-1 min-h-0", // ✅ allow children to shrink properly
            )}
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-[#3A3A3A] flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Contact info - hidden on mobile when back button is shown */}
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
                    <p className="text-xs text-[#AAAAAA]">{activeContactData.timestamp}</p>
                  </div>
                </div>
              </div>
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
              <div className="flex items-center gap-2 relative">
                <button className="absolute left-3 text-[#6A6A6A] hover:text-[#00E5C7]">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 bg-[#3A3A3A] text-white rounded-full px-12 py-3 focus:outline-none focus:ring-1 focus:ring-[#00E5C7]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                />
                <button onClick={handleSendMessage} className="absolute right-3 text-[#00E5C7] hover:text-[#00E5C7]/80">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}