"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { apiPost } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

interface SignInFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
  onSwitchToForgotPassword: () => void;
}

// Zod schema
const signInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInForm: React.FC<SignInFormProps> = ({
  isOpen,
  onClose,
  onSwitchToSignUp,
  onSwitchToForgotPassword,
}) => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);
    try {
      const response = await apiPost<{
        user: any;
      }>("/auth/login", data);
      console.log("Login successful", response);
      useAuthStore.getState().setUser(response.user);
      onClose();
      router.push("/dashboard/" + response.user.role);
      
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  // Close form on Escape key and manage scroll
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSwitchToSignUp = () => {
    onClose(); // close current modal
    onSwitchToSignUp(); // open signup modal
  };

  const handleSwitchToForgotPassword = () => {
    onClose(); // close current modal
    onSwitchToForgotPassword(); // open Forgot Password modal
  };

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
          <h1 className="text-3xl font-medium mb-10">Sign In</h1>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-light">
                Username
              </label>
              <input
                id="username"
                type="username"
                placeholder="Username"
                {...register("username")}
                className="w-full rounded-full bg-transparent border border-gray-600 px-4 py-3 text-white focus:outline-none focus:border-[#00e0ca]"
              />
              {errors.username && (
                <p className="text-sm text-red-400">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-light">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  {...register("password")}
                  className="w-full rounded-full bg-transparent border border-gray-600 px-4 py-3 text-white focus:outline-none focus:border-[#00e0ca]"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Link
                href="#"
                onClick={handleSwitchToForgotPassword}
                className="text-epiclinx-teal text-sm hover:underline font-light"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-32 rounded-full bg-epiclinx-teal hover:bg-epiclinx-teal/80 text-black px-6 py-3 transition-all"
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
                  Loading...
                </span>
              ) : (
                "Log In"
              )}
            </Button>

            <div className="pt-4">
              <p className="text-white font-light">
                Don't have an account yet?{" "}
                <button
                  type="button"
                  onClick={handleSwitchToSignUp}
                  className="text-epiclinx-teal hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignInForm;
