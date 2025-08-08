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
import { useRouter, useSearchParams } from "next/navigation";
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

// Password strength indicator component
function PasswordStrengthIndicator({ password }: { password: string }) {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const getColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    if (strength <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getText = () => {
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Medium";
    if (strength <= 4) return "Strong";
    return "Very Strong";
  };

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= strength ? getColor() : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${getColor().replace("bg-", "text-")}`}>
        Password strength: {getText()}
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  // Animate left text on mount
  useEffect(() => {
    if (!mounted) return;
    const animateElements = () => {
      const logo = document.getElementById("maya-logo");
      const title = document.getElementById("maya-title");
      const subtitle = document.getElementById("maya-subtitle");
      if (logo) setTimeout(() => logo.classList.add("animate-slide-up"), 100);
      if (title) setTimeout(() => title.classList.add("animate-slide-up"), 300);
      if (subtitle)
        setTimeout(() => subtitle.classList.add("animate-slide-up"), 500);
    };
    animateElements();
  }, [mounted]);

  const handleInputChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate passwords
    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
        }/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password: form.password,
            confirmPassword: form.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
      } else {
        setError(data.message || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render until mounted to avoid hydration issues
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

  // Show error state if token is missing
  if (!token) {
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
            alt="MAYA-AI Reset Password Background"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0 flex flex-col justify-end items-start w-full h-full px-12 pb-12 text-white z-10"
            style={{ minHeight: "100%" }}
          >
            <div className="flex flex-col items-start w-auto animate-fade-in">
              <img
                id="maya-logo"
                src={mayaLogoDark.src}
                alt="Maya Logo"
                className="-mb-15 drop-shadow-xl"
                style={{ width: 200, height: 200 }}
              />
              <h1
                id="maya-title"
                className="text-4xl font-extrabold mb-1 tracking-tight drop-shadow-lg text-left"
                style={{ letterSpacing: "-0.03em" }}
              >
                {t("start_journey")}
              </h1>
              <h2
                id="maya-subtitle"
                className="text-2xl font-semibold mb-2 text-gray-200 drop-shadow text-left"
                style={{ letterSpacing: "-0.01em" }}
              >
                {t("creating_design")}
              </h2>
            </div>
          </div>
        </div>
        {/* Right Panel - Error State */}
        <div className="w-full lg:w-1/2 h-full flex flex-col bg-white dark:bg-black transition-colors duration-300 relative">
          <div className="flex justify-between items-center p-6 pb-4">
            <button
              onClick={() => router.push("/login")}
              className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:from-black hover:to-gray-800 dark:hover:from-white dark:hover:to-gray-200 text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-black transition-all duration-500 font-semibold text-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:border-transparent shadow-sm hover:shadow-xl hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
              <ArrowLeft className="w-4 h-4 group-hover:scale-110 group-hover:-translate-x-1 transition-all duration-300 relative z-10" />
              <span className="relative z-10 group-hover:tracking-wide transition-all duration-300">
                Back to Login
              </span>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center px-6 pb-6">
            <div className="w-full max-w-md text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Invalid Reset Link
                </h3>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {error}
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push("/forgot-password")}
                  className="w-full h-12 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 hover:from-gray-800 hover:to-black dark:hover:from-gray-200 dark:hover:to-white text-white dark:text-black font-bold text-base transition-all duration-300 group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Request New Reset Link
                  </span>
                </Button>
                <Link
                  href="/login"
                  className={`block text-sm font-medium underline ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Back to Login
                </Link>
              </div>
            </div>
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
          alt="MAYA-AI Reset Password Background"
          fill
          className="object-cover"
          priority
        />
        {/* Theme Toggle in Image Overlay */}
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`p-3 rounded-full backdrop-blur-md border transition-all duration-300 group hover:scale-110 ${
              theme === "dark"
                ? "bg-black/30 border-white/20 text-white hover:bg-black/50"
                : "bg-white/30 border-black/20 text-black hover:bg-white/50"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            ) : (
              <Moon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            )}
          </button>
        </div>
        <div
          className="absolute inset-0 flex flex-col justify-end items-start w-full h-full px-12 pb-12 text-white z-10"
          style={{ minHeight: "100%" }}
        >
          <div className="flex flex-col items-start w-auto animate-fade-in">
            {/* Logo at bottom left */}
            <img
              id="maya-logo"
              src={mayaLogoDark.src}
              alt="Maya Logo"
              className="-mb-15 drop-shadow-xl"
              style={{ width: 200, height: 200 }}
            />
            <h1
              id="maya-title"
              className="text-4xl font-extrabold mb-1 tracking-tight drop-shadow-lg text-left"
              style={{ letterSpacing: "-0.03em" }}
            >
              {t("start_journey")}
            </h1>
            <h2
              id="maya-subtitle"
              className="text-2xl font-semibold mb-2 text-gray-200 drop-shadow text-left"
              style={{ letterSpacing: "-0.01em" }}
            >
              {t("creating_design")}
            </h2>
          </div>
        </div>
      </div>
      {/* Right Panel - Reset Password Form */}
      <div className="w-full lg:w-1/2 h-full flex flex-col bg-white dark:bg-black transition-colors duration-300 relative">
        {/* Top Bar with Back Button */}
        <div className="flex justify-between items-center p-6 pb-4">
          {/* Back to Login Button */}
          <button
            onClick={() => router.push("/login")}
            className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:from-black hover:to-gray-800 dark:hover:from-white dark:hover:to-gray-200 text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-black transition-all duration-500 font-semibold text-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:border-transparent shadow-sm hover:shadow-xl hover:scale-105 overflow-hidden"
            aria-label="Back to login"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
            <ArrowLeft className="w-4 h-4 group-hover:scale-110 group-hover:-translate-x-1 transition-all duration-300 relative z-10" />
            <span className="relative z-10 group-hover:tracking-wide transition-all duration-300">
              Back to Login
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700 ease-out"></div>
          </button>
          {/* Mobile Theme Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 rounded-lg border transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-900 border-gray-700 hover:bg-gray-800 text-yellow-400"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-600"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        {/* Form Content */}
        <div className="flex-1 flex items-center justify-center px-6 pb-6">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {t("reset_password")}
              </h2>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t("enter_new_password_below")}
              </p>
            </div>

            {isSuccess ? (
              /* Success State */
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t("password_reset_successfully")}
                  </h3>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {t("password_updated_message")}
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full h-12 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 hover:from-gray-800 hover:to-black dark:hover:from-gray-200 dark:hover:to-white text-white dark:text-black font-bold text-base transition-all duration-300 group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {t("sign_in")}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black dark:from-gray-100 dark:to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </div>
            ) : (
              /* Form State */
              <form onSubmit={handleSubmit} className="space-y-6">
                <PremiumInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(value) => handleInputChange("password", value)}
                  placeholder={t("enter_new_password")}
                  icon={Lock}
                  label={t("new_password")}
                  showPasswordToggle
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  theme={theme}
                  error={!!error}
                />

                <PasswordStrengthIndicator password={form.password} />

                <PremiumInput
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  placeholder={t("confirm_new_password")}
                  icon={Lock}
                  label={t("confirm_password")}
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 hover:from-gray-800 hover:to-black dark:hover:from-gray-200 dark:hover:to-white text-white dark:text-black font-bold text-base transition-all duration-300 group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? t("resetting") : t("reset_password")}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black dark:from-gray-100 dark:to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>

                <div
                  className={`text-sm text-center ${
                    theme === "dark" ? "text-white/80" : "text-gray-600"
                  }`}
                >
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className={`font-semibold underline ${
                      theme === "dark" ? "text-[#F5F5F5]" : "text-black"
                    }`}
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      {/* Animation Styles */}
      <style jsx>{`
        .animate-slide-up {
          opacity: 1 !important;
          transform: translateY(0) !important;
          transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        #maya-logo {
          transition-delay: 0.1s;
        }
        #maya-title {
          transition-delay: 0.3s;
        }
        #maya-subtitle {
          transition-delay: 0.5s;
        }
      `}</style>
    </div>
  );
}
