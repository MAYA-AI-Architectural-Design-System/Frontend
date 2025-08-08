"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { mayaLogoDark, mayaLogoLight } from "@/assets/images";

export default function Loading() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = mounted && theme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-700 ${
        isDark ? "bg-black/70" : "bg-white/70"
      }`}
      style={{
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
      }}
    >
      {/* Strong blurred, glowing background behind logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <div
          className={`absolute w-[340px] h-[340px] rounded-full ${
            isDark ? "bg-white/20" : "bg-black/20"
          } blur-3xl opacity-80 animate-logo-glow-bg`}
        ></div>
        <div
          className={`absolute w-[220px] h-[220px] rounded-full ${
            isDark ? "bg-white/10" : "bg-black/10"
          } blur-2xl opacity-60 animate-logo-glow-bg`}
        ></div>
      </div>

      <div className="relative flex flex-col items-center gap-10 animate-fade-in">
        {/* Main logo with enhanced animation and glow */}
        <div className="relative flex items-center justify-center">
          <div
            className={`w-44 h-44 rounded-full border-4 ${
              isDark ? "border-white/30" : "border-black/30"
            } animate-spin-slow`}
          ></div>
          <div
            className={`absolute w-36 h-36 rounded-full border-2 ${
              isDark ? "border-white/20" : "border-black/20"
            } animate-spin-reverse`}
          ></div>
          <div
            className={`absolute w-28 h-28 rounded-full ${
              isDark ? "bg-white/10" : "bg-black/10"
            } animate-pulse`}
          ></div>
          {/* Subtle glowing background behind logo */}
          <div
            className={`absolute w-32 h-32 rounded-full ${
              isDark ? "bg-white/40" : "bg-black/40"
            } blur-2xl opacity-80 animate-logo-glow-bg`}
          ></div>
          {/* Maya Logo - much larger and with strong glow */}
          <div className="absolute flex items-center justify-center">
            <img
              src={isDark ? mayaLogoDark.src : mayaLogoLight.src}
              alt="Maya AI"
              className="w-32 h-32 animate-logo-glow drop-shadow-2xl"
              style={{
                filter: isDark
                  ? "drop-shadow(0 0 32px #fff) drop-shadow(0 0 12px #fff)"
                  : "drop-shadow(0 0 24px #000) drop-shadow(0 0 8px #000)",
              }}
            />
          </div>
        </div>

        {/* Loading text with enhanced typography */}
        <div className="text-center space-y-2">
          <div
            className={`text-3xl font-extrabold tracking-widest uppercase ${
              isDark ? "text-white" : "text-black"
            } animate-text-glow drop-shadow-xl`}
          >
            MAYA AI
          </div>
          <div
            className={`text-lg font-semibold tracking-wide ${
              isDark ? "text-white/90" : "text-black/90"
            } animate-fade-in-delay`}
          >
            Crafting your digital experience...
          </div>
        </div>

        {/* Animated dots */}
        <div className="flex space-x-3 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${
                isDark ? "bg-white/90" : "bg-black/90"
              } animate-bounce`}
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        .animate-spin-reverse {
          animation: spinReverse 2.5s linear infinite;
        }
        .animate-logo-glow {
          animation: logoGlow 2s ease-in-out infinite alternate;
        }
        .animate-logo-glow-bg {
          animation: logoGlowBg 2.5s ease-in-out infinite alternate;
        }
        .animate-text-glow {
          animation: textGlow 2s ease-in-out infinite alternate;
        }
        .animate-fade-in {
          animation: fadeIn 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .animate-fade-in-delay {
          animation: fadeIn 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes spinReverse {
          0% {
            transform: rotate(360deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        @keyframes logoGlow {
          0% {
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.4));
          }
          100% {
            filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.9));
          }
        }
        @keyframes logoGlowBg {
          0% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes textGlow {
          0% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          }
          100% {
            text-shadow: 0 0 30px rgba(255, 255, 255, 0.7);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
