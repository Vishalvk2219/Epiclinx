"use client"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const additionalInfoSchema = z.object({
  hearAboutUs: z.string().optional(),
  enableNotifications: z.boolean().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
})

type AdditionalInfoFormValues = z.infer<typeof additionalInfoSchema>

interface AdditionalInfoFormProps {
  formData: any
  updateFormData: (data: any) => void
  onSubmit: () => void
  onBack: () => void
}

export function AdditionalInfoForm({ formData, updateFormData, onSubmit, onBack }: AdditionalInfoFormProps) {
  const hearAboutUsOptions = [
    "Google Search",
    "Social Media",
    "Friend or Colleague",
    "Advertisement",
    "Blog or Article",
    "Other",
  ]

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AdditionalInfoFormValues>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: {
      hearAboutUs: formData.hearAboutUs,
      enableNotifications: formData.enableNotifications,
      agreeToTerms: formData.agreeToTerms,
    },
  })

  const onFormSubmit = (data: AdditionalInfoFormValues) => {
    updateFormData(data)
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="hearAboutUs" className="text-gray-300 text-xs">
          How did you hear about us?
        </Label>
        <Select
          value={watch("hearAboutUs")}
          onValueChange={(value) => {
            setValue("hearAboutUs", value)
            updateFormData({ hearAboutUs: value })
          }}
        >
          <SelectTrigger className="bg-transparent border-gray-700 text-white rounded-full">
            <SelectValue placeholder="Choose options" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            {hearAboutUsOptions.map((option) => (
              <SelectItem key={option} value={option} className="hover:!text-white hover:!bg-epiclinx-teal">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="enableNotifications"
            checked={watch("enableNotifications")}
            onCheckedChange={(checked) => {
              setValue("enableNotifications", checked === true)
              updateFormData({ enableNotifications: checked === true })
            }}
          />
          <Label htmlFor="enableNotifications" className="text-gray-300">
            Enable SMS and Email Notifications
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="agreeToTerms"
            checked={watch("agreeToTerms")}
            onCheckedChange={(checked) => {
              setValue("agreeToTerms", checked === true)
              updateFormData({ agreeToTerms: checked === true })
            }}
          />
          <Label htmlFor="agreeToTerms" className="text-gray-300">
            Agree to EpicLinx{" "}
            <Link href="/terms-and-conditions" className="text-epiclinx-teal">
              Terms & Conditions
            </Link>
          </Label>
        </div>
        {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms.message}</p>}
      </div>

      <div className="flex justify-center gap-4 !mt-16">
        <button type="button" onClick={onBack} className="back-button">
          Back
        </button>
        <button type="submit" className="next-button px-5">
          Create Account
        </button>
      </div>
    </form>
  )
}
