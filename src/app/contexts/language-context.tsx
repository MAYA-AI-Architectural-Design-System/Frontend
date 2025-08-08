"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import i18n from "../../i18n";

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("am");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if there's a saved language preference in localStorage
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    } else {
      // Set default language to Amharic
      setLanguage("am");
      i18n.changeLanguage("am");
      console.log("Set default language to Amharic");
    }
  }, []);

  // Ensure i18n is initialized with the correct language
  useEffect(() => {
    if (mounted && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, mounted]);

  const handleSetLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (mounted) {
      localStorage.setItem("language", newLanguage);
    }
    if (i18n.language !== newLanguage) {
      i18n.changeLanguage(newLanguage);
      console.log("Changed language to:", newLanguage);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
