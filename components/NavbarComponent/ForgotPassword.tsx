"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiPost } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ForgotPasswordProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToSignIn: () => void;
  onBackToSignUp: () => void;
}

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm: React.FC<ForgotPasswordProps> = ({
  isOpen,
  onClose,
  onBackToSignIn,
  onBackToSignUp,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      const response:{resetUrl?: string, message: string} = await apiPost("/auth/forgot-password", data);
      toast({
        variant: "info",
        title: "Email sent if account exists",
        description:response.message,
        
      });
      // console.log(response.resetUrl);
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full bg-[#3c3c3c] text-white flex flex-col p-6 transition-transform duration-300 ease-in-out",
          "overflow-y-auto w-full md:w-1/2",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-400"></span>
          <X onClick={onClose} className="h-6 w-6 cursor-pointer" />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center h-full max-w-xl mx-auto w-full"
        >
          <h1 className="text-3xl font-medium mb-10">Forgot Password</h1>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-light">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className="w-full rounded-full bg-transparent border border-gray-600 px-4 py-3 text-white focus:outline-none focus:border-[#00e0ca]"
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-44 rounded-full bg-epiclinx-teal hover:bg-epiclinx-teal/80 text-black px-6 py-3 transition-all"
              disabled={loading}
            >
              {loading ? (
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
                  Sending...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBackToSignIn();
                }}
                className="text-epiclinx-teal hover:underline text-sm font-light"
              >
                Back to Sign In
              </button>
            </div>

            <div className="pt-0">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBackToSignUp();
                }}
                className="text-epiclinx-teal hover:underline text-sm font-light"
              >
                Don't have an account yet?
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
