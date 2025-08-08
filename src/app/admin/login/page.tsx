"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { mayaLogoDark, mayaLogoLight } from "@/assets/images";
import AdminAuthService from "@/lib/admin-auth";
import { BACKEND_CONFIG } from "@/lib/config";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    // Check if already authenticated
    if (AdminAuthService.isAuthenticated()) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("=== LOGIN DEBUG START ===");
      console.log("Form data:", { email, password: "***" });
      console.log("Backend URL:", BACKEND_CONFIG.BASE_URL);

      const response = await AdminAuthService.login(email, password);
      console.log("Login response:", response);

      if (response && response.token) {
        console.log("=== AUTHENTICATION SUCCESS ===");
        console.log("Token received:", response.token ? "✅" : "❌");
        console.log("User data:", response.user);

        // Store authentication data
        localStorage.setItem("adminToken", response.token);
        localStorage.setItem("adminUser", JSON.stringify(response.user));

        console.log("=== STORAGE VERIFICATION ===");
        console.log(
          "Stored token:",
          localStorage.getItem("adminToken") ? "✅" : "❌"
        );
        console.log(
          "Stored user:",
          localStorage.getItem("adminUser") ? "✅" : "❌"
        );

        // Check authentication status
        const isAuth = AdminAuthService.isAuthenticated();
        console.log("isAuthenticated():", isAuth);

        if (!isAuth) {
          console.error("❌ Authentication check failed after login!");
          setError("Authentication verification failed. Please try again.");
          return;
        }

        console.log("=== NAVIGATION START ===");
        console.log("Redirecting to:", "/admin/dashboard");

        // Force navigation to dashboard
        window.location.href = "/admin/dashboard";
      } else {
        console.error("❌ No token in response");
        setError("Login failed: No authentication token received");
      }
    } catch (error: unknown) {
      console.error("=== LOGIN ERROR ===");
      console.error("Error type:", typeof error);
      console.error("Error:", error);

      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);

        // Handle specific admin access error
        if (error.message.includes("Admin privileges required")) {
          setError(
            "Access denied: This account does not have admin privileges. Please contact your administrator."
          );
        } else if (error.message.includes("Account is deactivated")) {
          setError(
            "Account is deactivated. Please contact your administrator."
          );
        } else if (error.message.includes("Failed to fetch user profile")) {
          setError(
            "Profile fetch failed. The user profile endpoint may not be working correctly."
          );
        } else if (
          error.message.includes(
            "User profile does not contain admin information"
          )
        ) {
          setError(
            "User profile missing admin information. Please check backend configuration."
          );
        } else if (error.message.includes("Failed to fetch")) {
          setError(
            "Network error: Unable to connect to the server. Please check your internet connection."
          );
        } else if (error.message.includes("401")) {
          setError(
            "Invalid credentials. Please check your email and password."
          );
        } else if (error.message.includes("403")) {
          setError("Access forbidden. Please contact your administrator.");
        } else {
          setError(`Login failed: ${error.message}`);
        }
      } else {
        setError("An unexpected error occurred during login");
      }
    } finally {
      setIsLoading(false);
      console.log("=== LOGIN DEBUG END ===");
    }
  };

  const handleBackToWebsite = () => {
    router.push("/");
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDarkMode ? "bg-black text-white" : "bg-gray-50 text-black"
      }`}
    >
      <div className="w-full max-w-md p-6">
        {/* Back to Website Button */}
        <Button
          variant="ghost"
          onClick={handleBackToWebsite}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Website
        </Button>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={isDarkMode ? mayaLogoDark.src : mayaLogoLight.src}
            alt="Maya AI Logo"
            className="h-16 w-auto"
          />
        </div>

        <Card
          className={`shadow-xl border-0 ${
            isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white"
          }`}
        >
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold mb-2">
              Admin Login
            </CardTitle>
            <CardDescription className="text-base">
              Access the Maya AI administration panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert
                  variant={error.includes("✅") ? "default" : "destructive"}
                >
                  <AlertDescription>
                    <div className="whitespace-pre-wrap text-sm font-medium">
                      {error}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@maya-ai.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`h-12 text-base ${
                    isDarkMode ? "bg-gray-800 border-gray-600" : ""
                  }`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`h-12 text-base pr-10 ${
                      isDarkMode ? "bg-gray-800 border-gray-600" : ""
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In to Admin Panel"
                )}
              </Button>

              {/* Debug Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  console.log("=== DEBUG AUTH STATE ===");
                  console.log("Token:", localStorage.getItem("adminToken"));
                  console.log("User:", localStorage.getItem("adminUser"));
                  console.log(
                    "isAuthenticated:",
                    AdminAuthService.isAuthenticated()
                  );
                  console.log(
                    "Current User:",
                    AdminAuthService.getCurrentUser()
                  );
                  console.log("=== END DEBUG ===");

                  const token = localStorage.getItem("adminToken");
                  const user = localStorage.getItem("adminUser");
                  const isAuth = AdminAuthService.isAuthenticated();

                  setError(`Debug Info:
Token: ${token ? "Present" : "Missing"}
User: ${user ? "Present" : "Missing"}
isAuthenticated: ${isAuth}
Current Path: ${window.location.pathname}`);
                }}
              >
                Debug Auth State
              </Button>

              {/* Test Backend Connection */}
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={async () => {
                  try {
                    console.log("=== TESTING BACKEND CONNECTION ===");
                    console.log("Backend URL:", BACKEND_CONFIG.BASE_URL);

                    // First test a simple GET request to check connectivity
                    const healthResponse = await fetch(
                      `${BACKEND_CONFIG.BASE_URL}/`,
                      {
                        method: "GET",
                      }
                    );
                    console.log("Health check status:", healthResponse.status);

                    // Then test the login endpoint
                    const response = await fetch(
                      `${BACKEND_CONFIG.BASE_URL}/admin/auth/login`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          email: "test@test.com",
                          password: "test",
                        }),
                      }
                    );

                    console.log("Login endpoint status:", response.status);
                    console.log("Response headers:", response.headers);

                    if (response.ok) {
                      const text = await response.text();
                      console.log("Response text:", text);

                      if (text.trim()) {
                        try {
                          const data = JSON.parse(text);
                          console.log("Response data:", data);
                          setError(
                            "✅ Backend connection successful! Response received."
                          );
                        } catch (parseError) {
                          console.error("JSON parse error:", parseError);
                          setError(
                            "✅ Backend connected but response is not valid JSON"
                          );
                        }
                      } else {
                        setError("✅ Backend connected but response is empty");
                      }
                    } else {
                      const text = await response.text();
                      console.log("Error response text:", text);

                      let errorData: any = {};
                      if (text.trim()) {
                        try {
                          errorData = JSON.parse(text);
                        } catch (parseError) {
                          console.warn(
                            "Failed to parse error response:",
                            parseError
                          );
                        }
                      }

                      setError(
                        `❌ Backend connection failed: ${response.status} - ${
                          errorData.message || "Unknown error"
                        }`
                      );
                    }
                  } catch (error) {
                    console.error("Backend connection error:", error);
                    setError(
                      `❌ Backend connection error: ${
                        error instanceof Error ? error.message : "Unknown error"
                      }`
                    );
                  }
                }}
              >
                Test Backend Connection
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Maya AI. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
