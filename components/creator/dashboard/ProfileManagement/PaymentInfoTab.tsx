"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Calendar, CreditCard } from "lucide-react"

// Validation schema using Zod
const paymentInfoSchema = z.object({
    creditCard: z.string().min(12, "Valid card number is required"),
    cvv: z.string().min(3, "Valid CVV is required"),
    expiryDate: z.string().min(5, "Valid expiry date is required")
})

export default function PaymentInfoTab() {
    const form = useForm<z.infer<typeof paymentInfoSchema>>({
        resolver: zodResolver(paymentInfoSchema),
        defaultValues: {
            creditCard: "",
            cvv: "",
            expiryDate: ""
        }
    })

    // Function to format credit card number (adds space every 4 digits)
    const formatCreditCard = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 16); // remove non-digits
        const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Add space every 4 digits
        e.target.value = formattedValue; // Set formatted value
        form.setValue("creditCard", formattedValue); // Update form state
    }

    // Function to format expiry date (MM/YYYY)
    const formatExpiryDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 4); // remove non-digits
        const formattedValue = value.replace(/(\d{2})(?=\d)/g, '$1/'); // Add "/" after MM
        e.target.value = formattedValue; // Set formatted value
        form.setValue("expiryDate", formattedValue); // Update form state
    }

    function onSubmit(data: z.infer<typeof paymentInfoSchema>) {
        console.log(data)
        // Handle form submission
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Credit Card Number */}
                        <FormField
                            control={form.control}
                            name="creditCard"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <Label htmlFor="creditCard" className="text-gray-100 font-light text-xs">
                                        Credit Card
                                    </Label>
                                    <FormControl>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                <CreditCard className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <Input
                                                {...field}
                                                id="creditCard"
                                                placeholder="Enter Credit Card Number"
                                                className="bg-transparent border-gray-400 text-white rounded-full pl-10"
                                                onChange={formatCreditCard} // Format as user types
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            {/* CVV */}
                            <FormField
                                control={form.control}
                                name="cvv"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <Label htmlFor="cvv" className="text-gray-100 font-light text-xs">
                                            CVV
                                        </Label>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                id="cvv"
                                                placeholder="123"
                                                className="bg-transparent border-gray-400 text-white rounded-full"
                                                maxLength={4}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Expiry Date */}
                            <FormField
                                control={form.control}
                                name="expiryDate"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <Label htmlFor="expiryDate" className="text-gray-100 font-light text-xs">
                                            Expiry Date
                                        </Label>
                                        <FormControl>
                                            <div className="relative">
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                    <Calendar className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <Input
                                                    {...field}
                                                    id="expiryDate"
                                                    placeholder="MM/YYYY"
                                                    className="bg-transparent border-gray-400 text-white rounded-full pr-10"
                                                    onChange={formatExpiryDate} // Format as user types
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-8">
                        <button type="submit" className="next-button px-8">
                            Save Changes
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
