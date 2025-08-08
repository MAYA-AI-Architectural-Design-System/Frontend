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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  AlertTriangle,
  Eye,
  Lock,
  Activity,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import AdminAPI, { SecurityMetrics } from "@/lib/admin-api";

export default function AdminSecurityPage() {
  const [securityMetrics, setSecurityMetrics] =
    useState<SecurityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSecurityMetrics = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await AdminAPI.getSecurityMetrics();
      setSecurityMetrics(data);
    } catch (error: any) {
      setError(error.message || "Failed to load security metrics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading security metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Security Monitoring
          </h1>
          <p className="text-muted-foreground">
            Monitor system security and detect threats
          </p>
        </div>
        <Button onClick={fetchSecurityMetrics} disabled={isLoading}>
          <RefreshCw className="mr-2 h-4 w-4" />
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

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {securityMetrics?.failedLogins || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Recent failed attempts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Security Score
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {securityMetrics?.securityScore || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall security rating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {securityMetrics?.totalAlerts || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Security incidents detected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threat Level</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {securityMetrics?.threatLevel || "Unknown"}
            </div>
            <p className="text-xs text-muted-foreground">
              Current threat assessment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Incidents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Recent Security Incidents</span>
          </CardTitle>
          <CardDescription>
            Monitor recent security incidents and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {securityMetrics?.recentIncidents &&
          securityMetrics.recentIncidents.length > 0 ? (
            <div className="space-y-3">
              {securityMetrics.recentIncidents
                .slice(0, 5)
                .map((incident: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="font-medium text-sm">{incident.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {incident.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(incident.timestamp).toLocaleString()}
                      </p>
                      <Badge
                        variant={
                          incident.severity === "high"
                            ? "destructive"
                            : incident.severity === "medium"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {incident.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No recent security incidents
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Status</span>
          </CardTitle>
          <CardDescription>
            Current security status and last scan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Last Security Scan</h4>
                <p className="text-sm text-muted-foreground">
                  {securityMetrics?.lastSecurityScan
                    ? new Date(
                        securityMetrics.lastSecurityScan
                      ).toLocaleString()
                    : "Never"}
                </p>
              </div>
              <Badge variant="outline">
                {securityMetrics?.threatLevel || "Unknown"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {securityMetrics?.successfulLogins || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Successful Logins
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {securityMetrics?.failedLogins || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Failed Logins
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
          <CardDescription>
            Best practices for maintaining system security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">
                  Enable Two-Factor Authentication
                </h4>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for all admin accounts
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Regular Security Audits</h4>
                <p className="text-sm text-muted-foreground">
                  Conduct monthly security reviews
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Monitor Login Attempts</h4>
                <p className="text-sm text-muted-foreground">
                  Track and analyze failed login patterns
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
