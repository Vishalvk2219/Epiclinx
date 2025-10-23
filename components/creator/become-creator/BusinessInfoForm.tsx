// creator/become-creator/BusinessInfoFrom.tsx

"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Combobox } from "@/components/ui/country-dropdown";
import { countries } from "@/lib/countries";
import { PhoneInput } from "@/components/ui/phone-input";
import CropImageDialog from "@/components/ui/crop-dialog";
import { Textarea } from "@/components/ui/textarea";
import { apiUpload } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export const makeCreatorInfoSchema = (role: "creator" | "brand") => {
  const base = z.object({
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    // username: z.string().min(3, "Must be at least 3 characters"),
    // displayName: z.string().min(3, "User Name must be at least 3 characters"),
    instagram: z.string().url("Please enter a valid Instagram URL"),
    facebook: z.string().url("Please enter a valid Facebook URL"),
    tiktok: z.string().url("Please enter a valid TikTok URL"),
    profileImageUrl: z.string().url("Please upload an image"),
  });

  if (role === "creator") {
    return base.extend({
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      location: z.string().min(1, "Location is required"),
      otherSocial: z.string().min(1, "Other Social is required"),
      followers: z.number().min(1000,"Minimum follower count should be 1000")
    });
  }

  return base.extend({
    businessWebsite: z
      .string()
      .url("Please enter a valid Website URL")
      .min(1, "Business Website is required"),
    businessDescription: z.string().min(1, "Description is required"),
    companyName: z.string().min(1, "Company Name is required"),
    shopAddress: z.string().min(1, "Shop Address is required"),
  });
};

interface CreatorInfoFormProps {
  formData?: any;
  updateFormData?: (data: any) => void;
  onNext?: (dataFromChild: any) => void;
  isSubmitting: boolean;
  isEditing?: boolean;
  onSave?: (data: any) => void;
}

export default function BusinessInfoForm({
  formData = {},
  updateFormData = () => {},
  onNext = () => {},
  isSubmitting,
  isEditing,
  onSave,
}: CreatorInfoFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    formData?.categories || []
  );
  const [showErrors, setShowErrors] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    reset({
      firstName: formData?.firstName || "",
      lastName: formData?.lastName || "",
      email: formData?.email || "",
      phone: formData?.phone || "",
      // username: formData?.username || "",
      location: formData?.location || "",
      instagram: formData?.instagram || "",
      facebook: formData?.facebook || "",
      tiktok: formData?.tiktok || "",
      otherSocial: formData?.otherSocial || "",
      profileImageUrl: formData?.profileImageUrl || "",
      // displayName: formData?.displayName || "",
      businessWebsite: formData?.businessWebsite || "",
      businessDescription: formData?.businessDescription || "",
      companyName: formData?.companyName || "",
      shopAddress: formData?.shopAddress || "",
    });
    // explicitly reset selectedCategories too
    setSelectedCategories(formData.categories || []);
  }, [formData]);

  const creatorInfoSchema = useMemo(
    () => makeCreatorInfoSchema(formData?.role),
    [formData?.role]
  );

  type CreatorInfoFormValues = z.infer<typeof creatorInfoSchema>;
  const formSnapshotRef = useRef<CreatorInfoFormValues | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    getValues,
  } = useForm<CreatorInfoFormValues>({
    resolver: zodResolver(creatorInfoSchema),
    defaultValues: {
      firstName: formData?.firstName || "",
      lastName: formData?.lastName || "",
      email: formData?.email || "",
      phone: formData?.phone || "",
      // username: formData?.username || "",
      location: formData?.location || "",
      instagram: formData?.instagram || "",
      facebook: formData?.facebook || "",
      tiktok: formData?.tiktok || "",
      otherSocial: formData?.otherSocial || "",
      profileImageUrl: formData?.profileImageUrl || "",
      // displayName: formData?.displayName || "",
      businessWebsite: formData?.businessWebsite || "",
      businessDescription: formData?.businessDescription || "",
      companyName: formData?.companyName || "",
      shopAddress: formData?.shopAddress || "",
      followers: formData?.followers || ""
    },
  });

  register("profileImageUrl");

  const locationValue = watch("location");

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formSnapshotRef.current = getValues(); // Capture current form state
      setSelectedImage(file);
      setCropDialogOpen(true);
    }
  };

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
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleInputChange = () => {
    if (showErrors) setShowErrors(false);
  };

  const onSubmit = (data: CreatorInfoFormValues) => {
    if (selectedCategories.length === 0) {
      setShowErrors(true);
      return;
    }
    const payload = { ...data, categories: selectedCategories };
    updateFormData(payload);
    if (isEditing && onSave) {
      onSave(payload);
    } else {
      onNext(payload); // pass data to the parent
    }
  };

  const handleFormSubmit = handleSubmit(onSubmit);

  return (
    <div className="min-h-screen">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <fieldset disabled={isUploading} className="space-y-6">
          <div>
            {formData?.role == "creator" && (
              <h2 className="text-sm font-medium text-white mb-4">
                Profile Picture
              </h2>
            )}
            {formData?.role == "brand" && (
              <h2 className="text-sm font-medium text-white mb-4">Logo</h2>
            )}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer">
                {formData?.profileImageUrl ? (
                  <img
                    src={formData?.profileImageUrl}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Camera className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <Button
                type="button"
                onClick={handleUploadClick}
                variant="outline"
                className="rounded-full text-gray-300 border-gray-400 bg-transparent hover:bg-transparent hover:text-gray-400"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting || isUploading
                  ? "Uploading..."
                  : `Upload ${formData?.role == "creator" ? "Photo" : "Logo"}`}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
            {(errors as any).profileImageUrl && (
              <p className="text-red-500 text-xs mt-5">
                {(errors as any).profileImageUrl?.message}
              </p>
            )}
          </div>

          <CropImageDialog
            open={cropDialogOpen}
            onClose={() => setCropDialogOpen(false)}
            setOpen={setCropDialogOpen}
            image={selectedImage}
            onCropComplete={async (croppedFile: File) => {
              const previewUrl = URL.createObjectURL(croppedFile);
              const previousValues = formSnapshotRef.current;
              updateFormData({
                profileImageFile: croppedFile,
                profileImageUrl: previewUrl,
              });
              setIsUploading(true);
              try {
                const uploadForm = new FormData();
                uploadForm.append("file", croppedFile);
                const uploadUrl = await apiUpload(uploadForm);
                setValue("profileImageUrl", uploadUrl);
                toast({
                  variant: "info",
                  title: "Upload Complete",
                });
                if (previousValues) {
                  reset({
                    ...previousValues,
                    profileImageUrl: uploadUrl,
                  });
                } else {
                  updateFormData({
                    profileImageFile: croppedFile,
                    profileImageUrl: uploadUrl,
                  });
                }
              } catch {
                toast({
                  variant: "destructive",
                  title: "Upload Failed",
                });
              } finally {
                setIsUploading(false);
              }
            }}
          />

          {/* original form fields follow */}
          {/* no fields removed from original code */}

          {/* ... same rest of the form as in original ... */}
          {formData?.role == "creator" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-gray-100 font-light text-xs"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="Enter First Name"
                  {...register("firstName")}
                  onChange={handleInputChange}
                  className="border-gray-400 text-white bg-transparent focus:outline-none rounded-full"
                />
                {(errors as any).firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {(errors as any).firstName?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-gray-100 font-light text-xs"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Enter Last Name"
                  {...register("lastName")}
                  onChange={handleInputChange}
                  className="border-gray-400 text-white bg-transparent focus:outline-none rounded-full"
                />
                {(errors as any).lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {(errors as any).lastName?.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {formData?.role == "brand" && (
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
                  onChange={handleInputChange}
                  className="border-gray-400 text-white bg-transparent focus:outline-none rounded-full"
                />
                {(errors as any).companyName && (
                  <p className="text-red-500 text-xs mt-1">
                    {(errors as any).companyName?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="shopAddress"
                  className="text-gray-100 font-light text-xs"
                >
                  Shop Address
                </Label>
                <Input
                  id="shopAddress"
                  placeholder="Enter Shop Address"
                  {...register("shopAddress")}
                  onChange={handleInputChange}
                  className="border-gray-400 text-white bg-transparent focus:outline-none rounded-full"
                />
                {(errors as any).shopAddress && (
                  <p className="text-red-500 text-xs mt-1">
                    {(errors as any).shopAddress?.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              {formData?.role == "creator" && (
                <Label
                  htmlFor="email"
                  className="text-gray-100 font-light text-xs"
                >
                  Email Address
                </Label>
              )}
              {formData?.role == "brand" && (
                <Label
                  htmlFor="email"
                  className="text-gray-100 font-light text-xs"
                >
                  Business Email Address
                </Label>
              )}
              <Input
                id="email"
                placeholder="Enter Email Address"
                {...register("email")}
                onChange={handleInputChange}
                className="border-gray-400 text-white bg-transparent rounded-full"
              />
              {(errors as any).email && (
                <p className="text-red-500 text-xs mt-1">
                  {(errors as any).email?.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              {formData?.role == "creator" && (
                <Label
                  htmlFor="phone"
                  className="text-gray-100 font-light text-xs"
                >
                  Phone Number
                </Label>
              )}
              {formData?.role == "brand" && (
                <Label
                  htmlFor="phone"
                  className="text-gray-100 font-light text-xs"
                >
                  Business Phone Number
                </Label>
              )}
              <PhoneInput
                id="phone"
                placeholder="Phone with Country Code"
                {...register("phone")}
                className="border-gray-400 h-10 text-white bg-transparent rounded-full"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone?.message}
                </p>
              )}
            </div>
          </div>

          {/* <div className="space-y-2">
            {formData?.role == "creator" && (
              <Label
                htmlFor="displayName"
                className="text-gray-100 font-light text-xs"
              >
                Username (Creator Name)
              </Label>
            )}
            {formData?.role == "brand" && (
              <Label
                htmlFor="displayName"
                className="text-gray-100 font-light text-xs"
              >
                Username (Brand Name)
              </Label>
            )}
            <Input
              id="displayName"
              placeholder="Enter Username"
              {...register("displayName")}
              onChange={handleInputChange}
              className="border-gray-400 text-white bg-transparent rounded-full"
            />
            {errors.displayName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.displayName?.message}
              </p>
            )}
          </div> */}

          {formData?.role == "creator" && (
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-gray-100 font-light text-xs"
              >
                Location
              </Label>
              <div className="relative">
                <Combobox
                  options={countries}
                  value={locationValue}
                  onChange={(val) => {
                    setValue("location", val);
                    handleInputChange();
                  }}
                  placeholder="Choose Location"
                />
                {(errors as any).location && (
                  <p className="text-red-500 text-xs mt-1">
                    {(errors as any).location?.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <div>
            {formData?.role == "creator" && (
              <h2 className="text-md font-medium text-white mb-4">
                Creator's Social Media
              </h2>
            )}
            {formData?.role == "brand" && (
              <h2 className="text-md font-medium text-white mb-4">
                Social Media
              </h2>
            )}
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
                  placeholder="Enter Instagram Profile Url"
                  {...register("instagram")}
                  className="border-gray-400 text-white bg-transparent rounded-full"
                />
                {errors.instagram && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.instagram?.message}
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
                  placeholder="Enter Facebook Profile Url"
                  {...register("facebook")}
                  className="border-gray-400 text-white bg-transparent rounded-full"
                />
                {errors.facebook && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.facebook?.message}
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
                  placeholder="Enter TikTok  Profile Url"
                  {...register("tiktok")}
                  className="border-gray-400 text-white bg-transparent rounded-full"
                />
                {errors.tiktok && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.tiktok?.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {formData?.role == "creator" && (
            <div className="space-y-2">
              <Label
                htmlFor="otherSocial"
                className="text-gray-100 font-light text-xs"
              >
                Other Social Profile
              </Label>
              <Input
                id="otherSocial"
                placeholder="Enter your Other Social Profile Url"
                {...register("otherSocial")}
                className="border-gray-400 text-white bg-transparent rounded-full"
              />
              {(errors as any).otherSocial && (
                <p className="text-red-500 text-xs mt-1">
                  {(errors as any).otherSocial?.message}
                </p>
              )}
            </div>
          )}

          {formData?.role == "brand" && (
            <div className="space-y-2">
              <Label
                htmlFor="otherSocial"
                className="text-gray-100 font-light text-xs"
              >
                Business Website
              </Label>
              <Input
                id="businessWebsite"
                placeholder="https://"
                {...register("businessWebsite")}
                className="border-gray-400 text-white bg-transparent rounded-full"
              />
              {(errors as any).businessWebsite && (
                <p className="text-red-500 text-xs mt-1">
                  {(errors as any).businessWebsite?.message}
                </p>
              )}
            </div>
          )}

          {formData?.role == "brand" && (
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-100 font-light text-xs">
                Business Description
              </Label>
              <Textarea
                id="businessDescription"
                placeholder="Enter description of your business"
                {...register("businessDescription")}
                className="border-gray-400 text-white bg-transparent rounded-200"
              />
              {(errors as any).businessDescription && (
                <p className="text-red-500 text-xs mt-1">
                  {(errors as any).businessDescription?.message}
                </p>
              )}
            </div>
          )}
          {formData.role === "creator" && (
            <div>
              <Label
                htmlFor="otherSocial"
                className="text-gray-100 font-light text-xs"
              >
                Enter No. Of Followers
              </Label>
              <Input
                id="followers"
                placeholder="Enter follower count"
                {...register("followers")}
                onChange={handleInputChange}
                className="border-gray-400 text-white bg-transparent rounded-full"
              />
            </div>
          )}
          <div className="space-y-4">
            <Label className="text-gray-100 font-light text-xs">
              Type of content you create
            </Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    toggleCategory(category);
                    if (showErrors) setShowErrors(false);
                  }}
                  className={`px-4 py-1 rounded-full text-sm ${
                    selectedCategories.includes(category)
                      ? "bg-epiclinx-teal text-black"
                      : "bg-epiclinx-semiteal text-black hover:bg-[#00e5c9] hover:transition-all hover:duration-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            {showErrors && selectedCategories.length === 0 && (
              <p className="text-red-500 text-xs mt-1">
                Please select at least one category
              </p>
            )}
          </div>

          <div className="flex justify-center !mt-16">
            <Button
              type="submit"
              className="rounded-full bg-epiclinx-teal hover:bg-epiclinx-teal/80 text-black px-6 py-3 transition-all w-full sm:w-auto sm:self-end"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting || isUploading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Please Wait ...
                </span>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Continue"
              )}
            </Button>
          </div>
          <p className="text-red-500 text-xs mt-1 flex justify-center">
            {Object.keys(errors).length ? "Form has errors" : ""}
          </p>
        </fieldset>
      </form>
    </div>
  );
}
