"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface VideoSectionProps {
  videoId: string;
  title?: string;
  description?: string;
}

export function VideoSection({
  videoId,
  title = "Maya AI Architectural Design Demo",
  description = "Bring your architectural concepts to life with AI-powered video generation. No more static blueprints—experience immersive, dynamic 3D animations that showcase your designs in stunning detail.",
}: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  // YouTube thumbnail URLs (different quality options)
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackThumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Decorative Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-gray-200 to-transparent opacity-30"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-gray-200 to-transparent opacity-30"></div>
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-30"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-30"></div>
      </div>

      <div className="relative z-10 px-8 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-serif text-gray-900 leading-tight mb-8 animate-fade-in-up">
              From Vision To Reality
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
              {description}
            </p>
          </div>

          {/* Video Section */}
          <div className="relative max-w-4xl mx-auto animate-scale-in animate-delay-400">
            {!isPlaying ? (
              // Thumbnail with Play Button
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                onClick={handlePlayClick}
              >
                <div className="relative aspect-video">
                  <Image
                    src={thumbnailUrl || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      // Fallback to lower quality thumbnail if maxres fails
                      const target = e.target as HTMLImageElement;
                      target.src = fallbackThumbnailUrl;
                    }}
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                      <Play
                        className="w-8 h-8 text-gray-800 ml-1"
                        fill="currentColor"
                      />
                    </div>
                  </div>

                  {/* Video Title Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                      <h3 className="text-white text-lg font-semibold mb-1">
                        {title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        Click to play video
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // YouTube Video Player
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>

                {/* Close/Reset Button */}
                <button
                  onClick={() => setIsPlaying(false)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-200"
                  aria-label="Close video"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="text-center mt-12 animate-fade-in-up animate-delay-600">
            <p className="text-gray-500 text-sm">
              Experience the future of architectural design with Maya AI
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
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

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.8s ease-out forwards;
        }

        .animate-delay-200 {
          animation-delay: 0.2s;
        }

        .animate-delay-400 {
          animation-delay: 0.4s;
        }

        .animate-delay-600 {
          animation-delay: 0.6s;
        }

        .aspect-video {
          aspect-ratio: 16 / 9;
        }
      `}</style>
    </div>
  );
}
