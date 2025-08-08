"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings,
  Save,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Shield,
  Users,
  Database,
  Bell,
  Globe,
  Lock,
} from "lucide-react";
import AdminAPI, { SystemSettings } from "@/lib/admin-api";

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [settings, setSettings] = useState<SystemSettings>({
    allowUserRegistration: true,
    allowOAuthLogin: true,
    allowEmailLogin: true,
    allowProjectCreation: true,
    allowChatFeatures: true,
    maxProjectsPerUser: 50,
    maxFileUploadSize: 10,
    apiRateLimit: 100,
    maintenanceMode: false,
    maintenanceMessage: "System is under maintenance. Please try again later.",
    showAnnouncement: false,
    systemAnnouncement: "Welcome to Maya AI! New features coming soon.",
  });

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError("");
      const result = await AdminAPI.getSystemSettings();

      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setSettings(result.data);
      } else {
        setError("No settings data received");
      }
    } catch (error: any) {
      setError(error.message || "Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      // Filter out metadata properties that shouldn't be sent to the API
      const { id, createdAt, updatedAt, ...settingsToUpdate } = settings;

      const response = await AdminAPI.updateSystemSettings(settingsToUpdate);
      if (response.success) {
        setSettings(response.settings);
        setSuccess(response.message || "Settings saved successfully!");
      } else {
        setError(response.message || "Failed to save settings");
      }

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error: any) {
      setError(error.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Configure system-wide settings and preferences
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={fetchSettings}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={saveSettings} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
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
      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* User Management Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>User Management</span>
          </CardTitle>
          <CardDescription>
            Configure user registration and authentication settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable new user registration
                  </p>
                </div>
                <Switch
                  checked={settings.allowUserRegistration ?? true}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, allowUserRegistration: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>OAuth Login</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable Google/GitHub login
                  </p>
                </div>
                <Switch
                  checked={settings.allowOAuthLogin ?? true}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, allowOAuthLogin: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Login</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable email/password login
                  </p>
                </div>
                <Switch
                  checked={settings.allowEmailLogin ?? true}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, allowEmailLogin: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable access for maintenance
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode ?? false}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, maintenanceMode: checked })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxProjects">Max Projects Per User</Label>
                <Input
                  id="maxProjects"
                  type="number"
                  value={settings.maxProjectsPerUser ?? 50}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxProjectsPerUser: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxFileUploadSize">
                  Max File Upload Size (MB)
                </Label>
                <Input
                  id="maxFileUploadSize"
                  type="number"
                  value={settings.maxFileUploadSize ?? 10}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxFileUploadSize: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiRateLimit">
                  API Rate Limit (requests/min)
                </Label>
                <Input
                  id="apiRateLimit"
                  type="number"
                  value={settings.apiRateLimit ?? 100}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      apiRateLimit: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Feature Settings</span>
          </CardTitle>
          <CardDescription>Enable or disable platform features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Project Creation</Label>
              <p className="text-sm text-muted-foreground">
                Enable users to create new projects
              </p>
            </div>
            <Switch
              checked={settings.allowProjectCreation ?? true}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, allowProjectCreation: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Chat Features</Label>
              <p className="text-sm text-muted-foreground">
                Enable AI chat functionality
              </p>
            </div>
            <Switch
              checked={settings.allowChatFeatures ?? true}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, allowChatFeatures: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Maintenance Mode</span>
          </CardTitle>
          <CardDescription>Put the system in maintenance mode</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Temporarily disable access for maintenance
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode ?? false}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, maintenanceMode: checked })
              }
            />
          </div>

          {settings.maintenanceMode && (
            <div className="space-y-2">
              <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
              <Textarea
                id="maintenanceMessage"
                placeholder="Enter maintenance message to display to users..."
                value={settings.maintenanceMessage ?? ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maintenanceMessage: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>System Announcements</span>
          </CardTitle>
          <CardDescription>Display announcements to all users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show System Announcement</Label>
              <p className="text-sm text-muted-foreground">
                Display announcement banner to users
              </p>
            </div>
            <Switch
              checked={settings.showAnnouncement ?? false}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, showAnnouncement: checked })
              }
            />
          </div>

          {settings.showAnnouncement && (
            <div className="space-y-2">
              <Label htmlFor="announcement">Announcement Message</Label>
              <Textarea
                id="announcement"
                placeholder="Enter announcement message..."
                value={settings.systemAnnouncement ?? ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    systemAnnouncement: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
