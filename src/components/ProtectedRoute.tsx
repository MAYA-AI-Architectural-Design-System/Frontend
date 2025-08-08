"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const getToken = () => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("maya_token") || localStorage.getItem("token")
      );
    }
    return null;
  };

  const removeToken = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("maya_token");
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();

      if (!token) {
        console.log("No token found, redirecting to login");
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
          }/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          console.log("Token invalid, redirecting to login");
          removeToken();
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error validating token:", error);
        removeToken();
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}




