"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  User,
  MessageSquare,
  Clock,
  Calendar,
  Trash2,
  Loader2,
  AlertTriangle,
  Activity,
  MessageCircle,
} from "lucide-react";
import AdminAPI, { ChatDetail } from "@/lib/admin-api";

export default function AdminChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;

  const [chat, setChat] = useState<ChatDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchChat = async () => {
    try {
      setIsLoading(true);
      setError("");

      const result = await AdminAPI.getChat(chatId);

      if (result.error) {
        setError(result.error);
        return;
      }

      const data = result.data;
      if (data) {
        setChat(data);
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch chat details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatId) {
      fetchChat();
    }
  }, [chatId]);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this chat? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      const result = await AdminAPI.deleteChat(chatId);

      if (result.error) {
        setError(result.error);
      } else {
        // Redirect back to chats list
        router.push("/admin/chats");
      }
    } catch (error: any) {
      setError(error.message || "Failed to delete chat");
    } finally {
      setIsDeleting(false);
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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      relative: getRelativeTime(date),
    };
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading chat details...</p>
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

  if (!chat) {
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
          <AlertDescription>Chat not found</AlertDescription>
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
            <h1 className="text-3xl font-bold tracking-tight">{chat.title}</h1>
            <p className="text-muted-foreground">Chat ID: {chat.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {getStatusBadge(chat.status)}
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Delete Chat
          </Button>
        </div>
      </div>

      {/* Chat Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div className="font-medium">{chat.user.name}</div>
              <div className="text-muted-foreground">{chat.user.email}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {chat.user.isAdmin ? "Admin User" : "Regular User"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chat.totalMessages}</div>
            <p className="text-xs text-muted-foreground">Total messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div>{formatTimestamp(chat.createdAt).date}</div>
              <div className="text-muted-foreground">
                {formatTimestamp(chat.createdAt).time}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <div>{formatTimestamp(chat.lastMessageAt).date}</div>
              <div className="text-muted-foreground">
                {formatTimestamp(chat.lastMessageAt).relative}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Messages ({chat.messages.length})</CardTitle>
          <CardDescription>Complete conversation history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chat.messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No messages in this chat
              </div>
            ) : (
              chat.messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex gap-4 p-4 rounded-lg border ${
                    message.type === "user"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {message.type === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <MessageSquare className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium capitalize">
                        {message.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(message.timestamp).relative}
                      </span>
                    </div>
                    <div className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                    {/* Display images if present */}
                    {(message.aiImageUrl || message.uploadedImageUrl) && (
                      <div className="mt-3">
                        {message.aiImageUrl && (
                          <div className="mb-2">
                            <span className="text-xs text-muted-foreground">
                              AI Generated Image:
                            </span>
                            <img
                              src={message.aiImageUrl}
                              alt="AI Generated"
                              className="mt-1 max-w-xs rounded border"
                            />
                          </div>
                        )}
                        {message.uploadedImageUrl && (
                          <div>
                            <span className="text-xs text-muted-foreground">
                              Uploaded Image:
                            </span>
                            <img
                              src={message.uploadedImageUrl}
                              alt="Uploaded"
                              className="mt-1 max-w-xs rounded border"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
