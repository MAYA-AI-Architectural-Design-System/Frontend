"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Github,
  Mail,
  User,
  Lock,
  ArrowRight,
  Sun,
  Moon,
  LogIn,
} from "lucide-react";
import { finalImg, mayaLogoDark } from "@/assets/images";
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
  icon: any;
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

  // Clean input styling - no background colors, just borders and text
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

export default function RegisterPage() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation("common");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (
      typeof window !== "undefined" &&
      (localStorage.getItem("maya_token") || localStorage.getItem("token"))
    ) {
      router.replace("/dashboard");
    }
  }, [router]);

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
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
        }/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem("maya_token", data.token);
          localStorage.setItem("token", data.token); // Keep both for compatibility
        }
        router.push("/dashboard");
      } else {
        let msg = "Registration failed";
        try {
          const data = await res.json();
          msg = data.message || msg;
        } catch {}
        setError(msg);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Social login handlers
  const handleGoogle = () => {
    window.location.href = `${
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
    }/auth/google`;
  };
  const handleGithub = () => {
    window.location.href = `${
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
    }/auth/github`;
  };

  if (!mounted) return null;

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
          alt="MAYA-AI Register Background"
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
              className="-mb-15  drop-shadow-xl"
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

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 h-full flex flex-col bg-white dark:bg-black transition-colors duration-300 relative">
        {/* Top Bar with Animated Login Button */}
        <div className="flex justify-between items-center p-6 pb-4">
          {/* Animated Login Button */}
          <button
            onClick={() => router.push("/login")}
            className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:from-black hover:to-gray-800 dark:hover:from-white dark:hover:to-gray-200 text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-black transition-all duration-500 font-semibold text-sm rounded-xl border border-gray-200 dark:border-gray-700 hover:border-transparent shadow-sm hover:shadow-xl hover:scale-105 overflow-hidden"
            aria-label="Go to login"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
            <LogIn className="w-4 h-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 relative z-10" />
            <span className="relative z-10 group-hover:tracking-wide transition-all duration-300">
              {t("login")}
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
            <div className="text-center mb-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {t("create_account")}
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <PremiumInput
                id="name"
                type="text"
                value={formData.name}
                onChange={(value) => handleInputChange("name", value)}
                placeholder="Enter your full name"
                icon={User}
                label="Full Name"
                theme={theme}
              />

              <PremiumInput
                id="email"
                type="email"
                value={formData.email}
                onChange={(value) => handleInputChange("email", value)}
                placeholder={t("enter_your_email_address")}
                icon={Mail}
                label={t("email_address")}
                theme={theme}
              />

              <PremiumInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(value) => handleInputChange("password", value)}
                placeholder={t("create_strong_password")}
                icon={Lock}
                label={t("password")}
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                theme={theme}
              />
              <PremiumInput
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(value) =>
                  handleInputChange("confirmPassword", value)
                }
                placeholder={t("confirm_your_password")}
                icon={Lock}
                label={t("confirm_password")}
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                theme={theme}
              />

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-3 p-4 rounded-xl bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-900/50 dark:to-transparent border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:from-gray-50 dark:hover:from-gray-900 mt-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 mt-1 text-black border-2 border-gray-300 dark:border-gray-600 rounded-md focus:ring-black focus:ring-2 bg-white dark:bg-gray-900 transition-all duration-200"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                >
                  {t("i_agree_to_terms")}{" "}
                  <button
                    type="button"
                    className="text-black dark:text-white font-semibold hover:underline transition-all duration-200"
                  >
                    {t("terms_conditions")}
                  </button>{" "}
                  {t("and")}{" "}
                  <button
                    type="button"
                    className="text-black dark:text-white font-semibold hover:underline transition-all duration-200"
                  >
                    {t("privacy_policy")}
                  </button>
                </Label>
              </div>

              {/* Submit Button */}
              {error && (
                <div className="text-sm text-red-500 text-center">{error}</div>
              )}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 hover:from-gray-800 hover:to-black dark:hover:from-gray-200 dark:hover:to-white text-white dark:text-black font-bold text-base transition-all duration-300 group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] mt-2"
                disabled={isLoading}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? t("creating_account") : t("create_account")}
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black dark:from-gray-100 dark:to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>

              {/* Divider */}
              <div className="relative py-4">
                <Separator className="bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-black px-4 text-gray-500 dark:text-gray-400 font-medium text-xs">
                  {t("or_continue_with")}
                </span>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4 pt-2 pb-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 text-xs border-2 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-300 group rounded-xl font-semibold text-black dark:text-white bg-gradient-to-r from-white to-gray-50 dark:from-black dark:to-gray-900 shadow-sm hover:shadow-md flex items-center justify-center"
                  onClick={handleGoogle}
                  disabled={isLoading}
                >
                  <svg
                    className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {t("google")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 text-xs border-2 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-300 group rounded-xl font-semibold text-black dark:text-white bg-gradient-to-r from-white to-gray-50 dark:from-black dark:to-gray-900 shadow-sm hover:shadow-md flex items-center justify-center"
                  onClick={handleGithub}
                  disabled={isLoading}
                >
                  <Github className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  {t("github")}
                </Button>
              </div>
            </form>
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
