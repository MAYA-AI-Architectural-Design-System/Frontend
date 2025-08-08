"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

interface ElevenLabsWidgetProps {
  agentId: string;
}

declare global {
  interface Window {
    ElevenLabsConvai?: {
      init: (config: any) => void;
      sendMessage?: (message: string) => void;
      start?: () => void;
      stop?: () => void;
    };
  }
}

export default function ElevenLabsWidget({ agentId }: ElevenLabsWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { theme } = useTheme();
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);

  // Handle voice navigation commands
  const handleVoiceNavigation = (action: string, data: any) => {
    const command = action.toLowerCase().trim();

    // Navigation commands
    if (command.includes("home") || command.includes("main page")) {
      router.push("/");
      return;
    }

    if (command.includes("service") || command.includes("services")) {
      router.push("/service");
      return;
    }

    if (command.includes("gallery")) {
      router.push("/gallery");
      return;
    }

    if (command.includes("contact")) {
      router.push("/contact");
      return;
    }

    if (command.includes("about")) {
      router.push("/about");
      return;
    }

    if (command.includes("download") || command.includes("software")) {
      router.push("/soft-download");
      return;
    }

    if (command.includes("login") || command.includes("sign in")) {
      router.push("/login");
      return;
    }

    if (
      command.includes("register") ||
      command.includes("sign up") ||
      command.includes("create account")
    ) {
      router.push("/register");
      return;
    }

    // Special commands
    if (command.includes("dark mode") || command.includes("dark theme")) {
      document.documentElement.classList.add("dark");
      return;
    }

    if (command.includes("light mode") || command.includes("light theme")) {
      document.documentElement.classList.remove("dark");
      return;
    }

    console.log("Unknown navigation command:", action);
  };

  // Handle voice login command
  const handleVoiceLogin = () => {
    router.push("/login");
  };

  // Handle voice register command
  const handleVoiceRegister = () => {
    router.push("/register");
  };

  // Handle form interactions
  const handleFormInteraction = (action: string, data: any) => {
    const command = action.toLowerCase().trim();

    if (command.includes("fill") || command.includes("enter")) {
      // Handle form filling commands
      console.log("Form interaction:", action, data);
    }
  };

  // Handle click interactions
  const handleClickInteraction = (action: string, data: any) => {
    const command = action.toLowerCase().trim();

    if (
      command.includes("click") ||
      command.includes("press") ||
      command.includes("tap")
    ) {
      // Handle click commands
      console.log("Click interaction:", action, data);
    }
  };

  useEffect(() => {
    // Load the ElevenLabs widget script
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    script.type = "text/javascript";

    script.onload = () => {
      // Initialize the widget after script loads
      if (window.ElevenLabsConvai && widgetRef.current) {
        window.ElevenLabsConvai.init({
          agentId: agentId,
          container: widgetRef.current,
          // Theme configuration based on current theme
          theme: theme === "dark" ? "dark" : "light",
          position: "bottom-right",
          size: "medium",
          language: "en",
          // Voice settings
          voice: {
            voiceId: "default",
            speed: 1.0,
            stability: 0.5,
            clarity: 0.75,
          },
          // UI customization
          ui: {
            showAvatar: true,
            showTranscript: true,
            showControls: true,
            autoStart: false,
            // Custom styling
            customStyles: {
              widgetContainer: {
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              },
              button: {
                backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                color: theme === "dark" ? "#ffffff" : "#000000",
                border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
              },
            },
          },
          // Callback functions for voice interactions
          callbacks: {
            onStart: () => {
              console.log("ElevenLabs widget started");
              setIsWidgetLoaded(true);
            },
            onStop: () => {
              console.log("ElevenLabs widget stopped");
            },
            onError: (error: any) => {
              console.error("ElevenLabs widget error:", error);
            },
            onNavigation: (action: string, data: any) => {
              console.log("Navigation command:", action, data);
              handleVoiceNavigation(action, data);
            },
            onLogin: () => {
              console.log("Login command received");
              handleVoiceLogin();
            },
            onRegister: () => {
              console.log("Register command received");
              handleVoiceRegister();
            },
            onFormInteraction: (action: string, data: any) => {
              console.log("Form interaction:", action, data);
              handleFormInteraction(action, data);
            },
            onClickInteraction: (action: string, data: any) => {
              console.log("Click interaction:", action, data);
              handleClickInteraction(action, data);
            },
            onMessage: (message: string) => {
              console.log("Voice message received:", message);
              // Handle general voice messages
              if (message.toLowerCase().includes("help")) {
                // Provide help information
                console.log("Help requested via voice");
              }
            },
            onThemeChange: (newTheme: string) => {
              console.log("Theme change requested:", newTheme);
              // Handle theme changes from voice
            },
          },
          // Website context for the AI agent
          context: {
            websiteName: "Maya AI",
            websiteDescription:
              "Advanced AI-powered architecture and design platform",
            availablePages: [
              { name: "Home", path: "/", description: "Main landing page" },
              {
                name: "Services",
                path: "/service",
                description: "Our AI architecture services",
              },
              {
                name: "Gallery",
                path: "/gallery",
                description: "Portfolio of AI-generated designs",
              },
              {
                name: "Contact",
                path: "/contact",
                description: "Get in touch with us",
              },
              {
                name: "About",
                path: "/about",
                description: "Learn more about Maya AI",
              },
              {
                name: "Download",
                path: "/soft-download",
                description: "Download our software",
              },
              {
                name: "Login",
                path: "/login",
                description: "Sign in to your account",
              },
              {
                name: "Register",
                path: "/register",
                description: "Create a new account",
              },
            ],
            features: [
              "AI-powered architecture design",
              "3D rendering and visualization",
              "Interior and exterior design",
              "Floor plan generation",
              "Voice-controlled navigation",
              "Multi-language support",
            ],
          },
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [agentId, router, theme]);

  return (
    <div
      ref={widgetRef}
      id="elevenlabs-convai-widget"
      className="fixed bottom-4 right-4 z-[9999]"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
      }}
    >
      {/* The widget will be injected here by the ElevenLabs script */}
    </div>
  );
}
