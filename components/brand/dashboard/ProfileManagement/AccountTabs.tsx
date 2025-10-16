"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

const accountSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function AccountTab() {
  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    }
  })

  function onSubmit(data: z.infer<typeof accountSchema>) {
    console.log(data)
    // Handle form submission
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label htmlFor="new-password" className="font-light text-xs">New Password</Label>
                  <FormControl>
                    <Input
                      {...field}
                      id="new-password"
                      type="password"
                      placeholder="Enter password"
                      className="bg-transparent border-gray-400 focus:border-[#0ABAB5] text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label htmlFor="confirm-password" className="font-light text-xs">Confirm New Password</Label>
                  <FormControl>
                    <Input
                      {...field}
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm password"
                      className="bg-transparent border-gray-400 focus:border-[#0ABAB5]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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