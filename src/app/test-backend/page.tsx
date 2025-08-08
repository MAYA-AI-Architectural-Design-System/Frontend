"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestBackendPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testBackendConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/test-auth");
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({
        success: false,
        message: "Failed to test backend connection",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Backend Connection Test
        </h1>

        <Button
          onClick={testBackendConnection}
          disabled={isLoading}
          className="w-full mb-6"
        >
          {isLoading ? "Testing..." : "Test Backend Connection"}
        </Button>

        {testResult && (
          <div
            className={`p-4 rounded-lg ${
              testResult.success
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            }`}
          >
            <h3
              className={`font-semibold mb-2 ${
                testResult.success
                  ? "text-green-800 dark:text-green-200"
                  : "text-red-800 dark:text-red-200"
              }`}
            >
              {testResult.success ? "✅ Success" : "❌ Failed"}
            </h3>
            <p
              className={`text-sm ${
                testResult.success
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300"
              }`}
            >
              {testResult.message}
            </p>
            {testResult.backendUrl && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Backend URL: {testResult.backendUrl}
              </p>
            )}
            {testResult.error && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                Error: {testResult.error}
              </p>
            )}
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          <h4 className="font-semibold mb-2">Available Endpoints:</h4>
          <ul className="space-y-1 text-xs">
            <li>• POST /auth/forgot-password</li>
            <li>• POST /auth/reset-password</li>
            <li>• POST /auth/change-password</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
