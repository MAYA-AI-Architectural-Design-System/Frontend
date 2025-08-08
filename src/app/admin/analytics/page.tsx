"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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
  TrendingUp,
  Activity,
  RefreshCw,
  Loader2,
  AlertTriangle,
  BarChart3,
  PieChart,
  Target,
  Zap,
  Database,
  UserCheck,
  UserX,
  Crown,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import AdminAPI, { AdvancedAnalytics } from "@/lib/admin-api";

export default function AdminAnalyticsPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AdvancedAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError("");

      const result = await AdminAPI.getAdvancedAnalytics();

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.data) {
        setAnalytics(result.data);
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch analytics");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAnalytics();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatNumber = (num: number | undefined | null) => {
    if (num === undefined || num === null) return "0";
    return num.toLocaleString();
  };

  const getPercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // Modern Animated Bar Chart Component
  const ModernBarChart = ({
    data,
  }: {
    data: { name: string; value: number; color: string }[];
  }) => {
    const maxValue = Math.max(...data.map((d) => d.value));
    const safeMaxValue = maxValue > 0 ? maxValue : 1;

    return (
      <div className="space-y-6">
        {data.map((item, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              <span className="text-lg font-bold">
                {formatNumber(item.value)}
              </span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${(item.value / safeMaxValue) * 100}%`,
                    backgroundColor: item.color,
                    backgroundImage: `linear-gradient(90deg, ${item.color} 0%, ${item.color}dd 100%)`,
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Modern Donut Chart Component
  const ModernDonutChart = ({
    data,
  }: {
    data: { name: string; value: number; color: string }[];
  }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const safeTotal = total > 0 ? total : 1;

    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          {data.map((item, index) => {
            const percentage = (item.value / safeTotal) * 100;
            const circumference = 2 * Math.PI * 40;
            const strokeDasharray = (percentage / 100) * circumference;
            const strokeDashoffset = circumference - strokeDasharray;

            let startAngle = 0;
            for (let i = 0; i < index; i++) {
              startAngle += (data[i].value / safeTotal) * 360;
            }

            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={item.color}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                  transformOrigin: "50% 50%",
                  transform: `rotate(${startAngle}deg)`,
                }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">{formatNumber(total)}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>
      </div>
    );
  };

  // Modern Metric Card Component
  const MetricCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
    trend,
  }: {
    title: string;
    value: number;
    icon: any;
    color: string;
    subtitle: string;
    trend?: { value: number; isPositive: boolean };
  }) => (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: color }}
      />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-black dark:text-white">
          {title}
        </CardTitle>
        <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
          <Icon className="h-3 w-3 text-black dark:text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1 text-black dark:text-white">
          {formatNumber(value)}
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          {subtitle}
        </p>
        {trend && (
          <div className="flex items-center gap-1">
            <TrendingUp
              className={`w-3 h-3 ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>No analytics data available</AlertDescription>
        </Alert>
      </div>
    );
  }

  const userChartData = [
    {
      name: "Active Users",
      value: analytics.userStats.activeUsers,
      color: "#000000",
    },
    {
      name: "Blocked Users",
      value: analytics.userStats.blockedUsers,
      color: "#666666",
    },
    {
      name: "Admin Users",
      value: analytics.userStats.adminUsers,
      color: "#333333",
    },
  ];

  const projectChartData = [
    {
      name: "Active Projects",
      value: analytics.projectStats.activeProjects,
      color: "#000000",
    },
  ];

  const userDonutData = [
    {
      name: "Email Users",
      value: analytics.userStats.emailUsers,
      color: "#000000",
    },
    {
      name: "OAuth Users",
      value: analytics.userStats.oauthUsers,
      color: "#666666",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/admin/chats")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chats
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
              Comprehensive insights from your database
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-600"
          >
            <Database className="w-3 h-3" />
            Live Data
          </Badge>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            size="sm"
            variant="outline"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* User Statistics */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
          <Users className="w-5 h-5 text-black dark:text-white" />
          User Statistics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value={analytics.userStats.totalUsers}
            icon={Users}
            color="#000000"
            subtitle="Registered users in the system"
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Active Users"
            value={analytics.userStats.activeUsers}
            icon={UserCheck}
            color="#333333"
            subtitle="Currently active users"
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Blocked Users"
            value={analytics.userStats.blockedUsers}
            icon={UserX}
            color="#666666"
            subtitle="Suspended accounts"
            trend={{ value: 2, isPositive: false }}
          />
          <MetricCard
            title="Admin Users"
            value={analytics.userStats.adminUsers}
            icon={Crown}
            color="#999999"
            subtitle="Administrator accounts"
            trend={{ value: 0, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="relative overflow-hidden border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                <BarChart3 className="w-4 h-4 text-black dark:text-white" />
                <span className="text-sm">User Distribution</span>
              </CardTitle>
              <CardDescription className="text-xs text-gray-600 dark:text-gray-400">
                Breakdown of user types and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ModernBarChart data={userChartData} />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                <PieChart className="w-4 h-4 text-black dark:text-white" />
                <span className="text-sm">Authentication Methods</span>
              </CardTitle>
              <CardDescription className="text-xs text-gray-600 dark:text-gray-400">
                Email vs OAuth user distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ModernDonutChart data={userDonutData} />
              <div className="mt-6 space-y-2">
                {userDonutData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">
                      {formatNumber(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Project Statistics */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
          <FolderOpen className="w-5 h-5 text-black dark:text-white" />
          Project Statistics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Projects"
            value={analytics.projectStats.totalProjects}
            icon={FolderOpen}
            color="#000000"
            subtitle="All projects created"
            trend={{ value: 15, isPositive: true }}
          />
          <MetricCard
            title="Active Projects"
            value={analytics.projectStats.activeProjects}
            icon={Activity}
            color="#333333"
            subtitle="Currently in progress"
            trend={{ value: 10, isPositive: true }}
          />

          <MetricCard
            title="Today's Projects"
            value={analytics.projectStats.projectsCreatedToday}
            icon={Calendar}
            color="#999999"
            subtitle="Created today"
            trend={{ value: 3, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="relative overflow-hidden border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                <BarChart3 className="w-4 h-4 text-black dark:text-white" />
                <span className="text-sm">Project Status</span>
              </CardTitle>
              <CardDescription className="text-xs text-gray-600 dark:text-gray-400">
                Currently active projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ModernBarChart data={projectChartData} />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                <Target className="w-4 h-4 text-black dark:text-white" />
                <span className="text-sm">Project Timeline</span>
              </CardTitle>
              <CardDescription className="text-xs text-gray-600 dark:text-gray-400">
                Project creation over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-black dark:text-white" />
                    <span className="text-sm font-medium text-black dark:text-white">
                      This Week
                    </span>
                  </div>
                  <span className="text-lg font-bold text-black dark:text-white">
                    {formatNumber(
                      analytics.projectStats.projectsCreatedThisWeek
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-black dark:text-white" />
                    <span className="text-sm font-medium text-black dark:text-white">
                      This Month
                    </span>
                  </div>
                  <span className="text-lg font-bold text-black dark:text-white">
                    {formatNumber(
                      analytics.projectStats.projectsCreatedThisMonth
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
