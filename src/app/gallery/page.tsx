"use client";
import { useState } from "react";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "@/components/Footer";
import { Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import {
  interior1,
  interior2,
  interior3,
  interior4,
  interior5,
  interior6,
  exterior1,
  exterior2,
  exterior3,
  exterior4,
  exterior5,
  exterior6,
} from "@/assets/images";
import React from "react"; // Added missing import for React
import { useTranslation } from "react-i18next";

interface PortfolioItem {
  id: number;
  category: string;
  image: any; // StaticImageData from Next.js
  alt: string;
}

const getPortfolioItems = (t: (key: string) => string): PortfolioItem[] => [
  {
    id: 1,
    category: "exterior",
    image: exterior1,
    alt: t("modern_house_exterior_1"),
  },
  {
    id: 2,
    category: "exterior",
    image: exterior2,
    alt: t("modern_house_exterior_2"),
  },
  {
    id: 3,
    category: "exterior",
    image: exterior3,
    alt: t("modern_house_exterior_3"),
  },
  {
    id: 4,
    category: "exterior",
    image: exterior4,
    alt: t("modern_house_exterior_4"),
  },
  {
    id: 5,
    category: "exterior",
    image: exterior5,
    alt: t("modern_house_exterior_5"),
  },
  {
    id: 6,
    category: "exterior",
    image: exterior6,
    alt: t("modern_house_exterior_6"),
  },
  {
    id: 7,
    category: "interior",
    image: interior1,
    alt: t("modern_house_interior_1"),
  },
  {
    id: 8,
    category: "interior",
    image: interior2,
    alt: t("modern_house_interior_2"),
  },
  {
    id: 9,
    category: "interior",
    image: interior3,
    alt: t("modern_house_interior_3"),
  },
  {
    id: 10,
    category: "interior",
    image: interior4,
    alt: t("modern_house_interior_4"),
  },
  {
    id: 11,
    category: "interior",
    image: interior5,
    alt: t("modern_house_interior_5"),
  },
  {
    id: 12,
    category: "interior",
    image: interior6,
    alt: t("modern_house_interior_6"),
  },
];

export default function Gallery() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const { t } = useTranslation("common");
  const [activeFilter, setActiveFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const portfolioItems = getPortfolioItems(t);
  const filteredItems =
    activeFilter === "all"
      ? portfolioItems
      : portfolioItems.filter(
          (item: PortfolioItem) => item.category === activeFilter
        );

  // Modal navigation
  const openModal = (idx: number) => {
    setModalIndex(idx);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);
  const prevModal = () =>
    setModalIndex(
      (prev) => (prev - 1 + filteredItems.length) % filteredItems.length
    );
  const nextModal = () =>
    setModalIndex((prev) => (prev + 1) % filteredItems.length);

  // Keyboard navigation for modal
  React.useEffect(() => {
    if (!modalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") prevModal();
      if (e.key === "ArrowRight") nextModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [modalOpen, filteredItems.length]);

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden transition-colors duration-300 ${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[350px] bg-gradient-to-br from-black via-white/10 to-white/0 opacity-90 animate-gradient-move" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/3 bg-gradient-to-tr from-black/10 via-white/10 to-white/80 rounded-full blur-3xl animate-float-3d" />
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-gradient-to-br from-black/10 via-white/10 to-white/80 rounded-3xl blur-2xl animate-float-3d-reverse" />
        {/* Animated particles */}
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full pointer-events-none animate-float-particle-${
              i % 5
            }`}
            style={{
              width: 8 + (i % 3) * 4,
              height: 8 + (i % 3) * 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.08)",
              filter: "blur(1.5px)",
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
      {/* Header */}
      <div className="relative z-20 w-full">
        <Header />
      </div>
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto pt-28 md:pt-36 px-4 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border mb-6 bg-black/90 border-white text-white backdrop-blur-sm shadow-lg">
          <Eye className="w-4 h-4 text-white" />
          <span className="text-sm font-medium">
            {t("maya_ai_design_gallery")}
          </span>
        </div>
        <h1
          className={`text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-xl ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {t("explore_our_residential_designs")}
        </h1>
        <p
          className={`text-lg md:text-xl mb-12 max-w-2xl mx-auto ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {t("discover_curated_collection_residential")}
        </p>
      </section>
      {/* Filter Navigation */}
      <nav className="flex justify-center mb-12">
        <div
          className={`flex space-x-6 rounded-full px-8 py-4 shadow-xl transition-all duration-300 ${
            isDarkMode
              ? "bg-black/80 border border-white/10"
              : "bg-gradient-to-br from-white via-gray-100 to-gray-200 border border-gray-200/80"
          } backdrop-blur-md`}
        >
          {[
            { label: t("all_projects"), value: "all" },
            { label: t("interior_layouts"), value: "interior" },
            { label: t("exterior_designs"), value: "exterior" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 ${
                isDarkMode ? "focus:ring-white/40" : "focus:ring-black/20"
              }
                ${
                  activeFilter === filter.value
                    ? isDarkMode
                      ? "bg-white text-black shadow-2xl scale-110"
                      : "bg-black text-white shadow-2xl scale-110"
                    : isDarkMode
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-black/80 hover:text-black hover:bg-black/10"
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </nav>
      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-black to-gray-900 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-2 cursor-pointer"
              style={{
                animationDelay: `${index * 100}ms`,
                animationName: "fadeInUp",
                animationDuration: "0.7s",
                animationFillMode: "forwards",
                opacity: 0,
              }}
              onClick={() => openModal(index)}
            >
              <div className="relative aspect-[4/3] h-72 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* 3D overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none" />
                {/* Animated badge */}
                <div className="absolute top-4 right-4 bg-white/90 rounded-full px-4 py-1 text-xs font-semibold text-black shadow-xl backdrop-blur group-hover:scale-110 transition-transform duration-300 animate-float-3d">
                  {item.category.charAt(0).toUpperCase() +
                    item.category.slice(1)}
                </div>
                {/* Animated view icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="bg-black/70 rounded-full p-4 shadow-2xl backdrop-blur-lg animate-float-3d">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white opacity-100 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-base text-white drop-shadow font-semibold tracking-wide">
                  {t("ai_generated_design")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Modal/Lightbox */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg animate-fade-in-up">
          <button
            className="absolute top-8 right-8 text-white/80 hover:text-white p-3 rounded-full bg-black/60 shadow-xl"
            onClick={closeModal}
            aria-label="Close"
          >
            <X className="w-7 h-7" />
          </button>
          <button
            className="absolute left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-black/60 shadow-xl"
            onClick={prevModal}
            aria-label="Previous"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div className="relative max-w-3xl w-full flex flex-col items-center">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
              <Image
                src={filteredItems[modalIndex].image}
                alt={filteredItems[modalIndex].alt}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-white/90 rounded-full px-4 py-1 text-xs font-semibold text-black shadow-xl backdrop-blur">
                {filteredItems[modalIndex].category.charAt(0).toUpperCase() +
                  filteredItems[modalIndex].category.slice(1)}
              </div>
            </div>
            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                {t("ai_generated_design")}
              </h2>
              <p className="text-lg text-gray-200">
                {filteredItems[modalIndex].alt}
              </p>
            </div>
          </div>
          <button
            className="absolute right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-black/60 shadow-xl"
            onClick={nextModal}
            aria-label="Next"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      )}
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
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
      `}</style>
    </div>
  );
}
