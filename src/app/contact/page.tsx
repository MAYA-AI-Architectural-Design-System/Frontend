"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Mail, Sparkles, Lightbulb } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

export default function ContactPage() {
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
      <section className="w-full max-w-3xl mx-auto pt-28 md:pt-36 px-4 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border mb-6 bg-white/80 border-gray-200 text-gray-700 backdrop-blur-sm">
          <Mail
            className={`w-4 h-4 ${isDarkMode ? "text-white" : "text-black"}`}
          />
          <span className="text-sm font-medium">{t("contact_maya_ai")}</span>
        </div>
        <h1
          className={`text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-xl ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {t("lets_connect_with_ai")}
        </h1>
        <p
          className={`text-lg md:text-xl mb-10 max-w-xl mx-auto ${
            isDarkMode ? "text-white" : "text-gray-700"
          }`}
        >
          {t("reach_out_team")}
        </p>
      </section>
      {/* Contact Form */}
      <section
        className={`w-full max-w-lg mx-auto rounded-3xl border p-10 mb-16 backdrop-blur-md shadow-xl ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900/90 to-black/80 border-white/10"
            : "bg-gradient-to-br from-white/90 to-[#F5F5F5]/90 border-gray-200"
        }`}
      >
        <form className="flex flex-col gap-6">
          <div>
            <Label
              htmlFor="name"
              className={`mb-1 block text-sm font-semibold tracking-wide ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("name")}
            </Label>
            <Input
              id="name"
              placeholder={t("your_name")}
              className={`rounded-xl border-2 transition-all duration-200 shadow-md ${
                isDarkMode
                  ? "bg-black/60 border-white/20 text-white placeholder:text-gray-400 focus:border-[#F5F5F5] focus:ring-2 focus:ring-[#F5F5F5]/40"
                  : "bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-black focus:ring-2 focus:ring-black/20"
              } focus:shadow-lg`}
            />
          </div>
          <div>
            <Label
              htmlFor="email"
              className={`mb-1 block text-sm font-semibold tracking-wide ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("email")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t("email")}
              className={`rounded-xl border-2 transition-all duration-200 shadow-md ${
                isDarkMode
                  ? "bg-black/60 border-white/20 text-white placeholder:text-gray-400 focus:border-[#F5F5F5] focus:ring-2 focus:ring-[#F5F5F5]/40"
                  : "bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-black focus:ring-2 focus:ring-black/20"
              } focus:shadow-lg`}
            />
          </div>
          <div>
            <Label
              htmlFor="message"
              className={`mb-1 block text-sm font-semibold tracking-wide ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("message")}
            </Label>
            <Textarea
              id="message"
              placeholder={t("tell_us_about_your_inquiry")}
              className={`rounded-xl border-2 transition-all duration-200 shadow-md ${
                isDarkMode
                  ? "bg-black/60 border-white/20 text-white placeholder:text-gray-400 focus:border-[#F5F5F5] focus:ring-2 focus:ring-[#F5F5F5]/40"
                  : "bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-black focus:ring-2 focus:ring-black/20"
              } focus:shadow-lg`}
            />
          </div>
          <div>
            <Label
              htmlFor="referral"
              className={`mb-1 block text-sm font-semibold tracking-wide ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {t("how_did_you_hear_about_us")}
            </Label>
            <div className="relative">
              <Select>
                <SelectTrigger
                  id="referral"
                  className={`rounded-xl border-2 transition-all duration-200 shadow-md ${
                    isDarkMode
                      ? "bg-black/60 border-white/20 text-white placeholder:text-gray-400 focus:border-[#F5F5F5] focus:ring-2 focus:ring-[#F5F5F5]/40"
                      : "bg-white/80 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-black focus:ring-2 focus:ring-black/20"
                  } focus:shadow-lg`}
                >
                  <SelectValue
                    placeholder={t("let_us_know_how_you_found_us")}
                  />
                </SelectTrigger>
                <SelectContent
                  className={`${
                    isDarkMode
                      ? "bg-black/90 text-white border-white/10"
                      : "bg-white text-gray-900 border-gray-200"
                  } rounded-xl shadow-lg`}
                >
                  <SelectItem value="search">{t("search_engine")}</SelectItem>
                  <SelectItem value="social">{t("social_media")}</SelectItem>
                  <SelectItem value="friend">
                    {t("friend_colleague")}
                  </SelectItem>
                  <SelectItem value="other">{t("other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            type="submit"
            className={`w-full mt-4 text-lg py-2 rounded-xl font-bold tracking-wide shadow-lg transition-colors ${
              isDarkMode
                ? "bg-white text-black hover:bg-[#F5F5F5]"
                : "bg-black text-white hover:bg-gray-900"
            }`}
          >
            {t("submit")}
          </Button>
        </form>
      </section>
      {/* Info/Features Section */}
      <section className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-4 pb-24">
        <div className="flex flex-col items-center text-center gap-3 animate-fade-in-up">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2"
            style={{
              background: isDarkMode ? "rgba(255,255,255,0.08)" : "#F5F5F5",
            }}
          >
            <Sparkles
              className={`w-7 h-7 ${isDarkMode ? "text-white" : "text-black"}`}
            />
          </div>
          <div
            className={`font-semibold text-lg ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {t("ai_powered_support")}
          </div>
          <div
            className={`text-sm ${isDarkMode ? "text-white" : "text-gray-700"}`}
          >
            {t("get_expert_advice")}
          </div>
        </div>
        <div className="flex flex-col items-center text-center gap-3 animate-fade-in-up">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2"
            style={{
              background: isDarkMode ? "rgba(255,255,255,0.08)" : "#F5F5F5",
            }}
          >
            <Lightbulb
              className={`w-7 h-7 ${isDarkMode ? "text-white" : "text-black"}`}
            />
          </div>
          <div
            className={`font-semibold text-lg ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {t("innovative_solutions")}
          </div>
          <div
            className={`text-sm ${isDarkMode ? "text-white" : "text-gray-700"}`}
          >
            {t("realize_vision")}
          </div>
        </div>
        <div className="flex flex-col items-center text-center gap-3 animate-fade-in-up">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2"
            style={{
              background: isDarkMode ? "rgba(255,255,255,0.08)" : "#F5F5F5",
            }}
          >
            <Mail
              className={`w-7 h-7 ${isDarkMode ? "text-white" : "text-black"}`}
            />
          </div>
          <div
            className={`font-semibold text-lg ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {t("always_connected")}
          </div>
          <div
            className={`text-sm ${isDarkMode ? "text-white" : "text-gray-700"}`}
          >
            {t("contact_anytime")}
          </div>
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
