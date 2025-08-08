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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Download,
  Calendar,
  Users,
  FolderOpen,
  MessageSquare,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import AdminAPI from "@/lib/admin-api";

export default function AdminReportsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState("");
  const [error, setError] = useState("");
  const [exportConfig, setExportConfig] = useState({
    dataType: "users",
    format: "json",
    dateRange: "all",
  });

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setError("");
      setExportStatus("Preparing export...");

      const data = await AdminAPI.exportData({
        dataType: exportConfig.dataType,
        format: exportConfig.format,
        filters: {
          dateRange: exportConfig.dateRange,
        },
      });

      setExportStatus("Export completed successfully!");

      // In a real implementation, you would trigger a download here
      console.log("Export data:", data);
    } catch (error: any) {
      setError(error.message || "Failed to export data");
      setExportStatus("");
    } finally {
      setIsExporting(false);
    }
  };

  const reportTypes = [
    {
      id: "users",
      name: "User Report",
      description: "Export user data and statistics",
      icon: Users,
    },
    {
      id: "projects",
      name: "Project Report",
      description: "Export project data and metrics",
      icon: FolderOpen,
    },
    {
      id: "chats",
      name: "Chat Report",
      description: "Export chat conversations and analytics",
      icon: MessageSquare,
    },
    {
      id: "analytics",
      name: "Analytics Report",
      description: "Export comprehensive analytics data",
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reports & Exports
          </h1>
          <p className="text-muted-foreground">
            Generate and export system reports
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
      {exportStatus && !error && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{exportStatus}</AlertDescription>
        </Alert>
      )}

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card
              key={report.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{report.name}</CardTitle>
                </div>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    setExportConfig({ ...exportConfig, dataType: report.id })
                  }
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Select Report
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Export Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Export Configuration</CardTitle>
          <CardDescription>Configure your data export settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataType">Data Type</Label>
              <Select
                value={exportConfig.dataType}
                onValueChange={(value) =>
                  setExportConfig({ ...exportConfig, dataType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="projects">Projects</SelectItem>
                  <SelectItem value="chats">Chats</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select
                value={exportConfig.format}
                onValueChange={(value) =>
                  setExportConfig({ ...exportConfig, format: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Select
                value={exportConfig.dateRange}
                onValueChange={(value) =>
                  setExportConfig({ ...exportConfig, dateRange: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setExportConfig({
                  dataType: "users",
                  format: "json",
                  dateRange: "all",
                });
                setError("");
                setExportStatus("");
              }}
            >
              Reset
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="min-w-[120px]"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Exports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
          <CardDescription>Your recently generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <h4 className="font-medium">User Report</h4>
                  <p className="text-sm text-muted-foreground">
                    JSON format • All time
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Generated 2 hours ago
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-green-500" />
                <div>
                  <h4 className="font-medium">Project Analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    Excel format • This month
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Generated 1 day ago
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Export Tips</CardTitle>
          <CardDescription>Best practices for data exports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Choose the Right Format</h4>
                <p className="text-sm text-muted-foreground">
                  Use JSON for API integration, CSV for spreadsheet analysis,
                  Excel for presentations
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Select Appropriate Date Range</h4>
                <p className="text-sm text-muted-foreground">
                  Limit date ranges for large datasets to improve performance
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium">Regular Exports</h4>
                <p className="text-sm text-muted-foreground">
                  Schedule regular exports for backup and analysis purposes
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



