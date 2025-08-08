"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import AdminAuthService from "@/lib/admin-auth";
import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("=== LAYOUT AUTH CHECK ===");
        console.log("Current pathname:", pathname);

        // Skip auth check for login page
        if (pathname === "/admin/login") {
          console.log("Login page detected, skipping auth check");
          setIsLoading(false);
          return;
        }

        console.log("Checking authentication...");

        // Check if user is authenticated
        const isAuth = AdminAuthService.isAuthenticated();
        console.log("isAuthenticated():", isAuth);

        if (!isAuth) {
          console.error("❌ User not authenticated, redirecting to login");
          console.log(
            "Token:",
            localStorage.getItem("adminToken") ? "Present" : "Missing"
          );
          console.log(
            "User:",
            localStorage.getItem("adminUser") ? "Present" : "Missing"
          );
          router.push("/admin/login");
          return;
        }

        console.log("✅ User authenticated, verifying token...");

        // Verify token with backend
        const isValid = await AdminAuthService.verifyToken();
        console.log("Token verification result:", isValid);

        if (!isValid) {
          console.error("❌ Token verification failed, clearing auth data");
          AdminAuthService.clearAuthData();
          router.push("/admin/login");
          return;
        }

        console.log("✅ Token verified, getting user data...");

        // Get current user data
        const user = AdminAuthService.getCurrentUser();
        console.log("Current user:", user);

        if (!user) {
          console.error("❌ No user data found, clearing auth data");
          AdminAuthService.clearAuthData();
          router.push("/admin/login");
          return;
        }

        console.log("✅ Authentication successful, setting user");
        setAdminUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("❌ Auth check error:", error);
        AdminAuthService.clearAuthData();
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
        console.log("=== LAYOUT AUTH CHECK END ===");
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    AdminAuthService.logout();
  };

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated && pathname !== "/admin/login") {
    return null;
  }

  // Show login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show admin layout with sidebar and header
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <AdminHeader
          user={adminUser}
          onMenuToggle={handleMenuToggle}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar - hidden on mobile when menu is closed */}
          <div
            className={`${
              isMobileMenuOpen ? "block" : "hidden"
            } md:block fixed md:relative inset-y-0 left-0 z-40`}
          >
            <AdminSidebar onLogout={handleLogout} />
          </div>

          {/* Mobile overlay */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Main content */}
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
