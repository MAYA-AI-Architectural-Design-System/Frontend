"use client";
import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  Sparkles,
  Brain,
  Rocket,
  Palette,
  Settings,
  ArrowRight,
  Check,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

const services = [
  {
    icon: <Brain className="w-10 h-10 text-white" />,
    titleKey: "ai_powered_interior_design",
    descKey: "generate_customized_interior",
    gradient: "from-black via-[#F5F5F5] to-white",
  },
  {
    icon: <Palette className="w-10 h-10 text-white" />,
    titleKey: "exterior_visualization",
    descKey: "create_stunning_exterior",
    gradient: "from-[#F5F5F5] via-black to-white",
  },
  {
    icon: <Settings className="w-10 h-10 text-white" />,
    titleKey: "dual_language_support",
    descKey: "full_support_amharic_english",
    gradient: "from-white via-[#F5F5F5] to-black",
  },
  {
    icon: <Rocket className="w-10 h-10 text-white" />,
    titleKey: "cross_platform_access",
    descKey: "access_web_desktop_mobile",
    gradient: "from-black via-white to-[#F5F5F5]",
  },
];

export default function ServicePage() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const { t } = useTranslation("common");
  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center relative overflow-x-hidden transition-colors duration-300 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Animated 3D-Inspired Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[350px] bg-gradient-to-br from-black via-[#F5F5F5]/60 to-white opacity-90 animate-gradient-move" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/3 bg-gradient-to-tr from-black/10 via-[#F5F5F5]/60 to-white/80 rounded-full blur-3xl animate-float-3d" />
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-gradient-to-br from-black/10 via-[#F5F5F5]/60 to-white/80 rounded-3xl blur-2xl animate-float-3d-reverse" />
        {/* Abstract SVG 3D shapes */}
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
          width="600"
          height="600"
          viewBox="0 0 600 600"
          fill="none"
        >
          <ellipse cx="300" cy="300" rx="220" ry="120" fill="#F5F5F5" />
          <ellipse
            cx="300"
            cy="320"
            rx="180"
            ry="80"
            fill="#000"
            fillOpacity="0.07"
          />
        </svg>
      </div>
      {/* Header */}
      <div className="relative z-20 w-full">
        <Header />
      </div>
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto pt-28 md:pt-36 px-4 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border mb-6 bg-white/80 border-gray-200 text-gray-700 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-black" />
          <span className="text-sm font-medium">
            {t("ai_architectural_services")}
          </span>
        </div>
        <h1
          className={`text-4xl md:text-7xl font-bold mb-4 leading-tight drop-shadow-xl ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {t("build_the_future_with_maya_ai")}
        </h1>
        <p
          className={`text-lg md:text-2xl mb-12 max-w-2xl mx-auto ${
            isDarkMode ? "text-white" : "text-gray-700"
          }`}
        >
          {t("discover_new_era_residential")}
        </p>
      </section>
      {/* Services Grid */}
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 px-4 pb-24">
        {services.map((service, i) => (
          <div
            key={service.titleKey}
            className={`relative bg-white rounded-3xl shadow-2xl border border-[#F5F5F5] p-10 flex flex-col items-center group overflow-hidden hover:shadow-3xl transition-all duration-700 animate-fade-in-up`}
            style={{ animationDelay: `${i * 120}ms` }}
          >
            {/* 3D Glassmorphic Card */}
            <div
              className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl opacity-30 pointer-events-none ${
                i % 2 === 0
                  ? "bg-gradient-to-br from-black/30 to-[#F5F5F5]/60"
                  : "bg-gradient-to-br from-[#F5F5F5]/60 to-black/30"
              }`}
            ></div>
            <div
              className={`absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none ${
                i % 2 === 1
                  ? "bg-gradient-to-br from-black/30 to-[#F5F5F5]/60"
                  : "bg-gradient-to-br from-[#F5F5F5]/60 to-black/30"
              }`}
            ></div>
            <div
              className={`w-24 h-24 flex items-center justify-center rounded-full mb-6 transition-colors border-2 ${
                isDarkMode
                  ? "bg-gradient-to-br from-gray-800 to-black border-white/10"
                  : "bg-gradient-to-br from-[#F5F5F5] to-white border-black/10"
              }`}
            >
              {React.cloneElement(service.icon, {
                className: `w-12 h-12 ${
                  isDarkMode
                    ? "text-white drop-shadow-[0_2px_6seedave95@gmail.compx_rgba(255,255,255,0.15)]"
                    : "text-black"
                }`,
              })}
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-black mb-2 drop-shadow-sm text-center">
              {t(service.titleKey)}
            </h2>
            <p className="text-gray-700 text-lg mb-4 leading-relaxed text-center">
              {t(service.descKey)}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Check className="w-6 h-6 text-black" />
              <span className="text-base text-black font-medium">
                {t("ai_precision")}
              </span>
              <ArrowRight className="w-5 h-5 text-black ml-2" />
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
