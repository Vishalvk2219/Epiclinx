"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneInput } from "@/components/ui/phone-input";

const businessInfoSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  shopAddress: z.string().optional(),
  businessEmail: z.string().email("Please enter a valid email address"),
  businessPhone: z.string().min(10, "Please enter a valid phone number"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  instagram: z.string().url("Please enter a valid Instagram URL"),
  facebook: z.string().url("Please enter a valid Facebook URL"),
  tiktok: z.string().url("Please enter a valid TikTok URL"),
  businessWebsite: z.string().url("Please enter a valid website URL"),
  brandDescription: z
    .string()
    .min(10, "Please provide a brief description of your brand"),
});

type BusinessInfoFormValues = z.infer<typeof businessInfoSchema>;

interface BusinessInfoFormProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: (dataFromChild: any) => void;
  isSubmitting: boolean;
}

export function BusinessInfoForm({
  formData,
  updateFormData,
  onNext,
  isSubmitting
}: BusinessInfoFormProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    formData.categories || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessInfoFormValues>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      companyName: formData.companyName,
      shopAddress: formData.shopAddress,
      businessEmail: formData.businessEmail,
      businessPhone: formData.businessPhone,
      username: formData.username,
      instagram: formData.instagram,
      facebook: formData.facebook,
      tiktok: formData.tiktok,
      businessWebsite: formData.businessWebsite,
      brandDescription: formData.brandDescription,
    },
  });

  const categories = [
    "Fashion",
    "Fitness",
    "Wellness",
    "Health",
    "Nutrition",
    "Lifestyle",
    "Parenting",
    "Family",
    "Home",
    "Interior Design",
    "Tech",
    "Gadgets",
    "Gaming",
    "Esports",
    "Music",
    "Performing Arts",
    "Art",
    "Design",
    "Illustration",
    "Education",
    "Study",
    "Learning",
    "Motivation",
    "Mindset",
    "Self-help",
    "Cars",
    "Motorsports",
    "Pets",
    "Animals",
    "Sustainability",
    "Eco-Living",
    "Entertainment",
    "Pop Culture",
    "Memes",
  ];

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const onFormSubmit = (data: BusinessInfoFormValues) => {
    if (selectedCategories.length === 0) {
      return; // Don't proceed if no categories selected
    }

    updateFormData({
      ...data,
      categories: selectedCategories,
    });

    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-white mb-4">Logo</h2>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer">
            {formData.logo ? (
              <img
                src={formData.logo || "/placeholder.svg"}
                alt="Logo"
                className="w-full h-full rounded-full object-cover cursor-pointer"
              />
            ) : (
              <Camera className="w-8 h-8 text-gray-400 cursor-pointer" />
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            className="rounded-full text-gray-300 border-gray-400 bg-transparent hover:bg-transparent hover:text-gray-400"
          >
            Upload photo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="companyName"
            className="text-gray-100 font-light text-xs"
          >
            Company Name
          </Label>
          <Input
            id="companyName"
            placeholder="Enter Company Name"
            {...register("companyName")}
            className="border-gray-400 text-white bg-transparent focus:outline-none rounded-full"
          />
          {errors.companyName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.companyName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="shopAddress"
            className="text-gray-100 font-light text-xs"
          >
            Shop Address (Optional)
          </Label>
          <Input
            id="shopAddress"
            placeholder="Enter Shop Address"
            {...register("shopAddress")}
            className="border-gray-400 text-white bg-transparent rounded-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="businessEmail"
            className="text-gray-100 font-light text-xs"
          >
            Business Email Address
          </Label>
          <Input
            id="businessEmail"
            placeholder="Enter Business Email Address"
            {...register("businessEmail")}
            className="border-gray-400 text-white bg-transparent rounded-full"
          />
          {errors.businessEmail && (
            <p className="text-red-500 text-xs mt-1">
              {errors.businessEmail.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="businessPhone"
            className="text-gray-100 font-light text-xs"
          >
            Business Phone Number
          </Label>
          <PhoneInput
            id="businessPhone"
            placeholder="Enter Phone Number with Country Code"
            {...register("businessPhone")}
            className="border-gray-400 h-10 text-white bg-transparent rounded-full"
          />
          {errors.businessPhone && (
            <p className="text-red-500 text-xs mt-1">
              {errors.businessPhone.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username" className="text-gray-100 font-light text-xs">
          Username (Brand Name)
        </Label>
        <Input
          id="username"
          placeholder="Enter Username"
          {...register("username")}
          className="border-gray-400 text-white bg-transparent rounded-full"
        />
        {errors.username && (
          <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
        )}
      </div>

      <div>
        <h2 className="text-lg font-medium text-white mb-4">Social Media</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="instagram"
              className="text-gray-100 font-light text-xs"
            >
              Instagram
            </Label>
            <Input
              id="instagram"
              placeholder="Enter Instagram Username"
              {...register("instagram")}
              className="border-gray-400 text-white bg-transparent rounded-full"
            />
            {errors.instagram && (
              <p className="text-red-500 text-xs mt-1">
                {errors.instagram.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="facebook"
              className="text-gray-100 font-light text-xs"
            >
              Facebook
            </Label>
            <Input
              id="facebook"
              placeholder="Enter Facebook Username"
              {...register("facebook")}
              className="border-gray-400 text-white bg-transparent rounded-full"
            />
            {errors.facebook && (
              <p className="text-red-500 text-xs mt-1">
                {errors.facebook.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="tiktok"
              className="text-gray-100 font-light text-xs"
            >
              TikTok
            </Label>
            <Input
              id="tiktok"
              placeholder="Enter TikTok Username"
              {...register("tiktok")}
              className="border-gray-400 text-white bg-transparent rounded-full"
            />
            {errors.tiktok && (
              <p className="text-red-500 text-xs mt-1">
                {errors.tiktok.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="businessWebsite"
          className="text-gray-100 font-light text-xs"
        >
          Business Website
        </Label>
        <Input
          id="businessWebsite"
          placeholder="http://"
          {...register("businessWebsite")}
          className="border-gray-400 text-white bg-transparent rounded-full"
        />
        {errors.businessWebsite && (
          <p className="text-red-500 text-xs mt-1">
            {errors.businessWebsite.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="brandDescription"
          className="text-gray-100 font-light text-xs"
        >
          Tell us a little about your brand
        </Label>
        <Textarea
          id="brandDescription"
          placeholder="Enter description of your business"
          {...register("brandDescription")}
          className="border-gray-400 text-white bg-transparent rounded-xl min-h-[100px]"
        />
        {errors.brandDescription && (
          <p className="text-red-500 text-xs mt-1">
            {errors.brandDescription.message}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-gray-100 font-light text-xs">
          Pick the categories that best describe your brand
        </Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => toggleCategory(category)}
              className={`px-4 py-1 rounded-full text-sm ${
                selectedCategories.includes(category)
                  ? "bg-epiclinx-teal text-black"
                  : "bg-epiclinx-semiteal text-black hover:bg-epiclinx-teal hover:transition-all hover:duration-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        {selectedCategories.length === 0 && (
          <p className="text-red-500 text-xs mt-1">
            Please select at least one category
          </p>
        )}
      </div>

      <div className="flex justify-center !mt-16">
        <button type="submit" className="next-button">
          Continue
        </button>
      </div>
    </form>
  );
}
