"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { LogOut, ChevronDown, Sun, Moon, Search, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mayaLogoLight, mayaLogoDark } from "@/assets/images";
import { useLanguage } from "@/app/contexts/language-context";
import { useTranslation } from "react-i18next";

// Auth utilities
function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("maya_token") || localStorage.getItem("token");
  }
  return null;
}

function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("maya_token");
    localStorage.removeItem("token");
  }
}

interface User {
  name: string;
  email: string;
}

interface UserHeaderProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function UserHeader({
  title = "Maya Dashboard",
  subtitle = "",
  showSearch = false,
  searchQuery = "",
  onSearchChange,
}: UserHeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user profile on mount - without automatic redirects
  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        const token = getToken();
        if (!token) {
          console.log("No token found in UserHeader");
          return;
        }

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
          }/users/profile`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            console.log("Token expired or invalid in UserHeader");
            removeToken();
            return;
          }
          console.error("Failed to fetch profile");
          return;
        }

        const userData = await response.json();
        if (isMounted) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array to run only once

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!mounted) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isDark
          ? "bg-black/40 border-white/10 shadow-2xl shadow-white/5 backdrop-blur-2xl"
          : "bg-white/40 border-black/10 shadow-2xl shadow-black/5 backdrop-blur-2xl"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className={`flex items-center ${showSearch ? "gap-2" : "gap-4"}`}>
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-4 group flex-shrink-0">
            <img
              src={isDark ? mayaLogoDark.src : mayaLogoLight.src}
              alt="Maya Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-26 lg:h-26 object-contain drop-shadow-2xl transition-all duration-300"
            />
          </div>

          {/* Title & Subtitle - Center */}
          <div
            className={`flex flex-col items-center px-2 sm:px-4 ${
              showSearch ? "flex-1" : "flex-1"
            }`}
          >
            <h1
              className={`text-lg sm:text-xl lg:text-2xl font-black tracking-tight mb-1 text-center ${
                isDark ? "text-white" : "text-black"
              }`}
              style={{ letterSpacing: "0.03em" }}
            >
              {title}
            </h1>
            <p
              className={`text-xs sm:text-sm font-medium text-center ${
                isDark ? "text-white/60" : "text-black/60"
              }`}
            >
              {subtitle}
            </p>
          </div>

          {/* Search Bar - Only show if showSearch is true */}
          {showSearch && (
            <div className="hidden sm:flex flex-1 max-w-md lg:max-w-2xl mx-4 lg:mx-8">
              <div className="relative group w-full">
                <Search
                  className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                    isDark
                      ? "text-white/40 group-focus-within:text-white"
                      : "text-black/40 group-focus-within:text-black"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className={`w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-2 sm:py-3 lg:py-4 rounded-xl lg:rounded-2xl border-2 transition-all duration-300 text-sm sm:text-base font-medium placeholder:font-normal ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white placeholder-white/40 focus:bg-white/10 focus:border-white/30"
                      : "bg-black/5 border-black/10 text-black placeholder-black/40 focus:bg-black/10 focus:border-black/30"
                  } focus:outline-none focus:ring-0`}
                />
              </div>
            </div>
          )}

          {/* User Profile and Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-8 flex-shrink-0">
            {/* Language Selector */}
            <div className="relative group">
              <button
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-colors border ${
                  isDark
                    ? "border-gray-700 hover:bg-gray-800 text-white bg-gray-900"
                    : "border-gray-200 hover:bg-gray-50 text-black bg-white"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:block">
                  {language.toUpperCase()}
                </span>
                <span className="text-sm font-medium sm:hidden">
                  {language.toUpperCase()}
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <div
                className={`absolute top-full right-0 mt-2 border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[140px] ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                {[
                  { code: "EN", name: t("english") },
                  { code: "AM", name: t("amharic") },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code.toLowerCase())}
                    className={`block w-full text-left px-4 py-3 text-sm first:rounded-t-xl last:rounded-b-xl transition-colors ${
                      isDark
                        ? "hover:bg-gray-700 text-white"
                        : "hover:bg-gray-50 text-black"
                    }`}
                  >
                    <span className="hidden sm:inline">{lang.name}</span>
                    <span className="sm:hidden">{lang.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`h-10 sm:h-12 lg:h-14 px-2 sm:px-3 lg:px-4 rounded-xl lg:rounded-2xl transition-all duration-300 hover:scale-105 ${
                    isDark ? "hover:bg-white/10" : "hover:bg-black/10"
                  }`}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-white/20">
                      <AvatarImage
                        src="/placeholder.svg"
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback
                        className={`font-bold text-xs sm:text-sm ${
                          isDark ? "bg-white text-black" : "bg-black text-white"
                        }`}
                      >
                        {user ? getUserInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden sm:block">
                      <div
                        className={`text-xs sm:text-sm font-semibold ${
                          isDark ? "text-white" : "text-black"
                        }`}
                      >
                        {user ? user.name : "Loading..."}
                      </div>
                      <div
                        className={`text-xs ${
                          isDark ? "text-white/60" : "text-black/60"
                        }`}
                      >
                        {user ? user.email : "..."}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 sm:w-4 sm:h-4 ${
                        isDark ? "text-white/60" : "text-black/60"
                      }`}
                    />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={`w-56 sm:w-64 rounded-xl lg:rounded-2xl border-2 shadow-2xl ${
                  isDark
                    ? "bg-black/95 border-white/10 backdrop-blur-xl"
                    : "bg-white/95 border-black/10 backdrop-blur-xl"
                }`}
                align="end"
              >
                <DropdownMenuLabel className="p-3 sm:p-4">
                  <div className="space-y-2">
                    <p
                      className={`text-sm font-bold ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      {user?.name || "User"}
                    </p>
                    <p
                      className={`text-xs ${
                        isDark ? "text-white/60" : "text-black/60"
                      }`}
                    >
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator
                  className={isDark ? "bg-white/10" : "bg-black/10"}
                />
                <DropdownMenuItem
                  className="cursor-pointer p-2 sm:p-3 m-1 sm:m-2 rounded-lg sm:rounded-xl text-red-500 hover:bg-red-500/10 transition-all"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 sm:mr-3 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDark
                  ? "hover:bg-white/10 text-white"
                  : "hover:bg-black/10 text-black"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
