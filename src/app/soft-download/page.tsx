"use client";
import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Download, Sparkles, Rocket } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

const downloads = [
  {
    os: "Windows",
    icon: (
      <svg width="100" height="100" viewBox="0 0 80 80" fill="none">
        <rect width="80" height="80" rx="24" fill="#F5F5F5" />
        <path
          d="M13 39.5V19.1c0-1.1.8-2 1.9-2.1l23.6-3.2c1.2-.2 2.3.8 2.3 2v21.7H13zm27.8-25.1l25.3-3.4c1.2-.2 2.3.8 2.3 2v26.5H40.8V14.4zm-27.8 27.1h25.5v21.7l-23.6-3.2c-1.1-.2-1.9-1.1-1.9-2.1V41.5zm27.8 21.7V43.5h27.6v26.5c0 1.2-1.1 2.2-2.3 2l-25.3-3.3z"
          fill="#111"
        />
      </svg>
    ),
    descKey: "for_windows",
    buttons: [
      { labelKey: "32_bit_download", link: "#" },
      { labelKey: "64_bit_download", link: "#" },
    ],
  },
  {
    os: "Mac OS",
    icon: (
      <svg width="100" height="100" viewBox="0 0 80 80" fill="none">
        <rect width="80" height="80" rx="24" fill="#F5F5F5" />
        <path
          d="M54.7 42.7c-.1-5.2 4.2-7.7 4.4-7.8-2.4-3.5-6.1-4-7.4-4.1-3.1-.3-6.1 1.8-7.7 1.8-1.6 0-4-1.7-6.6-1.6-3.4.1-6.5 2-8.2 5-3.5 6-1 14.8 2.5 19.7 1.7 2.4 3.7 5.1 6.3 5 2.5-.1 3.5-1.6 6.6-1.6 3.1 0 3.9 1.6 6.6 1.6 2.7 0 4.4-2.4 6-4.8 1.9-2.7 2.7-5.3 2.7-5.4-.1-.1-5.2-2-5.3-7.8zm-6.2-15c1.4-1.7 2.3-4.1 2-6.5-1.9.1-4.2 1.3-5.6 3-1.2 1.4-2.3 3.8-1.9 6 .2.2 2.1.3 4.1-1.1 1.3-.8 2.6-2.1 3.4-3.4z"
          fill="#111"
        />
      </svg>
    ),
    descKey: "macos_newer",
    buttons: [{ labelKey: "download", link: "#" }],
  },
  {
    os: "Linux",
    icon: (
      <svg width="100" height="100" viewBox="0 0 80 80" fill="none">
        <rect width="80" height="80" rx="24" fill="#F5F5F5" />
        <g>
          <ellipse cx="40" cy="60" rx="18" ry="6" fill="#111" />
          <ellipse cx="40" cy="40" rx="18" ry="18" fill="#fff" />
          <ellipse cx="40" cy="40" rx="14" ry="14" fill="#FFC107" />
          <ellipse cx="40" cy="40" rx="10" ry="10" fill="#fff" />
          <ellipse cx="40" cy="40" rx="6" ry="6" fill="#111" />
        </g>
      </svg>
    ),
    descKey: "for_linux",
    buttons: [{ labelKey: "download", link: "#" }],
  },
];

export default function SoftDownloadPage() {
  const { theme } = useTheme();
  const { t } = useTranslation("common");
  const isDarkMode = theme === "dark";
  return (
    <div
      className={`min-h-screen relative overflow-x-hidden transition-colors duration-300 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[350px] bg-gradient-to-br from-black via-[#F5F5F5]/60 to-white opacity-90 animate-gradient-move" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/3 bg-gradient-to-tr from-black/10 via-[#F5F5F5]/60 to-white/80 rounded-full blur-3xl animate-float-3d" />
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-gradient-to-br from-black/10 via-[#F5F5F5]/60 to-white/80 rounded-3xl blur-2xl animate-float-3d-reverse" />
      </div>
      {/* Header */}
      <div className="relative z-20 w-full">
        <Header />
      </div>
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto pt-28 md:pt-36 px-4 text-center">
        <div
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border mb-6 backdrop-blur-sm ${
            isDarkMode
              ? "bg-black/80 border-white/20 text-white"
              : "bg-white/80 border-gray-200 text-gray-700"
          }`}
        >
          <Rocket
            className={`w-4 h-4 ${isDarkMode ? "text-white" : "text-black"}`}
          />
          <span className="text-sm font-medium">
            {t("ai_software_download")}
          </span>
        </div>
        <h1
          className={`text-4xl md:text-6xl font-bold mb-4 leading-tight ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Empower Your{" "}
          <span className={`${isDarkMode ? "text-white" : "text-black"}`}>
            {t("designs")}
          </span>
        </h1>
        <p
          className={`text-lg md:text-xl mb-12 max-w-2xl mx-auto ${
            isDarkMode ? "text-white" : "text-gray-700"
          }`}
        >
          {t("download_maya_ai_description")}
        </p>
      </section>
      {/* Download Cards */}
      <section
        className={`max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mt-8 ${
          isDarkMode ? "bg-black/70" : "bg-white/80"
        } rounded-3xl py-16 px-4 md:px-8 mb-24`}
      >
        {downloads.map((item, idx) => (
          <div
            key={item.os}
            className={`flex flex-col items-center text-center group rounded-3xl shadow-xl border p-10 transition-all duration-300 ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-900/80 to-black/80 border-white/10"
                : "bg-gradient-to-br from-white/90 to-[#F5F5F5]/90 border-gray-200"
            }`}
          >
            <div
              className={`mb-8 flex items-center justify-center w-36 h-36 rounded-2xl ${
                isDarkMode ? "bg-white/10" : "bg-black/10"
              }`}
            >
              {item.icon}
            </div>
            <div
              className={`font-semibold text-2xl mb-2 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {item.os}
            </div>
            <div
              className={`mb-4 text-base min-h-[32px] ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t(item.descKey)}
            </div>
            <div className="flex flex-col gap-2 w-full">
              {item.buttons.map((btn, bidx) => (
                <a
                  key={bidx}
                  href={btn.link}
                  className={`rounded-md px-4 py-3 font-medium transition-colors text-base ${
                    isDarkMode
                      ? "bg-white/90 text-black hover:bg-[#F5F5F5]"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                  download
                >
                  {t(btn.labelKey)}
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
      <Footer />
      {/* Custom Animations */}
      <style jsx>{`
        @keyframes gradient-move {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 12s ease-in-out infinite alternate;
        }
        @keyframes float-3d {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-18px) scale(1.04);
          }
        }
        .animate-float-3d {
          animation: float-3d 5s ease-in-out infinite;
        }
        @keyframes float-3d-reverse {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(12px) scale(1.03);
          }
        }
        .animate-float-3d-reverse {
          animation: float-3d-reverse 6s ease-in-out infinite;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fade-in-up 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
      `}</style>
    </div>
  );
}
