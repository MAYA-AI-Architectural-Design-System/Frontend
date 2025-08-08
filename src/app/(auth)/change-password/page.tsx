"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Lock,
  Sun,
  Moon,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { finalImg, mayaLogoDark } from "@/assets/images";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "react-i18next";

function PremiumInput({
  id,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  label,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  error = false,
  theme = "light",
}: {
  id: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  error?: boolean;
  theme?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hasValue = value.length > 0;
  const inputClass =
    theme === "dark"
      ? "bg-transparent text-white border-gray-600 placeholder:text-gray-400 focus:border-white"
      : "bg-transparent text-black border-gray-300 placeholder:text-gray-500 focus:border-black";
  const errorClass = error ? "border-red-400 dark:border-red-500" : "";

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className={`text-sm font-semibold transition-all duration-300 ${
          isFocused || hasValue
            ? theme === "dark"
              ? "text-white"
              : "text-black"
            : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {label}
      </Label>
      <div
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Icon
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 z-10 ${
            isFocused || hasValue
              ? theme === "dark"
                ? "text-white"
                : "text-black"
              : isHovered
              ? "text-gray-600 dark:text-gray-300"
              : "text-gray-400 dark:text-gray-500"
          }`}
        />
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`pl-12 ${
            showPasswordToggle ? "pr-12" : "pr-4"
          } h-12 text-sm rounded-xl border-2 transition-all duration-300 relative z-10
            ${inputClass} ${errorClass} shadow-none focus:ring-2 focus:ring-black dark:focus:ring-white`}
          placeholder={placeholder}
          autoComplete={id}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 z-10 ${
              isFocused || hasValue
                ? theme === "dark"
                  ? "text-white"
                  : "text-black"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === "undefined") return;

      const token =
        localStorage.getItem("maya_token") || localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
          }/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("maya_token");
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("maya_token");
        localStorage.removeItem("token");
      }
    };

    checkAuth();
  }, []);

  const handleInputChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!form.currentPassword) {
      setError("Please enter your current password");
      setIsLoading(false);
      return;
    }

    if (form.newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (form.currentPassword === form.newPassword) {
      setError("New password cannot be the same as current password");
      setIsLoading(false);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const token =
        localStorage.getItem("maya_token") || localStorage.getItem("token");

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
        }/auth/change-password`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
            confirmPassword: form.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
      } else {
        setError(
          data.message || "Failed to change password. Please try again."
        );
      }
    } catch (error) {
      console.error("Change password error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div
        className={`h-screen w-full flex overflow-hidden ${
          theme === "dark" ? "dark bg-black" : "bg-white"
        }`}
      >
        <div className="w-full flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Authentication Required
              </h3>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                You must be logged in to change your password.
              </p>
            </div>
            <Button
              onClick={() => router.push("/login")}
              className="w-full h-12 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 hover:from-gray-800 hover:to-black dark:hover:from-gray-200 dark:hover:to-white text-white dark:text-black font-bold text-base transition-all duration-300 group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center justify-center">
                Sign In
              </span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen w-full flex overflow-hidden ${
        theme === "dark" ? "dark bg-black" : "bg-white"
      }`}
    >
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 h-full relative">
        <Image
          src={finalImg}
          alt="MAYA-AI Change Password Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`p-3 rounded-full backdrop-blur-md border transition-all duration-300 group hover:scale-110 ${
              theme === "dark"
                ? "bg-black/30 border-white/20 text-white hover:bg-black/50"
                : "bg-white/30 border-black/20 text-black hover:bg-white/50"
            }`}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            ) : (
              <Moon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            )}
          </button>
        </div>
        <div className="absolute inset-0 flex flex-col justify-end items-start w-full h-full px-12 pb-12 text-white z-10">
          <div className="flex flex-col items-start w-auto">
            <img
              src={mayaLogoDark.src}
              alt="Maya Logo"
              className="-mb-15 drop-shadow-xl"
              style={{ width: 200, height: 200 }}
            />
            <h1 className="text-4xl font-extrabold mb-1 tracking-tight drop-shadow-lg text-left">
              {t("start_journey")}
            </h1>
            <h2 className="text-2xl font-semibold mb-2 text-gray-200 drop-shadow text-left">
              {t("creating_design")}
            </h2>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 h-full flex flex-col bg-white dark:bg-black transition-colors duration-300 relative">
        <div className="flex justify-between items-center p-6 pb-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:from-black hover:to-gray-800 dark:hover:from-white dark:hover:to-gray-200 text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-black transition-all duration-500 font-semibold text-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:border-transparent shadow-sm hover:shadow-xl hover:scale-105 overflow-hidden"
          >
            <ArrowLeft className="w-4 h-4 group-hover:scale-110 group-hover:-translate-x-1 transition-all duration-300 relative z-10" />
            <span className="relative z-10 group-hover:tracking-wide transition-all duration-300">
              Back to Dashboard
            </span>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Change Password
              </h2>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Update your password to keep your account secure.
              </p>
            </div>

            {isSuccess ? (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Password Changed Successfully
                  </h3>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Your password has been updated.
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="w-full h-12 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 hover:from-gray-800 hover:to-black dark:hover:from-gray-200 dark:hover:to-white text-white dark:text-black font-bold text-base transition-all duration-300 group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Back to Dashboard
                  </span>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <PremiumInput
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={(value) =>
                    handleInputChange("currentPassword", value)
                  }
                  placeholder="Enter your current password"
                  icon={Lock}
                  label="Current Password"
                  showPasswordToggle
                  showPassword={showCurrentPassword}
                  onTogglePassword={() =>
                    setShowCurrentPassword(!showCurrentPassword)
                  }
                  theme={theme}
                  error={!!error}
                />

                <PremiumInput
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={form.newPassword}
                  onChange={(value) => handleInputChange("newPassword", value)}
                  placeholder="Enter your new password"
                  icon={Lock}
                  label="New Password"
                  showPasswordToggle
                  showPassword={showNewPassword}
                  onTogglePassword={() => setShowNewPassword(!showNewPassword)}
                  theme={theme}
                  error={!!error}
                />

                <PremiumInput
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  placeholder="Confirm your new password"
                  icon={Lock}
                  label="Confirm Password"
                  showPasswordToggle
                  showPassword={showConfirmPassword}
                  onTogglePassword={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  theme={theme}
                  error={!!error}
                />

                {error && (
                  <div className="text-sm text-red-500 text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 hover:from-gray-800 hover:to-black dark:hover:from-gray-200 dark:hover:to-white text-white dark:text-black font-bold text-base transition-all duration-300 group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02]"
                  disabled={isLoading || isAuthenticated === null}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? "Changing..." : "Change Password"}
                  </span>
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
