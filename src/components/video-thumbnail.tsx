"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";

interface VideoThumbnailProps {
  videoId: string;
  title?: string;
  className?: string;
  showTitle?: boolean;
}

export function VideoThumbnail({
  videoId,
  title = "Video",
  className = "",
  showTitle = true,
}: VideoThumbnailProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handleCloseClick = () => {
    setIsPlaying(false);
  };

  // YouTube thumbnail URLs
  const maxResThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const hqThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const defaultThumbnail = `https://img.youtube.com/vi/${videoId}/default.jpg`;

  const getThumbnailUrl = () => {
    if (!imageError) return maxResThumbnail;
    return hqThumbnail;
  };

  if (isPlaying) {
    return (
      <div className={`relative ${className}`}>
        <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        {/* Close Button */}
        <button
          onClick={handleCloseClick}
          className="absolute top-4 right-4 w-10 h-10 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-all duration-200 z-10"
          aria-label="Close video"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`relative cursor-pointer group ${className}`}
      onClick={handlePlayClick}
    >
      <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
        <Image
          src={getThumbnailUrl() || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:bg-white group-hover:scale-110 transition-all duration-300">
            <Play
              className="w-6 h-6 md:w-8 md:h-8 text-gray-800 ml-1"
              fill="currentColor"
            />
          </div>
        </div>

        {/* Video Title Overlay */}
        {showTitle && (
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
              <h3 className="text-white text-sm md:text-base font-semibold truncate">
                {title}
              </h3>
              <p className="text-white/80 text-xs md:text-sm">Click to play</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
