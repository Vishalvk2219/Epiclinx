"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BusinessInfoTab from "@/components/creator/dashboard/ProfileManagement/BusinessInfoTab"
import PaymentInfoTab from "./PaymentInfoTab"
import AccountTab from "@/components/creator/dashboard/ProfileManagement/AccountTabs"
// import AccountTab from "./AccountTabs"

export default function ProfileManagement() {
  const [activeTab, setActiveTab] = useState("business-info")

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab} 
      className="w-full my-10"
    >
      <div className="flex justify-center mb-8">
        <TabsList className="rounded-full bg-zinc-800 p-1 h-auto">
          <TabsTrigger
            value="business-info"
            className={`rounded-full max-md:text-xs px-6 py-2 transition-all duration-300 ${
              activeTab === "business-info" 
                ? "!bg-epiclinx-teal text-black" 
                : "bg-transparent text-white hover:bg-zinc-700"
            }`}
          >
            Business Info
          </TabsTrigger>
          <TabsTrigger
            value="payment-info"
            className={`rounded-full max-md:text-xs px-6 py-2 transition-all duration-300 ${
              activeTab === "payment-info" 
                ? "!bg-epiclinx-teal text-black" 
                : "bg-transparent text-white hover:bg-zinc-700"
            }`}
          >
            Payment Info
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className={`rounded-full max-md:text-xs px-6 py-2 transition-all duration-300 ${
              activeTab === "account" 
                ? "!bg-epiclinx-teal text-black" 
                : "bg-transparent text-white hover:bg-zinc-700"
            }`}
          >
            Account
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent 
        value="business-info" 
        className="space-y-6 animate-in fade-in-50 duration-300"
      >
        <BusinessInfoTab />
      </TabsContent>

      <TabsContent 
        value="payment-info" 
        className="space-y-6 animate-in fade-in-50 duration-300"
      >
        <PaymentInfoTab />
      </TabsContent>

      <TabsContent 
        value="account" 
        className="space-y-6 animate-in fade-in-50 duration-300"
      >
        <AccountTab />
      </TabsContent>
    </Tabs>
  )
}