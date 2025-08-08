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
  ArrowLeft,
  MessageSquare,
  TrendingUp,
  Users,
  Activity,
  Clock,
  Loader2,
  AlertTriangle,
  BarChart3,
  PieChart,
  Calendar,
} from "lucide-react";
import AdminAPI, { ChatMetrics } from "@/lib/admin-api";

export default function AdminChatMetricsPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<ChatMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Get all chats to calculate metrics
      const result = await AdminAPI.getChats({ limit: 1000 }); // Get more chats for better metrics

      if (result.error) {
        setError(result.error);
        return;
      }

      const data = result.data;
      if (data && data.chats) {
        // Calculate metrics from chat data
        const chats = data.chats;
        const totalChats = chats.length;
        const activeChats = chats.filter(
          (chat) => chat.status?.toLowerCase() === "active"
        ).length;
        const completedChats = chats.filter(
          (chat) => chat.status?.toLowerCase() === "completed"
        ).length;
        const totalMessages = chats.reduce(
          (total, chat) => total + (chat.messageCount || 0),
          0
        );
        const averageMessagesPerChat =
          totalChats > 0 ? Math.round(totalMessages / totalChats) : 0;

        // Calculate top users
        const userStats = chats.reduce((acc, chat) => {
          const userId = chat.user.id;
          if (!acc[userId]) {
            acc[userId] = {
              userId,
              name: chat.user.name,
              email: chat.user.email,
              chatCount: 0,
              messageCount: 0,
            };
          }
          acc[userId].chatCount++;
          acc[userId].messageCount += chat.messageCount || 0;
          return acc;
        }, {} as Record<string, any>);

        const topUsers = Object.values(userStats)
          .sort((a, b) => b.chatCount - a.chatCount)
          .slice(0, 5);

        const calculatedMetrics = {
          totalChats,
          activeChats,
          completedChats,
          totalMessages,
          averageMessagesPerChat,
          topUsers,
          chatGrowth: {
            daily: [totalChats], // Simplified - just show current total
            weekly: [totalChats],
            monthly: [totalChats],
          },
        };

        setMetrics(calculatedMetrics);
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch chat metrics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatPercentage = (value: number, total: number) => {
    if (total === 0) return "0%";
    return `${Math.round((value / total) * 100)}%`;
  };

  const getGrowthRate = (data: number[]) => {
    if (data.length < 2) return 0;
    const current = data[data.length - 1];
    const previous = data[data.length - 2];
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading chat metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/admin/chats")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chats
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/admin/chats")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chats
          </Button>
        </div>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>No metrics data available</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/admin/chats")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chats
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Chat Analytics
            </h1>
            <p className="text-muted-foreground">
              Detailed insights and metrics for chat conversations
            </p>
          </div>
        </div>
        <Button onClick={fetchMetrics} disabled={isLoading} size="sm">
          <BarChart3 className="w-4 h-4 mr-2" />
          Refresh Metrics
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metrics.totalChats)}
            </div>
            <p className="text-xs text-muted-foreground">
              All time conversations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(metrics.activeChats)}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active (
              {formatPercentage(metrics.activeChats, metrics.totalChats)})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Chats
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(metrics.completedChats)}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully completed (
              {formatPercentage(metrics.completedChats, metrics.totalChats)})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Messages
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatNumber(metrics.totalMessages)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all conversations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average Messages per Chat */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Message Statistics
            </CardTitle>
            <CardDescription>
              Average messages per chat and engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Average Messages per Chat
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {metrics.averageMessagesPerChat.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Messages</span>
                <span className="text-lg font-semibold">
                  {formatNumber(metrics.totalMessages)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Chats</span>
                <span className="text-lg font-semibold">
                  {formatNumber(metrics.totalChats)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Top Users
            </CardTitle>
            <CardDescription>
              Most active users by chat count and messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.topUsers.slice(0, 5).map((user, index) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {user.chatCount} chats
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.messageCount} messages
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Daily Growth
            </CardTitle>
            <CardDescription>
              Chat creation over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Latest Day</span>
                <span className="text-lg font-bold text-green-600">
                  {metrics.chatGrowth.daily[
                    metrics.chatGrowth.daily.length - 1
                  ] || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Growth Rate</span>
                <span
                  className={`text-sm font-semibold ${
                    getGrowthRate(metrics.chatGrowth.daily) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {getGrowthRate(metrics.chatGrowth.daily) >= 0 ? "+" : ""}
                  {getGrowthRate(metrics.chatGrowth.daily)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">7-Day Total</span>
                <span className="text-lg font-semibold">
                  {metrics.chatGrowth.daily.reduce((sum, val) => sum + val, 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Weekly Growth
            </CardTitle>
            <CardDescription>
              Chat creation over the last 7 weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Latest Week</span>
                <span className="text-lg font-bold text-blue-600">
                  {metrics.chatGrowth.weekly[
                    metrics.chatGrowth.weekly.length - 1
                  ] || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Growth Rate</span>
                <span
                  className={`text-sm font-semibold ${
                    getGrowthRate(metrics.chatGrowth.weekly) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {getGrowthRate(metrics.chatGrowth.weekly) >= 0 ? "+" : ""}
                  {getGrowthRate(metrics.chatGrowth.weekly)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">7-Week Total</span>
                <span className="text-lg font-semibold">
                  {metrics.chatGrowth.weekly.reduce((sum, val) => sum + val, 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Monthly Growth
            </CardTitle>
            <CardDescription>
              Chat creation over the last 7 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Latest Month</span>
                <span className="text-lg font-bold text-purple-600">
                  {metrics.chatGrowth.monthly[
                    metrics.chatGrowth.monthly.length - 1
                  ] || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Growth Rate</span>
                <span
                  className={`text-sm font-semibold ${
                    getGrowthRate(metrics.chatGrowth.monthly) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {getGrowthRate(metrics.chatGrowth.monthly) >= 0 ? "+" : ""}
                  {getGrowthRate(metrics.chatGrowth.monthly)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">7-Month Total</span>
                <span className="text-lg font-semibold">
                  {metrics.chatGrowth.monthly.reduce(
                    (sum, val) => sum + val,
                    0
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>
            Important patterns and trends in chat usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatPercentage(metrics.activeChats, metrics.totalChats)}
              </div>
              <div className="text-sm text-muted-foreground">Active Rate</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatPercentage(metrics.completedChats, metrics.totalChats)}
              </div>
              <div className="text-sm text-muted-foreground">
                Completion Rate
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {metrics.averageMessagesPerChat.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                Avg Messages/Chat
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {metrics.topUsers.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Top Users Tracked
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
