import { Play } from "lucide-react";

export function PlayButton() {
  return (
    <button className="group relative w-20 h-20 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="absolute inset-0 rounded-full bg-white opacity-90 group-hover:opacity-100 transition-opacity" />
      <Play
        className="w-8 h-8 text-gray-800 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ml-1"
        fill="currentColor"
      />
    </button>
  );
}
