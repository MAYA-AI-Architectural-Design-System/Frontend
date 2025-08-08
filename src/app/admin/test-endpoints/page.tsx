"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import AdminAPI from "@/lib/admin-api";
import { BACKEND_CONFIG } from "@/lib/config";

export default function AdminTestEndpointsPage() {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const testEndpoint = async (name: string, testFn: () => Promise<any>) => {
    try {
      setTestResults((prev) => ({ ...prev, [name]: { status: "loading" } }));
      const result = await testFn();
      setTestResults((prev) => ({
        ...prev,
        [name]: {
          status: "success",
          data: result,
          timestamp: new Date().toLocaleTimeString(),
        },
      }));
    } catch (error: any) {
      setTestResults((prev) => ({
        ...prev,
        [name]: {
          status: "error",
          error: error.message,
          timestamp: new Date().toLocaleTimeString(),
        },
      }));
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);

    // Test basic endpoints
    await testEndpoint("Dashboard Stats", () => AdminAPI.getDashboardStats());
    await testEndpoint("User Statistics", () => AdminAPI.getUserStatistics());
    await testEndpoint("Project Statistics", () =>
      AdminAPI.getProjectStatistics()
    );
    await testEndpoint("Security Metrics", () => AdminAPI.getSecurityMetrics());
    await testEndpoint("System Settings", () => AdminAPI.getSystemSettings());

    // Test list endpoints
    await testEndpoint("Get Users", () => AdminAPI.getUsers({ limit: 5 }));
    await testEndpoint("Get Projects", () =>
      AdminAPI.getProjects({ limit: 5 })
    );
    await testEndpoint("Get Chats", () => AdminAPI.getChats({ limit: 5 }));

    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "loading":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            API Endpoint Tests
          </h1>
          <p className="text-muted-foreground">
            Test all admin API endpoints to ensure they're working correctly
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={runAllTests} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Run All Tests
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Backend Info */}
      <Card>
        <CardHeader>
          <CardTitle>Backend Configuration</CardTitle>
          <CardDescription>Current backend settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Backend URL:</strong> {BACKEND_CONFIG.BASE_URL}
            </p>
            <p>
              <strong>Environment:</strong> {process.env.NODE_ENV}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(testResults).map(([name, result]) => (
          <Card key={name}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getStatusIcon(result.status)}
                <span className={getStatusColor(result.status)}>{name}</span>
              </CardTitle>
              <CardDescription>
                {result.timestamp && `Tested at ${result.timestamp}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.status === "success" && (
                <div className="space-y-2">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Endpoint working correctly
                    </AlertDescription>
                  </Alert>
                  <details className="text-sm">
                    <summary className="cursor-pointer">
                      View Response Data
                    </summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                </div>
              )}

              {result.status === "error" && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{result.error}</AlertDescription>
                </Alert>
              )}

              {result.status === "loading" && (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Testing endpoint...</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Individual Test Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Tests</CardTitle>
          <CardDescription>Test specific endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                testEndpoint("Dashboard Stats", () =>
                  AdminAPI.getDashboardStats()
                )
              }
            >
              Dashboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                testEndpoint("User Stats", () => AdminAPI.getUserStatistics())
              }
            >
              User Stats
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                testEndpoint("Project Stats", () =>
                  AdminAPI.getProjectStatistics()
                )
              }
            >
              Project Stats
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                testEndpoint("Security", () => AdminAPI.getSecurityMetrics())
              }
            >
              Security
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                testEndpoint("Settings", () => AdminAPI.getSystemSettings())
              }
            >
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                testEndpoint("Users List", () =>
                  AdminAPI.getUsers({ limit: 5 })
                )
              }
            >
              Users
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                testEndpoint("Projects List", () =>
                  AdminAPI.getProjects({ limit: 5 })
                )
              }
            >
              Projects
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                testEndpoint("Chats List", () =>
                  AdminAPI.getChats({ limit: 5 })
                )
              }
            >
              Chats
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



