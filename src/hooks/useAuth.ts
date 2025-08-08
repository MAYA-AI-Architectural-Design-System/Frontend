import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("maya_token") || localStorage.getItem("token");
    }
    return null;
  };

  const removeToken = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("maya_token");
      localStorage.removeItem("token");
    }
  };

  const validateToken = async (): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      } else {
        // Token is invalid
        removeToken();
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error("Error validating token:", error);
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const isValid = await validateToken();
      
      if (!isValid) {
        // Only redirect if we're not already on login page
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          router.push("/login");
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  return {
    user,
    isLoading,
    isAuthenticated,
    validateToken,
    logout,
    getToken,
  };
}




