import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "./contexts/language-context";
import { PreloaderProvider } from "./contexts/preloader-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maya AI - Architectural Design Platform",
  description:
    "AI-powered architectural design system for residential buildings",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <PreloaderProvider>{children}</PreloaderProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
