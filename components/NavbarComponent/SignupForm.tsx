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
import { useRouter } from "next/navigation";

// import { useToast } from "@/hooks/use-toast";

// const { toast } = useToast();

interface SignUpFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
  onSwitchToForgotPassword: () => void;
}

// Zod schema
const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpForm: React.FC<SignUpFormProps> = ({
  isOpen,
  onClose,
  onSwitchToSignIn,
  onSwitchToForgotPassword,
}) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"creator" | "brand">("creator");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        role, // includes "creator" or "brand"
      };

      const response = await apiPost<{ token: string; user: any }>(
        "/auth/register",
        payload
      );

      console.log("✅ Registration successful", response);

      // Save user and token to localStorage
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);

      // Close the modal
      onClose();
      router.push("/dashboard/" + role);
    } catch (error: any) {
      console.error("❌ Registration failed:", error);

      // toast({
      //   variant: "destructive",
      //   title: "Sign Up failed",
      //   description: error.message || "Something went wrong",
      // });
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSwitchToSignIn = () => {
    onClose(); // close current modal
    onSwitchToSignIn(); // open signin modal
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
          <h1 className="text-3xl font-medium mb-10">Sign Up</h1>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-light">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                {...register("email")}
                className="w-full rounded-full bg-transparent border border-gray-600 px-4 py-3 text-white focus:outline-none focus:border-[#00e0ca]"
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
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

            <div className="space-y-2">
              <label className="block text-sm font-light">
                What describes you best?
              </label>
              <div className="inline-flex rounded-full bg-gray-700 p-1 w-full max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => setRole("creator")}
                  className={cn(
                    "flex-1 py-2 text-sm rounded-full transition-all",
                    role === "creator"
                      ? "bg-epiclinx-teal text-black font-semibold"
                      : "text-white hover:bg-gray-600"
                  )}
                >
                  I'm Creator
                </button>
                <button
                  type="button"
                  onClick={() => setRole("brand")}
                  className={cn(
                    "flex-1 py-2 text-sm rounded-full transition-all",
                    role === "brand"
                      ? "bg-epiclinx-teal text-black font-semibold"
                      : "text-white hover:bg-gray-600"
                  )}
                >
                  I'm Brand
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="rounded-full bg-epiclinx-teal hover:bg-epiclinx-teal/80 text-black px-6 py-3 transition-all w-full sm:w-auto sm:self-end"
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
                "Sign Up"
              )}
              </Button>
            </div>

            <div className="pt-4">
              <p className="text-white font-light">
                Already have an account?{" "}
                <Link
                  href="#"
                  onClick={handleSwitchToSignIn}
                  className="text-epiclinx-teal hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
            <div className="pt-0 mt-0">
              <p className="text-white font-light">
                Have an account, but password lost?{" "}
                <Link
                  href="#"
                  onClick={handleSwitchToForgotPassword}
                  className="text-epiclinx-teal hover:underline"
                >
                  Reset Here
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUpForm;
