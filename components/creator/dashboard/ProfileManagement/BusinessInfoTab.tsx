"use client";
import { useEffect, useState } from "react";
import BusinessInfoForm from "@/components/creator/become-creator/BusinessInfoForm";
import { apiPost } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export default function BusinessInfoTab() {
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname.split("/");
  const pathRole = parts[2];

  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [formData, setFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(user);
      // Redirect if user's role doesn't match the route
      if (user?.role && user.role !== pathRole) {
        parts[2] = user.role;
        const newPathName = parts.join("/");
        router.push(newPathName);
      }
    }
  }, [user]);

  const handleSave = async (updatedData: any) => {
    setIsSaving(true);
    try {
      await apiPost("/user", updatedData);
      toast({
        variant: "success",
        title: "Profile updated",
        description: "Your information has been saved.",
      });
      updateUser(updatedData);
      router.push(`/dashboard/${pathRole}/profile`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!formData)
    return <p className="text-white text-center">Loading user info...</p>;

  return (
    <div className="min-h-screen">
      <div className="md:max-w-4xl mx-auto p-6 md:mt-10">
        <BusinessInfoForm
          formData={formData}
          isSubmitting={isSaving}
          isEditing={true}
          onSave={handleSave}
          updateFormData={(data) =>
            setFormData((prev: any) => ({ ...prev, ...data }))
          }
        />
      </div>
    </div>
  );
}
