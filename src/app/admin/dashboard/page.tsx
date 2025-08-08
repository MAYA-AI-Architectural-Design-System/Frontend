"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  FolderOpen,
  MessageSquare,
  Activity,
  RefreshCw,
  Loader2,
  AlertTriangle,
  BarChart3,
  Zap,
  ArrowRight,
} from "lucide-react";
import AdminAPI, { AdvancedAnalytics } from "@/lib/admin-api";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AdvancedAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      setError("");
      console.log("Fetching advanced analytics...");
      const result = await AdminAPI.getAdvancedAnalytics();

      if (result.error) {
        setError(result.error);
        return;
      }

      const data = result.data;
      if (data) {
        console.log("Advanced analytics received:", data);
        setAnalytics(data);
      }
    } catch (error: any) {
      console.error("Advanced analytics error:", error);
      setError(error.message || "Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardStats();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Maya AI administration panel
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analytics ? (
        <div className="space-y-6">
          {/* Main Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(analytics?.userStats?.totalUsers || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">System users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Projects
                </CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(
                    analytics?.projectStats?.totalProjects || 0
                  ).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">System projects</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(analytics?.userStats?.activeUsers || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Status
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Healthy</div>
                <p className="text-xs text-muted-foreground">
                  System operational
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 flex-col items-start"
                  onClick={() => router.push("/admin/users")}
                >
                  <Users className="mb-2 h-6 w-6" />
                  <div className="text-left">
                    <div className="font-medium">Manage Users</div>
                    <div className="text-xs text-muted-foreground">
                      User management
                    </div>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 flex-col items-start"
                  onClick={() => router.push("/admin/projects")}
                >
                  <FolderOpen className="mb-2 h-6 w-6" />
                  <div className="text-left">
                    <div className="font-medium">View Projects</div>
                    <div className="text-xs text-muted-foreground">
                      Project management
                    </div>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 flex-col items-start"
                  onClick={() => router.push("/admin/chats")}
                >
                  <MessageSquare className="mb-2 h-6 w-6" />
                  <div className="text-left">
                    <div className="font-medium">Monitor Chats</div>
                    <div className="text-xs text-muted-foreground">
                      Chat management
                    </div>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 flex-col items-start"
                  onClick={() => router.push("/admin/analytics")}
                >
                  <BarChart3 className="mb-2 h-6 w-6" />
                  <div className="text-left">
                    <div className="font-medium">View Analytics</div>
                    <div className="text-xs text-muted-foreground">
                      Detailed analytics
                    </div>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No dashboard data available</p>
        </div>
      )}
    </div>
  );
}
