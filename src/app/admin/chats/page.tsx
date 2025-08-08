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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  MessageSquare,
  Search,
  Filter,
  MoreHorizontal,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Eye,
  Trash2,
  User,
  Clock,
  MessageCircle,
  TrendingUp,
  Activity,
  BarChart3,
} from "lucide-react";
import AdminAPI, { AdminChat, AdvancedAnalytics } from "@/lib/admin-api";

export default function AdminChatsPage() {
  const router = useRouter();
  const [chats, setChats] = useState<AdminChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    total: 0,
    active: 0,
    completed: 0,
  });
  const [analytics, setAnalytics] = useState<AdvancedAnalytics | null>(null);

  const fetchChats = async (page = 1, search = "") => {
    try {
      setIsLoading(true);
      setError("");

      const params: any = {
        offset: (page - 1) * 20, // Convert page to offset
        limit: 20,
      };

      if (search) params.search = search;

      const result = await AdminAPI.getChats(params);

      if (result.error) {
        setError(result.error);
        return;
      }

      const data = result.data;
      if (data) {
        const chatsData = data.chats || [];
        setChats(chatsData);
        // Calculate metrics from the actual chat data
        calculateMetrics(chatsData);
        // Calculate total pages based on total and limit
        setTotalPages(Math.ceil((data.total || 0) / 20));
        setCurrentPage(page);
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch chats");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = (chatsData: AdminChat[]) => {
    const total = chatsData.length;
    const active = chatsData.filter(
      (chat) => chat.status?.toLowerCase() === "active"
    ).length;
    const completed = chatsData.filter(
      (chat) => chat.status?.toLowerCase() === "completed"
    ).length;

    setMetrics({
      total,
      active,
      completed,
    });
  };

  const fetchAnalytics = async () => {
    try {
      const result = await AdminAPI.getAdvancedAnalytics();
      if (!result.error && result.data) {
        setAnalytics(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  useEffect(() => {
    fetchChats();
    fetchAnalytics();
  }, []);

  const handleSearch = () => {
    fetchChats(1, searchTerm);
  };

  const handlePageChange = (page: number) => {
    fetchChats(page, searchTerm);
  };

  const handleChatAction = async (chatId: string, action: string) => {
    try {
      setIsActionLoading(chatId);
      switch (action) {
        case "view":
          // Navigate to chat view
          window.open(`/admin/chats/${chatId}`, "_blank");
          break;
        case "delete":
          const result = await AdminAPI.deleteChat(chatId);
          if (result.error) {
            setError(result.error);
          } else {
            // Refresh chats list
            fetchChats(currentPage, searchTerm);
          }
          break;
      }
    } catch (error: any) {
      setError(error.message || `Failed to ${action} chat`);
    } finally {
      setIsActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <Activity className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <MessageCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "archived":
        return (
          <Badge variant="outline" className="text-gray-600">
            <Clock className="w-3 h-3 mr-1" />
            Archived
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatMessageCount = (count: number) => {
    if (count === 0) return "No messages";
    if (count === 1) return "1 message";
    return `${count} messages`;
  };

  if (isLoading && chats.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chat Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage chat conversations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/chats/metrics")}
            size="sm"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button
            onClick={() => {
              fetchChats(currentPage, searchTerm);
              fetchAnalytics();
            }}
            disabled={isLoading}
            size="sm"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Chat Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All conversations</p>
          </CardContent>
        </Card>



        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Chats
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metrics.completed.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
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
              {chats
                .reduce((total, chat) => total + (chat.messageCount || 0), 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all chats</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {(analytics?.userStats?.totalUsers || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              {(analytics?.projectStats?.totalProjects || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Created projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Chats</CardTitle>
          <CardDescription>Search by chat title or user name</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              <Filter className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chats Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Chats ({chats.length} shown of {metrics.total} total)
          </CardTitle>
          <CardDescription>
            Monitor and manage all chat conversations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chat</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chats.map((chat) => (
                  <TableRow key={chat.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{chat.title}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {chat.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{chat.user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {chat.user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(chat.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatMessageCount(chat.messageCount)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {new Date(chat.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-muted-foreground">
                          {new Date(chat.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {chat.lastMessageAt ? (
                        <div className="text-sm">
                          <div>
                            {new Date(chat.lastMessageAt).toLocaleDateString()}
                          </div>
                          <div className="text-muted-foreground">
                            {new Date(chat.lastMessageAt).toLocaleTimeString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No activity
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleChatAction(chat.id, "view")}
                            disabled={isActionLoading === chat.id}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Chat
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleChatAction(chat.id, "delete")}
                            disabled={isActionLoading === chat.id}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Chat
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Chat Insights</CardTitle>
          <CardDescription>
            Key metrics and patterns in chat conversations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {chats.length > 0
                  ? Math.round(
                      chats.reduce(
                        (total, chat) => total + (chat.messageCount || 0),
                        0
                      ) / chats.length
                    )
                  : 0}
              </div>
              <div className="text-sm text-muted-foreground">
                Avg Messages per Chat
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {metrics.total > 0
                  ? Math.round((metrics.completed / metrics.total) * 100)
                  : 0}
                %
              </div>
              <div className="text-sm text-muted-foreground">
                Completion Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {metrics.total > 0
                  ? Math.round((metrics.active / metrics.total) * 100)
                  : 0}
                %
              </div>
              <div className="text-sm text-muted-foreground">Active Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
