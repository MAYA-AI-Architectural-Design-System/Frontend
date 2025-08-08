"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface PreloaderContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const PreloaderContext = createContext<PreloaderContextType | undefined>(
  undefined,
);

export const usePreloader = () => {
  const context = useContext(PreloaderContext);
  if (context === undefined) {
    throw new Error("usePreloader must be used within a PreloaderProvider");
  }
  return context;
};

interface PreloaderProviderProps {
  children: ReactNode;
}

export const PreloaderProvider: React.FC<PreloaderProviderProps> = ({
  children,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only start preloader on client after mount
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const startLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  if (!mounted) return null;

  return (
    <PreloaderContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </PreloaderContext.Provider>
  );
};
