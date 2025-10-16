"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Calendar, Info } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const legalInfoSchema = z.object({
  creditCardNumber: z
    .string()
    .min(13, "Credit card number must be valid")
    .max(19, "Credit card number must be valid")
    .regex(/^[0-9 ]+$/, "Credit card must contain only numbers"),
  cvv: z
    .string()
    .min(3, "CVV must be 3-4 digits")
    .max(4, "CVV must be 3-4 digits")
    .regex(/^[0-9]+$/, "CVV must contain only numbers"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/20[2-9][0-9]$/, "Expiry date must be in MM/YYYY format"),
  abn: z.string().optional(),
})

type LegalInfoFormValues = z.infer<typeof legalInfoSchema>

interface LegalInfoFormProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function LegalInfoForm({ formData, updateFormData, onNext, onBack }: LegalInfoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LegalInfoFormValues>({
    resolver: zodResolver(legalInfoSchema),
    defaultValues: {
      creditCardNumber: formData.creditCardNumber,
      cvv: formData.cvv,
      expiryDate: formData.expiryDate,
      abn: formData.abn,
    },
  })

  const onSubmit = (data: LegalInfoFormValues) => {
    updateFormData(data)
    onNext()
  }

  const formatCreditCard = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    value = value.slice(0, 16) // Limit to 16 digits
    const formatted = value.replace(/(.{4})/g, "$1 ").trim()
    e.target.value = formatted
    updateFormData({ creditCardNumber: formatted })
  }

  const formatExpiryDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 6) value = value.slice(0, 6)

    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2)
    }

    e.target.value = value
    updateFormData({ expiryDate: value })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 max-md:flex max-md:flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="creditCardNumber" className="text-gray-100 font-light text-xs">
            Credit Card
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="creditCardNumber"
              placeholder="Enter Credit Card Number"
              {...register("creditCardNumber")}
              onChange={formatCreditCard}
              className="bg-transparent border-gray-400 text-white rounded-full pl-10"
            />
          </div>
          {errors.creditCardNumber && <p className="text-red-500 text-xs mt-1">{errors.creditCardNumber.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cvv" className="text-gray-100 font-light text-xs">
              CVV
            </Label>
            <div className="relative">
              <Input
                id="cvv"
                placeholder=""
                {...register("cvv")}
                maxLength={4}
                className="bg-transparent border-gray-400 text-white rounded-full pr-10"
              />
            </div>
            {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate" className="text-gray-100 font-light text-xs">
              Expiry Date
            </Label>
            <div className="relative">
              <Input
                id="expiryDate"
                placeholder="MM/YYYY"
                {...register("expiryDate")}
                onChange={formatExpiryDate}
                className="bg-transparent border-gray-400 text-white rounded-full pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate.message}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="abn" className="text-gray-100 font-light text-xs flex items-center gap-1">
          ABN (optional) <Info className="h-4 w-4 text-gray-400" />
        </Label>
        <Input
          id="abn"
          placeholder="Enter Your ABN"
          {...register("abn")}
          className="bg-transparent border-gray-400 text-white rounded-full"
        />
      </div>

      <div className="flex justify-center gap-4 !mt-16">
        <button type="button" onClick={onBack} className="back-button">
          Back
        </button>
        <button type="submit" className="next-button">
          Continue
        </button>
      </div>
    </form>
  )
}
