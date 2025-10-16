// creator/become-creator/AccountInfoForm.tsx


"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const accountInfoSchema = z
  .object({
    accountUsername: z
      .string()
      .min(3, "Username must be at least 3 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type AccountInfoFormValues = z.infer<typeof accountInfoSchema>;

interface AccountInfoFormProps {
  formData: any;
  updateFormData: (data: any) => void;
  onNext: (dataFromChild: any) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function AccountInfoForm({
  formData,
  updateFormData,
  onNext,
  onBack,
  isSubmitting,
}: AccountInfoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountInfoFormValues>({
    resolver: zodResolver(accountInfoSchema),
    defaultValues: {
      accountUsername: formData.accountUsername,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    },
  });

  const onSubmit = (data: AccountInfoFormValues) => {
    updateFormData(data);
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2 w-full">
        <Label htmlFor="accountUsername" className="text-gray-300 text-xs">
          Username
        </Label>
        <Input
          id="accountUsername"
          placeholder="Username"
          {...register("accountUsername")}
          className="bg-transparent border-gray-400 text-white rounded-full w-full"
        />
        {errors.accountUsername && (
          <p className="text-red-500 text-xs mt-1">
            {errors.accountUsername.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300 text-xs">
            Create Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter password"
            {...register("password")}
            className="bg-transparent border-gray-400 text-white rounded-full"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-300 text-xs">
            Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            {...register("confirmPassword")}
            className="bg-transparent border-gray-400 text-white rounded-full"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4 !mt-16">
        <button type="button" onClick={onBack} className="back-button">
          Back
        </button>
        <Button
          type="submit"
          className="rounded-full bg-epiclinx-teal hover:bg-epiclinx-teal/80 text-black px-6 py-3 transition-all w-full sm:w-auto sm:self-end"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
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
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </form>
  );
}
