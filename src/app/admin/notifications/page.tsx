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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Bell,
  Mail,
  Send,
  Users,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react";
import AdminAPI from "@/lib/admin-api";

export default function AdminNotificationsPage() {
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState("");
  const [error, setError] = useState("");
  const [broadcastData, setBroadcastData] = useState({
    subject: "",
    message: "",
    recipients: [] as string[],
    sendToAllUsers: false,
  });

  const handleSendBroadcast = async () => {
    try {
      setIsSending(true);
      setError("");
      setSendStatus("Preparing broadcast...");

      const data = await AdminAPI.sendEmailBroadcast({
        subject: broadcastData.subject,
        message: broadcastData.message,
        recipients: broadcastData.sendToAllUsers
          ? []
          : broadcastData.recipients,
        userIds: broadcastData.sendToAllUsers ? undefined : undefined,
      });

      setSendStatus("Broadcast sent successfully!");

      // Reset form
      setBroadcastData({
        subject: "",
        message: "",
        recipients: [],
        sendToAllUsers: false,
      });
    } catch (error: any) {
      setError(error.message || "Failed to send broadcast");
      setSendStatus("");
    } finally {
      setIsSending(false);
    }
  };

  const addRecipient = () => {
    const email = prompt("Enter email address:");
    if (email && !broadcastData.recipients.includes(email)) {
      setBroadcastData({
        ...broadcastData,
        recipients: [...broadcastData.recipients, email],
      });
    }
  };

  const removeRecipient = (email: string) => {
    setBroadcastData({
      ...broadcastData,
      recipients: broadcastData.recipients.filter((r) => r !== email),
    });
  };

  const recentNotifications = [
    {
      id: 1,
      type: "email",
      title: "System Maintenance Notice",
      message: "Scheduled maintenance on Sunday at 2 AM",
      recipients: 1250,
      sentAt: "2024-01-15T10:30:00Z",
      status: "sent",
    },
    {
      id: 2,
      type: "email",
      title: "New Feature Announcement",
      message: "Introducing advanced AI features",
      recipients: 890,
      sentAt: "2024-01-14T15:45:00Z",
      status: "sent",
    },
    {
      id: 3,
      type: "email",
      title: "Welcome Email",
      message: "Welcome to Maya AI platform",
      recipients: 45,
      sentAt: "2024-01-13T09:15:00Z",
      status: "sent",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Send email broadcasts and manage notifications
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {sendStatus && !error && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{sendStatus}</AlertDescription>
        </Alert>
      )}

      {/* Email Broadcast Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Send Email Broadcast</span>
          </CardTitle>
          <CardDescription>
            Send notifications to users via email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter email subject"
              value={broadcastData.subject}
              onChange={(e) =>
                setBroadcastData({ ...broadcastData, subject: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message..."
              rows={6}
              value={broadcastData.message}
              onChange={(e) =>
                setBroadcastData({ ...broadcastData, message: e.target.value })
              }
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendToAll"
                checked={broadcastData.sendToAllUsers}
                onCheckedChange={(checked) =>
                  setBroadcastData({
                    ...broadcastData,
                    sendToAllUsers: checked as boolean,
                  })
                }
              />
              <Label htmlFor="sendToAll">Send to all users</Label>
            </div>

            {!broadcastData.sendToAllUsers && (
              <div className="space-y-2">
                <Label>Recipients</Label>
                <div className="space-y-2">
                  {broadcastData.recipients.map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span className="text-sm">{email}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRecipient(email)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRecipient}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Add Recipient
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setBroadcastData({
                  subject: "",
                  message: "",
                  recipients: [],
                  sendToAllUsers: false,
                });
                setError("");
                setSendStatus("");
              }}
            >
              Reset
            </Button>
            <Button
              onClick={handleSendBroadcast}
              disabled={
                isSending || !broadcastData.subject || !broadcastData.message
              }
              className="min-w-[120px]"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Broadcast
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Recent Notifications</span>
          </CardTitle>
          <CardDescription>History of sent notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {notification.recipients} recipients
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.sentAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {notification.status}
                  </span>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Templates</CardTitle>
          <CardDescription>Pre-written notification templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <h4 className="font-medium mb-2">System Maintenance</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Notify users about scheduled maintenance
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setBroadcastData({
                    ...broadcastData,
                    subject: "System Maintenance Notice",
                    message:
                      "Dear users,\n\nWe will be performing scheduled maintenance on [DATE] at [TIME]. The system will be temporarily unavailable during this period.\n\nWe apologize for any inconvenience.\n\nBest regards,\nMaya AI Team",
                  })
                }
              >
                Use Template
              </Button>
            </div>

            <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <h4 className="font-medium mb-2">New Feature Announcement</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Announce new features and updates
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setBroadcastData({
                    ...broadcastData,
                    subject: "New Features Available!",
                    message:
                      "Dear users,\n\nWe're excited to announce new features that will enhance your experience:\n\n• [Feature 1]\n• [Feature 2]\n• [Feature 3]\n\nTry them out and let us know what you think!\n\nBest regards,\nMaya AI Team",
                  })
                }
              >
                Use Template
              </Button>
            </div>

            <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <h4 className="font-medium mb-2">Welcome Message</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Welcome new users to the platform
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setBroadcastData({
                    ...broadcastData,
                    subject: "Welcome to Maya AI!",
                    message:
                      "Dear [User Name],\n\nWelcome to Maya AI! We're thrilled to have you on board.\n\nHere are some quick tips to get started:\n• Explore our features\n• Check out the tutorials\n• Contact support if you need help\n\nBest regards,\nMaya AI Team",
                  })
                }
              >
                Use Template
              </Button>
            </div>

            <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <h4 className="font-medium mb-2">Security Alert</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Important security notifications
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setBroadcastData({
                    ...broadcastData,
                    subject: "Security Update Required",
                    message:
                      "Dear users,\n\nWe've detected a security issue that requires immediate attention. Please update your password and enable two-factor authentication if you haven't already.\n\nThis is a critical security measure.\n\nBest regards,\nMaya AI Security Team",
                  })
                }
              >
                Use Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



