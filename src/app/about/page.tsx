"use client";
import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Sparkles, Lightbulb, Brain, Rocket, Palette } from "lucide-react";
import {
  DawitTeshomeImg,
  DawitTesfayeImg,
  FraolZelalemImg,
  DanielLemmaImg,
  LeulBerhanuImg,
} from "@/assets/images";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

const teamMembers = [
  {
    name: "Dawit Teshome",
    roleKey: "full_stack_development_ai_integration",
    image: DawitTeshomeImg,
  },
  {
    name: "Dawit Tesfaye",
    roleKey: "frontend_figma_design",
    image: DawitTesfayeImg,
  },
  {
    name: "Fraol Zelalem",
    roleKey: "backend_documentation",
    image: FraolZelalemImg,
  },
  {
    name: "Daniel Lemma",
    roleKey: "frontend_documentation",
    image: DanielLemmaImg,
  },
  {
    name: "Leul Berhanu",
    roleKey: "frontend_graphics",
    image: LeulBerhanuImg,
  },
];

const highlights = [
  {
    icon: <Brain className="w-8 h-8" />,
    titleKey: "ai_powered_interior_design_about",
    descKey: "generate_customized_interior_about",
  },
  {
    icon: <Rocket className="w-8 h-8" />,
    titleKey: "exterior_design_generation",
    descKey: "create_stunning_exterior_about",
  },
  {
    icon: <Palette className="w-8 h-8" />,
    titleKey: "multi_language_support",
    descKey: "full_support_amharic_english_about",
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    titleKey: "cross_platform_access_about",
    descKey: "access_web_desktop_mobile_about",
  },
];

const stats = [
  { value: "1,000+", labelKey: "designs_generated" },
  { value: "50+", labelKey: "ethiopian_architects" },
  { value: "85%", labelKey: "time_saved" },
  { value: "2", labelKey: "languages_supported" },
];

export default function AboutPage() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const { t } = useTranslation("common");
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
      <section className="w-full max-w-5xl mx-auto pt-28 md:pt-36 px-4 text-center">
        <div
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border mb-6 backdrop-blur-sm ${
            isDarkMode
              ? "bg-black/80 border-white/20 text-white"
              : "bg-white/80 border-gray-200 text-gray-700"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">
            {t("the_future_of_residential_architecture")}
          </span>
        </div>
        <h1
          className={`text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-xl ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {t("maya_ai_represents_next_evolution")}
        </h1>
        <p
          className={`text-lg md:text-xl mb-12 max-w-2xl mx-auto ${
            isDarkMode ? "text-white" : "text-gray-700"
          }`}
        >
          {t("maya_ai_represents_next_evolution_about")}
        </p>
      </section>
      {/* Highlights Section */}
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-4 pb-20">
        {highlights.map((item, i) => (
          <div
            key={item.title}
            className={`relative rounded-3xl shadow-xl border p-8 flex flex-col items-center gap-4 group overflow-hidden hover:shadow-2xl transition-all duration-500 animate-fade-in-up ${
              isDarkMode
                ? "bg-black/90 border-white/20 shadow-white/10"
                : "bg-white border-[#F5F5F5]"
            }`}
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md mb-2 animate-float-3d ${
                isDarkMode ? "bg-white/10" : "bg-black/10"
              }`}
            >
              {React.cloneElement(item.icon, {
                className: `w-8 h-8 ${
                  isDarkMode ? "text-white" : "text-black"
                }`,
              })}
            </div>
            <h2
              className={`text-xl font-semibold drop-shadow-sm mb-1 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {t(item.titleKey)}
            </h2>
            <p
              className={`text-base text-center leading-relaxed ${
                isDarkMode ? "text-white/80" : "text-gray-700"
              }`}
            >
              {t(item.descKey)}
            </p>
          </div>
        ))}
      </section>
      {/* Stats Section */}
      <section className="w-full max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-4 pb-20">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in-up ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-800/90 to-black/80 border border-white/10"
                : "bg-gradient-to-br from-white to-gray-50 border border-gray-200/50"
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div
              className={`text-4xl md:text-5xl font-bold mb-3 tracking-tight ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {stat.value}
            </div>
            <div
              className={`text-sm md:text-base font-semibold uppercase tracking-wide ${
                isDarkMode ? "text-white/70" : "text-gray-600"
              }`}
            >
              {t(stat.labelKey)}
            </div>
          </div>
        ))}
      </section>
      {/* Our Team Section (images unchanged) */}
      <section className="w-full max-w-6xl mx-auto px-4 pb-24">
        <h2
          className={`text-3xl md:text-4xl font-bold text-center mb-12 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {t("our_team")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={`text-center animate-fade-in-up ${
                isDarkMode ? "" : ""
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden flex items-center justify-center shadow-lg ${
                  isDarkMode
                    ? "bg-gradient-to-br from-gray-900/90 to-black/80"
                    : "bg-gradient-to-br from-black to-[#F5F5F5]"
                }`}
              >
                <img
                  src={member.image?.src || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3
                className={`font-semibold text-lg mb-1 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                {member.name}
              </h3>
              <p
                className={`${isDarkMode ? "text-white/80" : "text-gray-600"}`}
              >
                {t(member.roleKey)}
              </p>
            </div>
          ))}
        </div>
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
