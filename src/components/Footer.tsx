"use client";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { mayaLogoDark, mayaLogoLight } from "@/assets/images";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation("common");

  return (
    <footer
      className={`py-16 transition-colors duration-300 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Logo - Centered and Prominent */}
        <img
          src={isDarkMode ? mayaLogoDark.src : mayaLogoLight.src}
          alt="Maya logo"
          width={120}
          height={120}
          style={{ cursor: "pointer", marginBottom: "2rem" }}
          onClick={() => router.push("/")}
        />
        {/* Description */}
        <p
          className={`mb-8 text-center max-w-2xl text-base sm:text-lg font-medium transition-colors duration-300 px-4 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <span className="hidden sm:inline">
            {t("revolutionizing_architectural_design")}
          </span>
          <span className="sm:hidden">
            {t("revolutionizing_architectural_design_mobile")}
          </span>
        </p>
        {/* Navigation - Modern pill style */}
        <nav className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 px-4">
          <a
            onClick={() => router.push("/")}
            className={`px-4 sm:px-6 py-2 rounded-full font-semibold text-sm sm:text-lg shadow-md transition-all duration-300 cursor-pointer ${
              pathname === "/"
                ? isDarkMode
                  ? "bg-white/10 text-white"
                  : "bg-black/10 text-black"
                : isDarkMode
                ? "hover:bg-white/10 text-gray-300"
                : "hover:bg-black/5 text-gray-700"
            }`}
          >
            {t("home")}
          </a>
          <a
            onClick={() => router.push("/service")}
            className={`px-4 sm:px-6 py-2 rounded-full font-semibold text-sm sm:text-lg shadow-md transition-all duration-300 cursor-pointer ${
              pathname === "/service"
                ? isDarkMode
                  ? "bg-white/10 text-white"
                  : "bg-black/10 text-black"
                : isDarkMode
                ? "hover:bg-white/10 text-gray-300"
                : "hover:bg-black/5 text-gray-700"
            }`}
          >
            {t("service")}
          </a>
          <a
            onClick={() => router.push("/gallery")}
            className={`px-4 sm:px-6 py-2 rounded-full font-semibold text-sm sm:text-lg shadow-md transition-all duration-300 cursor-pointer ${
              pathname === "/gallery"
                ? isDarkMode
                  ? "bg-white/10 text-white"
                  : "bg-black/10 text-black"
                : isDarkMode
                ? "hover:bg-white/10 text-gray-300"
                : "hover:bg-black/5 text-gray-700"
            }`}
          >
            {t("gallery")}
          </a>
          <a
            onClick={() => router.push("/about")}
            className={`px-4 sm:px-6 py-2 rounded-full font-semibold text-sm sm:text-lg shadow-md transition-all duration-300 cursor-pointer ${
              pathname === "/about"
                ? isDarkMode
                  ? "bg-white/10 text-white"
                  : "bg-black/10 text-black"
                : isDarkMode
                ? "hover:bg-white/10 text-gray-300"
                : "hover:bg-black/5 text-gray-700"
            }`}
          >
            {t("about")}
          </a>
        </nav>
        {/* Social Media - Modern icon buttons */}
        <div className="flex justify-center gap-3 sm:gap-6 lg:gap-8 mb-8">
          <a
            href="#"
            className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex items-center justify-center rounded-full shadow-xl border-2 transition-all duration-300 text-xl sm:text-2xl lg:text-3xl ${
              isDarkMode
                ? "bg-gray-900 border-gray-700 hover:bg-white hover:text-black"
                : "bg-white border-gray-200 hover:bg-black hover:text-white"
            }`}
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
          </a>
          <a
            href="#"
            className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex items-center justify-center rounded-full shadow-xl border-2 transition-all duration-300 text-xl sm:text-2xl lg:text-3xl ${
              isDarkMode
                ? "bg-gray-900 border-gray-700 hover:bg-white hover:text-black"
                : "bg-white border-gray-200 hover:bg-black hover:text-white"
            }`}
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
          </a>
          <a
            href="#"
            className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex items-center justify-center rounded-full shadow-xl border-2 transition-all duration-300 text-xl sm:text-2xl lg:text-3xl ${
              isDarkMode
                ? "bg-gray-900 border-gray-700 hover:bg-white hover:text-black"
                : "bg-white border-gray-200 hover:bg-black hover:text-white"
            }`}
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
          </a>
          <a
            href="#"
            className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex items-center justify-center rounded-full shadow-xl border-2 transition-all duration-300 text-xl sm:text-2xl lg:text-3xl ${
              isDarkMode
                ? "bg-gray-900 border-gray-700 hover:bg-white hover:text-black"
                : "bg-white border-gray-200 hover:bg-black hover:text-white"
            }`}
            aria-label="Linkedin"
          >
            <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
          </a>
          <a
            href="#"
            className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex items-center justify-center rounded-full shadow-xl border-2 transition-all duration-300 text-xl sm:text-2xl lg:text-3xl ${
              isDarkMode
                ? "bg-gray-900 border-gray-700 hover:bg-white hover:text-black"
                : "bg-white border-gray-200 hover:bg-black hover:text-white"
            }`}
            aria-label="Youtube"
          >
            <Youtube className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
          </a>
        </div>
        {/* Copyright */}
        <div
          className={`border-t pt-8 w-full flex flex-col items-center transition-colors duration-300 ${
            isDarkMode ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <p
            className={`text-xs sm:text-sm transition-colors duration-300 text-center px-4 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <span className="hidden sm:inline">{t("copyright")}</span>
            <span className="sm:hidden">{t("copyright")}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
