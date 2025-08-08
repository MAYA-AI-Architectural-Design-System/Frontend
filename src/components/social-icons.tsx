import { Twitter, Facebook, Instagram, Github } from "lucide-react";

export function SocialIcons() {
  return (
    <div className="flex gap-4">
      <a
        href="#"
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Twitter className="w-5 h-5" />
      </a>
      <a
        href="#"
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Facebook className="w-5 h-5" />
      </a>
      <a
        href="#"
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Instagram className="w-5 h-5" />
      </a>
      <a
        href="#"
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Github className="w-5 h-5" />
      </a>
    </div>
  );
}
