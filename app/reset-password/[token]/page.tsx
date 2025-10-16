"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setError("");
    setLoading(true);

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Token Missing");
      setLoading(false);
      return;
    }

    try {
      await apiPost("/auth/reset-password", { token, password: newPassword });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Reset failed. Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            router.push("/");
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [success, router]);

  // 🔐 Basic strength indicator
  const passwordStrength =
    newPassword.length < 6
      ? "Weak"
      : newPassword.match(/[A-Z]/) &&
        newPassword.match(/\d/) &&
        newPassword.length >= 8
      ? "Strong"
      : "Medium";

  const strengthColor =
    passwordStrength === "Strong"
      ? "text-green-400"
      : passwordStrength === "Medium"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-white">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-center">Reset Password</h1>

        {success ? (
          <div className="text-center">
            <p className="text-green-400">✅ Password reset successful!</p>
            <p>
              Redirecting to login in{" "}
              <span className="font-bold">{countdown}</span> seconds...
            </p>
          </div>
        ) : (
          <>
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <div>
              <label className="block text-sm font-light mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-full bg-transparent border border-gray-600 px-4 py-3 text-white focus:outline-none focus:border-[#00e0ca]"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {newPassword && (
                <p className={`text-sm mt-1 ${strengthColor}`}>
                  Strength: {passwordStrength}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-light mb-1">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-full bg-transparent border border-gray-600 px-4 py-3 text-white focus:outline-none focus:border-[#00e0ca]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button
              className="w-full rounded-full bg-epiclinx-teal hover:bg-epiclinx-teal/80 text-black px-6 py-3 transition-all"
              onClick={handleReset}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
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
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
