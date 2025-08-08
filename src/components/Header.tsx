"use client";
import {
  Menu,
  X,
  Globe,
  Download,
  User,
  UserPlus,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { mayaLogoDark, mayaLogoLight } from "@/assets/images";
import { useLanguage } from "@/app/contexts/language-context";
import { usePreloader } from "@/app/contexts/preloader-context";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { startLoading } = usePreloader();
  const { t } = useTranslation("common");

  const handleNav = async (path: string) => {
    setIsMenuOpen(false);

    // Start preloader
    startLoading();

    // Navigate immediately - preloader will show for 2 seconds
    router.push(path);
  };

  const languages = [
    { code: "EN", name: t("english") },
    { code: "AM", name: t("amharic") },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 p-4 pt-6 backdrop-blur-lg border-b shadow-sm transition-colors duration-300 ${
        isDarkMode
          ? "bg-black/70 border-gray-800"
          : "bg-white/70 border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <img
            src={isDarkMode ? mayaLogoDark.src : mayaLogoLight.src}
            alt="Maya logo"
            width={120}
            height={120}
            style={{ cursor: "pointer" }}
            onClick={() => handleNav("/")}
          />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => handleNav("/")}
              className={`capitalize font-semibold text-lg transition-all duration-300 relative px-3 py-1 rounded-xl ${
                pathname === "/"
                  ? isDarkMode
                    ? "bg-white/20 text-white"
                    : "bg-black/10 text-black"
                  : isDarkMode
                  ? "hover:bg-white/10 hover:text-white text-gray-300"
                  : "hover:bg-black/5 hover:text-black text-gray-700"
              }`}
            >
              {t("home")}
            </button>
            <button
              onClick={() => handleNav("/service")}
              className={`capitalize font-semibold text-lg transition-all duration-300 relative px-3 py-1 rounded-xl ${
                pathname === "/service"
                  ? isDarkMode
                    ? "bg-white/20 text-white"
                    : "bg-black/10 text-black"
                  : isDarkMode
                  ? "hover:bg-white/10 hover:text-white text-gray-300"
                  : "hover:bg-black/5 hover:text-black text-gray-700"
              }`}
            >
              {t("service")}
            </button>
            <button
              onClick={() => handleNav("/gallery")}
              className={`capitalize font-semibold text-lg transition-all duration-300 relative px-3 py-1 rounded-xl ${
                pathname === "/gallery"
                  ? isDarkMode
                    ? "bg-white/20 text-white"
                    : "bg-black/10 text-black"
                  : isDarkMode
                  ? "hover:bg-white/10 hover:text-white text-gray-300"
                  : "hover:bg-black/5 hover:text-black text-gray-700"
              }`}
            >
              {t("gallery")}
            </button>
            <button
              onClick={() => handleNav("/contact")}
              className={`capitalize font-semibold text-lg transition-all duration-300 relative px-3 py-1 rounded-xl ${
                pathname === "/contact"
                  ? isDarkMode
                    ? "bg-white/20 text-white"
                    : "bg-black/10 text-black"
                  : isDarkMode
                  ? "hover:bg-white/10 hover:text-white text-gray-300"
                  : "hover:bg-black/5 hover:text-black text-gray-700"
              }`}
            >
              {t("contact")}
            </button>
            <button
              onClick={() => handleNav("/about")}
              className={`capitalize font-semibold text-lg transition-all duration-300 relative px-3 py-1 rounded-xl ${
                pathname === "/about"
                  ? isDarkMode
                    ? "bg-white/20 text-white"
                    : "bg-black/10 text-black"
                  : isDarkMode
                  ? "hover:bg-white/10 hover:text-white text-gray-300"
                  : "hover:bg-black/5 hover:text-black text-gray-700"
              }`}
            >
              {t("about")}
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(isDarkMode ? "light" : "dark")}
              className={`p-3 rounded-xl transition-all duration-300 border ${
                isDarkMode
                  ? "border-gray-700 hover:bg-gray-800 bg-gray-900"
                  : "border-gray-200 hover:bg-gray-50 bg-white"
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 text-gray-600" />
              )}
            </button>

            {/* Language Selector */}
            <div className="relative group">
              <button
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors border ${
                  isDarkMode
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
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code.toLowerCase())}
                    className={`block w-full text-left px-4 py-3 text-sm first:rounded-t-xl last:rounded-b-xl transition-colors ${
                      isDarkMode
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

            {/* Download Software - Icon Only */}
            <Button
              variant="outline"
              size="sm"
              className={`p-3 rounded-xl transition-colors border ${
                isDarkMode
                  ? "bg-gray-900 border-gray-700 hover:bg-gray-800 text-white"
                  : "bg-white border-gray-200 hover:bg-gray-50 text-black"
              }`}
              onClick={() => handleNav("/soft-download")}
            >
              <Download className="w-4 h-4" />
            </Button>

            {/* Login */}
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                isDarkMode
                  ? "hover:bg-gray-800 text-white"
                  : "hover:bg-gray-50 text-black"
              }`}
              onClick={() => handleNav("/login")}
            >
              <User className="w-4 h-4" />
              <span className="font-medium">Login</span>
            </Button>

            {/* Sign Up */}
            <Button
              size="sm"
              className={`flex items-center space-x-2 px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
              onClick={() => handleNav("/register")}
            >
              <UserPlus className="w-4 h-4" />
              <span className="font-medium">Sign Up</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
            }`}
          >
            {isMenuOpen ? (
              <X
                className={`w-6 h-6 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              />
            ) : (
              <Menu
                className={`w-6 h-6 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`lg:hidden border-t shadow-lg transition-colors duration-300 ${
            isDarkMode ? "bg-white border-gray-200" : "bg-white border-gray-100"
          }`}
        >
          <div className="px-6 py-8 space-y-6">
            {/* Header with Logo and Close Button */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img
                  src={isDarkMode ? mayaLogoDark.src : mayaLogoLight.src}
                  alt="Maya logo"
                  width={40}
                  height={40}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleNav("/")}
                />
                <div>
                  <div className="font-bold text-lg text-black">MayAi</div>
                  <div className="text-sm text-gray-600">Architectural</div>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? "hover:bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <X className="w-6 h-6 text-black" />
              </button>
            </div>

            {/* Theme Toggle Mobile */}
            <div className="flex items-center justify-start pb-4">
              <button
                onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                className={`p-3 rounded-lg transition-colors border ${
                  isDarkMode
                    ? "border-gray-300 hover:bg-gray-50 bg-white"
                    : "border-gray-200 hover:bg-gray-50 bg-white"
                }`}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-gray-600" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2">
              <button
                onClick={() => handleNav("/")}
                className={`block w-full text-left capitalize font-medium py-4 px-4 transition-colors text-lg rounded-xl ${
                  pathname === "/"
                    ? "bg-gray-100 text-black"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {t("home")}
              </button>
              <button
                onClick={() => handleNav("/service")}
                className={`block w-full text-left capitalize font-medium py-4 px-4 transition-colors text-lg rounded-xl ${
                  pathname === "/service"
                    ? "bg-gray-100 text-black"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {t("service")}
              </button>
              <button
                onClick={() => handleNav("/gallery")}
                className={`block w-full text-left capitalize font-medium py-4 px-4 transition-colors text-lg rounded-xl ${
                  pathname === "/gallery"
                    ? "bg-gray-100 text-black"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {t("gallery")}
              </button>
              <button
                onClick={() => handleNav("/contact")}
                className={`block w-full text-left capitalize font-medium py-4 px-4 transition-colors text-lg rounded-xl ${
                  pathname === "/contact"
                    ? "bg-gray-100 text-black"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {t("contact")}
              </button>
              <button
                onClick={() => handleNav("/about")}
                className={`block w-full text-left capitalize font-medium py-4 px-4 transition-colors text-lg rounded-xl ${
                  pathname === "/about"
                    ? "bg-gray-100 text-black"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {t("about")}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-4">
              <Button
                variant="outline"
                size="sm"
                className={`w-full justify-center border-2 transition-colors ${
                  isDarkMode
                    ? "border-black text-black hover:bg-black hover:text-white bg-white"
                    : "border-black text-black hover:bg-black hover:text-white bg-white"
                }`}
                onClick={() => handleNav("/soft-download")}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Software
              </Button>
              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex-1 justify-center bg-white text-black hover:bg-gray-50 border border-gray-200`}
                  onClick={() => handleNav("/login")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button
                  size="sm"
                  className={`flex-1 justify-center bg-black text-white hover:bg-gray-800`}
                  onClick={() => handleNav("/register")}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
