"use client";

import "../../i18n";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Play,
  ArrowRight,
  Check,
  Zap,
  Eye,
  Mail,
  Sparkles,
  Brain,
  Palette,
  Settings,
  Rocket,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  img_1,
  img_2,
  img_3,
  img_4,
  img_5,
  img_6,
  downloadImg,
  hr_1,
  hr_2,
  hr_3,
  finalImg,
} from "@/assets/images";
import { useTranslation } from "react-i18next";

// FIX: Lucide-React icons must be used as components, not as JSX elements for dynamic className updates
// We'll create icons as components with props, instead of using React.cloneElement on JSX elements.
// Also, hydration error can be caused by accessing theme value before it's hydrated.
// We'll add a mounted state to prevent mismatches.

export default function ModernAIArchitecture() {
  const { theme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  // Only access theme after mount to avoid hydration mismatch
  const isDarkMode = mounted && theme === "dark";

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);

  const { t, i18n } = useTranslation("common");

  // Hero images for carousel
  const heroImages = [hr_1, hr_2, hr_3];
  const [heroImageIdx, setHeroImageIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIdx((prev) => {
        const newIdx = (prev + 1) % heroImages.length;
        console.log(
          "Hero image changed to:",
          newIdx,
          "Image:",
          heroImages[newIdx]
        );
        return newIdx;
      });
    }, 10000); // Changed to 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 2000);
  };

  // FAQ data
  const faqData = [
    {
      question: t("faq_question_1"),
      answer: t("faq_answer_1"),
    },
    {
      question: t("faq_question_2"),
      answer: t("faq_answer_2"),
    },
    {
      question: t("faq_question_3"),
      answer: t("faq_answer_3"),
    },
    {
      question: t("faq_question_4"),
      answer: t("faq_answer_4"),
    },
    {
      question: t("faq_question_5"),
      answer: t("faq_answer_5"),
    },
  ];

  // Enhanced Services data - use icons as components instead of JSX elements
  const services = [
    {
      icon: Brain,
      title: t("smart_interior_design"),
      description: t("ai_generates_customized_interior"),
      gradient: "from-black to-gray-900",
    },
    {
      icon: Palette,
      title: t("exterior_visualization"),
      description: t("create_stunning_exterior"),
      gradient: "from-black to-gray-900",
    },
    {
      icon: Settings,
      title: t("dual_language_support"),
      description: t("full_support_amharic_english"),
      gradient: "from-black to-gray-900",
    },
    {
      icon: Rocket,
      title: t("cross_platform_access"),
      description: t("access_web_desktop_mobile"),
      gradient: "from-black to-gray-900",
    },
  ];

  useEffect(() => {
    // Intersection Observer for active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // setActiveSection(entry.target.id) // This line is removed
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Prevent hydration mismatch by rendering nothing until mounted
  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Header */}
      <Header />

      {/* Enhanced Hero Section */}
      <section
        id="home"
        ref={heroRef}
        className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-[#F5F5F5]"
        }`}
      >
        {/* Advanced Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-20">
            <div
              className={`absolute inset-0 animate-slide-right ${
                isDarkMode
                  ? "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  : "bg-gradient-to-r from-transparent via-black/10 to-transparent"
              }`}
            ></div>
            <div
              className={`absolute inset-0 animate-slide-down ${
                isDarkMode
                  ? "bg-gradient-to-b from-transparent via-white/5 to-transparent"
                  : "bg-gradient-to-b from-transparent via-black/5 to-transparent"
              }`}
            ></div>
          </div>

          {/* Floating Elements */}
          <div
            className={`absolute top-20 left-20 w-32 h-32 rounded-3xl animate-float-complex blur-sm ${
              isDarkMode
                ? "bg-gradient-to-br from-white/10 to-transparent"
                : "bg-gradient-to-br from-black/10 to-transparent"
            }`}
          ></div>
          <div
            className={`absolute top-40 right-32 w-24 h-24 rounded-2xl animate-float-reverse-complex blur-sm ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-200/15 to-transparent"
                : "bg-gradient-to-br from-gray-900/15 to-transparent"
            }`}
          ></div>
          <div
            className={`absolute bottom-32 left-40 w-40 h-40 rounded-full animate-pulse-complex blur-lg ${
              isDarkMode
                ? "bg-gradient-to-br from-white/8 to-transparent"
                : "bg-gradient-to-br from-black/8 to-transparent"
            }`}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div
                  className={`inline-flex items-center space-x-2 backdrop-blur-sm px-4 py-2 rounded-full border shadow-md mb-6 transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white/80 border-gray-200 text-gray-900"
                  }`}
                >
                  <Sparkles
                    className={`w-4 h-4 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  />
                  <span className="text-sm font-semibold">
                    {t("ai_powered_precision")}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  <span
                    className={`block opacity-0 animate-[fadeInUp_1s_ease-out_0.2s_forwards] transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent"
                        : "bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent"
                    }`}
                  >
                    {t("design_the")} {t("future_with")} {t("maya_ai")}
                  </span>
                </h1>

                <p
                  className={`text-xl lg:text-2xl leading-relaxed opacity-0 animate-[fadeInUp_1s_ease-out_0.8s_forwards] max-w-2xl transition-colors duration-300 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {t("revolutionary_ai_technology")}
                </p>
              </div>

              {/* Enhanced CTA Buttons - Reduced spacing */}
              <div className="flex flex-col sm:flex-row items-start gap-3 opacity-0 animate-[fadeInUp_1s_ease-out_1.2s_forwards] mb-8">
                <Button
                  onClick={() => router.push("/login")}
                  size="lg"
                  className={`px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 group ${
                    isDarkMode
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  <span className="flex items-center">
                    {t("start_creating_now")}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
                <Button
                  onClick={() => {
                    const videoSection =
                      document.getElementById("video-section");
                    if (videoSection) {
                      videoSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold rounded-2xl border-2 transition-all duration-500 backdrop-blur-sm hover:scale-105 hover:-translate-y-1 group bg-white text-black border-black hover:bg-black hover:text-white"
                >
                  <span className="flex items-center">
                    {t("watch_demo")}
                    <Play className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
                  </span>
                </Button>
              </div>
            </div>

            {/* Right 3D Animation */}
            <div
              className="relative opacity-0 animate-[fadeInUp_1s_ease-out_1.4s_forwards]"
              ref={animationRef}
            >
              <div className="relative">
                {/* Main 3D Container */}
                <div className="relative w-full h-[600px] lg:h-[700px] perspective-1000">
                  {/* Central Building Model */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-80 h-96 lg:w-96 lg:h-[450px] transform-gpu animate-float-3d-main hover:scale-105 transition-transform duration-700">
                      <Image
                        key={`hero-${heroImageIdx}`}
                        src={heroImages[heroImageIdx]}
                        alt="MAYA-AI Hero Image"
                        fill
                        className="object-cover rounded-3xl shadow-2xl border-4 border-white/30 dark:border-gray-800/60 transition-transform duration-700 hover:scale-105"
                        priority
                        unoptimized
                      />
                    </div>
                  </div>

                  {/* Orbiting UI Elements */}
                  <div
                    className={`absolute top-16 left-8 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl animate-orbit-1 border transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gray-800/95 border-gray-700"
                        : "bg-white/95 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-glow"></div>
                      <div>
                        <div
                          className={`text-sm font-semibold transition-colors duration-300 ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {t("ai_processing")}
                        </div>
                        <div
                          className={`text-xs transition-colors duration-300 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {t("real_time_generation")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`absolute top-20 right-12 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl animate-orbit-2 border transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gray-800/95 border-gray-700"
                        : "bg-white/95 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Brain className="w-5 h-5 text-purple-500" />
                      <div>
                        <div
                          className={`text-sm font-semibold transition-colors duration-300 ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          Smart Design
                        </div>
                        <div
                          className={`text-xs transition-colors duration-300 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          AI-Powered
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`absolute bottom-24 left-12 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl animate-orbit-3 border transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gray-800/95 border-gray-700"
                        : "bg-white/95 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Rocket className="w-5 h-5 text-green-500" />
                      <div>
                        <div
                          className={`text-sm font-semibold transition-colors duration-300 ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          Instant Results
                        </div>
                        <div
                          className={`text-xs transition-colors duration-300 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Quick Generation
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`absolute bottom-16 right-8 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl animate-orbit-4 border transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-gray-800/95 border-gray-700"
                        : "bg-white/95 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Eye className="w-5 h-5 text-blue-500" />
                      <div>
                        <div
                          className={`text-sm font-semibold transition-colors duration-300 ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {t("3d_preview")}
                        </div>
                        <div
                          className={`text-xs transition-colors duration-300 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {t("ready_to_view")}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Particle Effects */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute w-2 h-2 rounded-full animate-float-particle-${
                          i % 5
                        } ${isDarkMode ? "bg-white/20" : "bg-black/20"}`}
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 3}s`,
                          animationDuration: `${2 + Math.random() * 3}s`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* 3D Shadow */}
                <div
                  className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl animate-shadow-pulse ${
                    isDarkMode ? "bg-white/10" : "bg-black/10"
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section
        id="service"
        className={`py-20 lg:py-32 transition-colors duration-300 ${
          isDarkMode ? "bg-black" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-24">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border mb-6 shadow-sm bg-gradient-to-br from-gray-900 to-gray-700 border-gray-800 text-white">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium">
                {t("intelligent_solutions")}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 text-[#111] dark:text-white">
              {t("intelligent_design")}
              <span className="block text-[#222] dark:text-gray-300">
                {t("solutions")}
              </span>
            </h2>
            <p className="text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed text-[#444] dark:text-gray-300">
              {t(
                "harness_power_artificial_intelligence_revolutionize_your_architectural_workflow"
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className={`group relative rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 border overflow-hidden ${
                    isDarkMode
                      ? "bg-gray-900/90 border-white/10"
                      : "bg-white border-gray-100"
                  }`}
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-700 rounded-3xl`}
                  ></div>

                  <div className="relative z-10">
                    {/* Icon with Gradient Background */}
                    <div className="w-20 h-20 bg-gradient-to-br from-black to-gray-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <Icon className="w-10 h-10 text-white" />
                    </div>

                    <h3
                      className={`text-xl font-bold mb-4 group-hover:opacity-80 transition-all ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={`leading-relaxed text-sm transition-colors duration-300 ${
                        isDarkMode ? "text-white/80" : "text-gray-700"
                      }`}
                    >
                      {service.description}
                    </p>

                    {/* Hover Arrow */}
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <ArrowRight
                        className={`w-5 h-5 group-hover:translate-x-1 transition-all duration-300 ${
                          isDarkMode ? "text-white/70" : "text-gray-400"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feature Highlight */}
          <div className="mt-20 lg:mt-32 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h3
                className={`text-2xl lg:text-3xl font-bold mb-8 leading-tight transition-colors duration-300 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                {t("generate_concepts_in")}
                <span
                  className={`block transition-colors duration-300 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t("minutes_not_months")}
                </span>
              </h3>
              <p
                className={`text-lg mb-8 leading-relaxed transition-colors duration-300 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t(
                  "transform_your_architectural_workflow_with_ai_powered_automation_that_understands_design_principles_building_codes_and_aesthetic_preferences_to_deliver_exceptional_results_instantly"
                )}
              </p>
              <div className="space-y-6">
                {[
                  t("ai_powered_design_automation_with_machine_learning"),
                  t("real_time_3d_visualization_and_rendering"),
                  t("advanced_parametric_modeling_tools"),
                  t("automated_code_compliance_checking"),
                  t("export_to_all_major_architectural_formats"),
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 group"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ${
                        isDarkMode ? "bg-white" : "bg-black"
                      }`}
                    >
                      <Check
                        className={`w-4 h-4 ${
                          isDarkMode ? "text-black" : "text-white"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-lg font-medium transition-colors duration-300 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => router.push("/service")}
                className={`mt-8 px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {t("learn_more")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="relative">
              <div
                className={`relative rounded-3xl overflow-hidden shadow-2xl transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-gray-800 to-gray-900"
                    : "bg-gradient-to-br from-gray-100 to-gray-200"
                }`}
              >
                <Image
                  src={finalImg}
                  alt="Final AI Concept"
                  width={800}
                  height={600}
                  className="w-full h-[350px] md:h-[450px] lg:h-[600px] object-cover rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-700"
                />
                <div
                  className={`absolute inset-0 ${
                    isDarkMode
                      ? "bg-gradient-to-t from-white/10 to-transparent"
                      : "bg-gradient-to-t from-black/10 to-transparent"
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Gallery Section */}
      <section
        id="portfolio"
        className={`py-20 lg:py-32 transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-[#F5F5F5]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-24">
            <div
              className={`inline-flex items-center space-x-2 backdrop-blur-sm px-4 py-2 rounded-full border mb-6 transition-colors duration-300 ${
                isDarkMode
                  ? "bg-white/10 border-white/20 text-white/90"
                  : "bg-white/80 border-gray-200 text-gray-700"
              }`}
            >
              <Eye
                className={`w-4 h-4 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              />
              <span className="text-sm font-medium">
                {t("design_showcase")}
              </span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 transition-colors duration-300 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {t("design_portfolio")}
            </h2>
            <p
              className={`text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed transition-colors duration-300 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t(
                "explore_stunning_architectural_creations_powered_by_artificial_intelligence_and_human_creativity"
              )}
            </p>
          </div>

          {/* Modern Portfolio Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[img_1, img_2, img_3, img_4, img_5, img_6].map((img, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 bg-gradient-to-br from-white/60 to-gray-200/60 dark:from-gray-800/80 dark:to-gray-900/80"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={img}
                    alt={`Portfolio ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-100 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="text-base text-white drop-shadow">
                      {t("ai_generated_design")}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/80 dark:bg-gray-900/80 rounded-full px-4 py-1 text-xs font-semibold text-gray-800 dark:text-white shadow-lg backdrop-blur group-hover:scale-110 transition-transform duration-300">
                    {t("featured")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section
        id="video-section"
        className={`py-20 lg:py-32 transition-colors duration-300 ${
          isDarkMode ? "bg-gray-800" : "bg-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div
              className={`inline-flex items-center space-x-2 px-5 py-2 rounded-full border mb-6 shadow-lg backdrop-blur-md transition-colors duration-300 ${
                isDarkMode
                  ? "bg-white/10 border-white/20 text-white/90"
                  : "bg-white/80 border-gray-200 text-gray-900"
              }`}
            >
              <Play
                className={`w-5 h-5 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              />
              <span className="text-base font-semibold tracking-wide">
                {t("how_it_works")}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 text-white">
              {t("how_it_works")}
            </h2>
            <p
              className={`text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed font-medium text-white`}
            >
              {t(
                "watch_how_our_ai_transforms_simple_inputs_into_stunning_architectural_masterpieces_in_real_time"
              )}
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center bg-black">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/QLdOC3ynHs4?si=oROnXiz3Vqu7PiAO"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px]"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className={`py-20 lg:py-32 transition-colors duration-300 ${
          isDarkMode ? "bg-black" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border mb-6 transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-gray-200"
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                <Lightbulb
                  className={`w-4 h-4 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                />
                <span className="text-sm font-medium">
                  {t("about_maya_ai")}
                </span>
              </div>
              <h2
                className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 leading-tight transition-colors duration-300 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                {t("future_of_architecture_is_here")}
                <span
                  className={`block transition-colors duration-300 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t("architecture_is_here")}
                </span>
              </h2>
              <p
                className={`text-lg mb-8 leading-relaxed transition-colors duration-300 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t(
                  "maya_ai_represents_next_evolution_in_architectural_design_our_advanced_artificial_intelligence_understands_spatial_relationships_building_codes_environmental_factors_and_aesthetic_principles_to_create_designs_that_are_both_beautiful_and_functional"
                )}
              </p>
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div
                  className={`text-center p-6 rounded-2xl transition-colors duration-300 ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <div
                    className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    1,000+
                  </div>
                  <div
                    className={`font-medium transition-colors duration-300 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {t("designs_generated")}
                  </div>
                </div>
                <div
                  className={`text-center p-6 rounded-2xl transition-colors duration-300 ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <div
                    className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    50+
                  </div>
                  <div
                    className={`font-medium transition-colors duration-300 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {t("ethiopian_architects")}
                  </div>
                </div>
                <div
                  className={`text-center p-6 rounded-2xl transition-colors duration-300 ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <div
                    className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    85%
                  </div>
                  <div
                    className={`font-medium transition-colors duration-300 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {t("time_saved")}
                  </div>
                </div>
                <div
                  className={`text-center p-6 rounded-2xl transition-colors duration-300 ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-50"
                  }`}
                >
                  <div
                    className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    2
                  </div>
                  <div
                    className={`font-medium transition-colors duration-300 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {t("languages_supported")}
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={hr_3}
                  alt={t("maya_ai_residential_architecture")}
                  width={800}
                  height={600}
                  className="w-full h-[350px] md:h-[450px] lg:h-[600px] object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className={`py-20 lg:py-32 transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-[#F5F5F5]"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div
              className={`inline-flex items-center space-x-2 backdrop-blur-sm px-4 py-2 rounded-full border mb-6 transition-colors duration-300 ${
                isDarkMode
                  ? "bg-white/10 border-white/20 text-white/90"
                  : "bg-white/80 border-gray-200 text-gray-700"
              }`}
            >
              <Lightbulb
                className={`w-4 h-4 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              />
              <span className="text-sm font-medium">{t("faq")}</span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 transition-colors duration-300 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {t("frequently_asked_questions")}
            </h2>
            <p
              className={`text-lg transition-colors duration-300 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {t("everything_you_need_to_know_about_maya_ai")}
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className={`rounded-3xl shadow-sm border overflow-hidden transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className={`w-full px-8 py-6 text-left flex items-center justify-between transition-colors duration-200 ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold pr-8 transition-colors duration-300 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {faq.question}
                  </h3>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      isDarkMode ? "bg-gray-600" : "bg-gray-100"
                    }`}
                  >
                    {openFaq === index ? (
                      <ChevronUp
                        className={`w-4 h-4 transition-colors duration-300 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      />
                    ) : (
                      <ChevronDown
                        className={`w-4 h-4 transition-colors duration-300 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      />
                    )}
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-8 pb-6">
                    <p
                      className={`leading-relaxed transition-colors duration-300 ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - Different from header/footer */}
      <section
        className={`py-20 lg:py-32 transition-colors duration-300 ${
          isDarkMode ? "bg-gray-800" : "bg-gray-900"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`inline-flex items-center space-x-2 px-5 py-2 rounded-full border mb-6 shadow-lg backdrop-blur-md transition-colors duration-300 ${
              isDarkMode
                ? "bg-white/10 border-white/20 text-white/90"
                : "bg-white/80 border-gray-200 text-gray-900"
            }`}
          >
            <Mail
              className={`w-5 h-5 ${isDarkMode ? "text-white" : "text-black"}`}
            />
            <span className="text-base font-semibold tracking-wide">
              {t("stay_updated")}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 text-white">
            {t("stay_updated_with_ai_innovation")}
          </h2>
          <p
            className={`text-lg lg:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium text-white`}
          >
            {t(
              "get_latest_updates_on_ai_architectural_design_new_features_and_industry_insights_delivered_to_your_inbox"
            )}
          </p>

          <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={`flex-1 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 border shadow-lg transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-white/10 text-white placeholder:text-gray-300 border-white/20 focus:ring-white/30"
                    : "bg-white/80 text-black placeholder:text-gray-500 border-gray-200 focus:ring-black/20"
                }`}
                required
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-4 rounded-2xl font-semibold disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isDarkMode
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-black text-white hover:bg-gray-900"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
                        isDarkMode ? "border-black" : "border-white"
                      }`}
                    ></div>
                    <span>{t("subscribing")}</span>
                  </div>
                ) : (
                  t("subscribe")
                )}
              </Button>
            </div>
          </form>

          {isSubmitted && (
            <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl text-green-300">
              <div className="flex items-center justify-center space-x-2">
                <Check className="w-5 h-5" />
                <span>
                  {t("successfully_subscribed_thank_you_for_joining_us")}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Enhanced Custom Styles with Advanced 3D Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px) translateZ(0);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateZ(0);
          }
        }

        @keyframes float-complex {
          0%,
          100% {
            transform: translateY(0px) rotate(45deg) scale(1);
          }
          33% {
            transform: translateY(-15px) rotate(48deg) scale(1.05);
          }
          66% {
            transform: translateY(-8px) rotate(42deg) scale(0.95);
          }
        }

        @keyframes float-reverse-complex {
          0%,
          100% {
            transform: translateY(0px) rotate(-12deg) scale(1);
          }
          50% {
            transform: translateY(-20px) rotate(-15deg) scale(1.1);
          }
        }

        @keyframes pulse-complex {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.9;
          }
        }

        @keyframes float-3d-main {
          0%,
          100% {
            transform: translateY(0px) rotateX(0deg) rotateY(0deg);
          }
          25% {
            transform: translateY(-10px) rotateX(2deg) rotateY(1deg);
          }
          50% {
            transform: translateY(-5px) rotateX(-1deg) rotateY(-2deg);
          }
          75% {
            transform: translateY(-15px) rotateX(1deg) rotateY(1deg);
          }
        }

        @keyframes orbit-1 {
          0%,
          100% {
            transform: translateX(0px) translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateX(10px) translateY(-5px) rotate(2deg);
          }
          50% {
            transform: translateX(5px) translateY(-10px) rotate(-1deg);
          }
          75% {
            transform: translateX(-5px) translateY(-5px) rotate(1deg);
          }
        }

        @keyframes orbit-2 {
          0%,
          100% {
            transform: translateX(0px) translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateX(-8px) translateY(5px) rotate(-2deg);
          }
          50% {
            transform: translateX(-3px) translateY(12px) rotate(1deg);
          }
          75% {
            transform: translateX(5px) translateY(8px) rotate(-1deg);
          }
        }

        @keyframes orbit-3 {
          0%,
          100% {
            transform: translateX(0px) translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateX(12px) translateY(-8px) rotate(3deg);
          }
          66% {
            transform: translateX(-5px) translateY(-3px) rotate(-2deg);
          }
        }

        @keyframes orbit-4 {
          0%,
          100% {
            transform: translateX(0px) translateY(0px) rotate(0deg);
          }
          40% {
            transform: translateX(-10px) translateY(-12px) rotate(-3deg);
          }
          80% {
            transform: translateX(8px) translateY(-5px) rotate(2deg);
          }
        }

        @keyframes pulse-hologram {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.8);
          }
        }

        @keyframes slide-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes slide-down {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes shadow-pulse {
          0%,
          100% {
            transform: translateX(-50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateX(-50%) scale(1.2);
            opacity: 0.5;
          }
        }

        @keyframes float-particle-0 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-5px);
          }
          75% {
            transform: translateY(-30px) translateX(15px);
          }
        }

        @keyframes float-particle-1 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-15px) translateX(-10px);
          }
          66% {
            transform: translateY(-25px) translateX(5px);
          }
        }

        @keyframes float-particle-2 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-35px) translateX(-15px);
          }
        }

        @keyframes float-particle-3 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-10px) translateX(-20px);
          }
          75% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes float-particle-4 {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          40% {
            transform: translateY(-25px) translateX(20px);
          }
          80% {
            transform: translateY(-15px) translateX(-10px);
          }
        }

        .animate-float-complex {
          animation: float-complex 6s ease-in-out infinite;
        }

        .animate-float-reverse-complex {
          animation: float-reverse-complex 5s ease-in-out infinite;
        }

        .animate-pulse-complex {
          animation: pulse-complex 4s ease-in-out infinite;
        }

        .animate-float-3d-main {
          animation: float-3d-main 8s ease-in-out infinite;
        }

        .animate-orbit-1 {
          animation: orbit-1 12s ease-in-out infinite;
        }

        .animate-orbit-2 {
          animation: orbit-2 10s ease-in-out infinite 1s;
        }

        .animate-orbit-3 {
          animation: orbit-3 14s ease-in-out infinite 2s;
        }

        .animate-orbit-4 {
          animation: orbit-4 11s ease-in-out infinite 3s;
        }

        .animate-pulse-hologram {
          animation: pulse-hologram 3s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-slide-right {
          animation: slide-right 20s linear infinite;
        }

        .animate-slide-down {
          animation: slide-down 25s linear infinite;
        }

        .animate-shadow-pulse {
          animation: shadow-pulse 4s ease-in-out infinite;
        }

        .animate-float-particle-0 {
          animation: float-particle-0 6s ease-in-out infinite;
        }

        .animate-float-particle-1 {
          animation: float-particle-1 5s ease-in-out infinite;
        }

        .animate-float-particle-2 {
          animation: float-particle-2 7s ease-in-out infinite;
        }

        .animate-float-particle-3 {
          animation: float-particle-3 4.5s ease-in-out infinite;
        }

        .animate-float-particle-4 {
          animation: float-particle-4 5.5s ease-in-out infinite;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}
