"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

const businessInfoSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    shopAddress: z.string().optional(),
    businessEmail: z.string().email("Invalid email address"),
    businessPhone: z.string().min(6, "Valid phone number is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    tiktok: z.string().optional(),
    website: z.string().optional(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    abn: z.string().optional()
})

export default function BusinessInfoTab() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([
        "Fashion", "Fitness", "Wellness", "Health", "Lifestyle", "Parenting", "Family", "Tech"
    ])

    const form = useForm<z.infer<typeof businessInfoSchema>>({
        resolver: zodResolver(businessInfoSchema),
        defaultValues: {
            companyName: "",
            shopAddress: "",
            businessEmail: "businessemail@gmail.com",
            businessPhone: "",
            username: "",
            instagram: "",
            facebook: "",
            tiktok: "",
            website: "",
            description: "American athletic footwear and apparel corporation headquartered near Beaverton, Oregon. It is the world's largest supplier of athletic shoes and apparel and a major manufacturer of sports equipment, with revenue in excess of US$46 billion in its fiscal year 2022.",
            abn: ""
        }
    })

    function onSubmit(data: z.infer<typeof businessInfoSchema>) {
        console.log(data)
        // Handle form submission
    }

    const categories = [
        "Fashion", "Fitness", "Wellness", "Health", "Nutrition", "Lifestyle", "Parenting", "Family",
        "Home", "Interior Design", "Tech", "Gadgets", "Gaming", "Esports", "Music",
        "Performing Arts", "Art", "Design", "Illustration", "Education", "Study", "Learning",
        "Motivation", "Mindset", "Self-help", "Cars", "Motorsports", "Pets", "Animals",
        "Sustainability", "Eco-Living", "Entertainment", "Pop Culture", "Memes"
    ]

    const toggleCategory = (category: string) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category))
        } else {
            setSelectedCategories([...selectedCategories, category])
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <Label className="text-base">Logo</Label>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="w-16 h-16 cursor-pointer bg-transparent rounded-full flex items-center justify-center border border-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-zinc-400"
                                >
                                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                    <circle cx="9" cy="9" r="2" />
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                </svg>
                            </div>
                            <button className="back-button !w-44">
                                Upload photo
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <Label htmlFor="company-name" className="font-light text-xs">Company Name</Label>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id="company-name"
                                            placeholder="Company Name"
                                            className="bg-transparent border-gray-400 focus:border-[#0ABAB5]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="shopAddress"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <Label htmlFor="shop-address" className="font-light text-xs">Shop Address (Optional)</Label>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id="shop-address"
                                            placeholder="Shop Address"
                                            className="bg-transparent border-gray-400 focus:border-[#0ABAB5]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="businessEmail"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <Label htmlFor="business-email" className="font-light text-xs">Business Email Address</Label>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id="business-email"
                                            placeholder="businessemail@gmail.com"
                                            className="bg-transparent border-gray-400 focus:border-[#0ABAB5]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="businessPhone"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <Label htmlFor="business-phone" className="font-light text-xs">Business Phone Number</Label>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id="business-phone"
                                            placeholder="+1(555) 123-4567"
                                            className="bg-transparent border-gray-400 focus:border-[#0ABAB5]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <Label htmlFor="username" className="font-light text-xs">Username (Brand Name)</Label>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id="username"
                                            placeholder="Username"
                                            className="bg-transparent border-gray-400 focus:border-[#0ABAB5]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-base">Social Media</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="instagram"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <Label htmlFor="instagram" className="font-light text-xs">Instagram</Label>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                id="instagram"
                                                placeholder="Enter Instagram Username"
                                                className="bg-transparent border-gray-400 focus:border-[#0ABAB5]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="facebook"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <Label htmlFor="facebook" className="font-light text-xs">Facebook</Label>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                id="facebook"
                                                placeholder="Enter Facebook Username"
                                                className="bg-transparent border-gray-400 focus:border-[#0ABAB5]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tiktok"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <Label htmlFor="tiktok" className="font-light text-xs">TikTok</Label>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                id="tiktok"
                                                placeholder="Enter TikTok Username"
                                                className="bg-transparent border-gray-400 focus:border-[#0ABAB5]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <Label htmlFor="website" className="font-light text-xs">Business Website</Label>
                                <FormControl>
                                    <Input
                                        {...field}
                                        id="website"
                                        placeholder="http://"
                                        className="bg-transparent border-gray-400 focus:border-[#0ABAB5]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <Label htmlFor="description" className="font-light text-xs">Business Description</Label>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        id="description"
                                        placeholder="Describe your business..."
                                        className="bg-transparent border-gray-400 focus:border-[#0ABAB5] min-h-[100px]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-3">
                        <Label>Pick the categories that best describe your brand</Label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <div
                                    key={category}
                                    className={`cursor-pointer transition-all duration-200 px-4 py-2 rounded-full ${selectedCategories.includes(category)
                                            ? "bg-epiclinx-teal text-black"
                                            : "bg-epiclinx-semiteal text-black"
                                        }`}
                                    onClick={() => toggleCategory(category)}
                                >
                                    {category}
                                </div>
                            ))}
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="abn"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <Label htmlFor="abn" className="font-light text-xs">ABN</Label>
                                <FormControl>
                                    <Input
                                        {...field}
                                        id="abn"
                                        placeholder="Enter Your ABN"
                                        className="bg-transparent md:w-[50vh] border-gray-400 focus:border-[#0ABAB5]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-center mt-8">
                        <button
                            type="submit"
                            className="next-button px-8"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    )
}