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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FolderOpen,
  Search,
  Filter,
  MoreHorizontal,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Eye,
  Archive,
  Trash2,
  Download,
  Calendar,
  User,
  Clock,
  TrendingUp,
  BarChart3,
  CheckCircle,
} from "lucide-react";
import AdminAPI, { AdminProject, ProjectStatistics } from "@/lib/admin-api";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [metrics, setMetrics] = useState<ProjectStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError("");
      const data = await AdminAPI.getProjects();
      console.log("Projects data:", data);
      // The API now returns an array directly
      setProjects(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Failed to fetch projects:", error);
      setError(error.message || "Failed to fetch projects");
      } finally {
        setIsLoading(false);
      }
  };

  const fetchMetrics = async () => {
    try {
      const data = await AdminAPI.getProjectStatistics();
      console.log("Project statistics:", data);
      setMetrics(data);
    } catch (error: any) {
      console.error("Failed to fetch project statistics:", error);
      // Don't set error state for metrics as it's not critical
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchMetrics();
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSearch = () => {
    // Filter projects based on search term
    const filtered = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProjects(filtered);
  };

  const handleProjectAction = async (projectId: string, action: string) => {
      try {
        setIsActionLoading(projectId);
      setError("");
      setSuccess("");

      let result;
      switch (action) {
        case "view":
          // Navigate to project view
          window.open(`/project/${projectId}`, "_blank");
          break;
        case "block":
          result = await AdminAPI.blockProject(projectId);
          console.log("Block project result:", result);
          setSuccess("Project blocked successfully");
          // Refresh projects list
          await fetchProjects();
          break;
        case "unblock":
          result = await AdminAPI.unblockProject(projectId);
          console.log("Unblock project result:", result);
          setSuccess("Project unblocked successfully");
          // Refresh projects list
          await fetchProjects();
          break;
        case "delete":
          // Show confirmation dialog
          const project = projects.find((p) => p.id === projectId);
          if (project) {
            setDeleteTarget({ id: projectId, name: project.name });
            setShowDeleteConfirm(true);
            return; // Don't proceed with deletion yet
          }
          break;
      }
    } catch (error: any) {
      console.error(`Error in ${action} project:`, error);
      setError(error.message || `Failed to ${action} project`);
      } finally {
        setIsActionLoading(null);
      }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedProjects.length === 0) {
      setError("Please select projects first");
      return;
    }

      try {
        setIsBulkActionLoading(true);
      setError("");
      setSuccess("");

      const results = [];
      switch (action) {
        case "block":
          // Block each project individually
          for (const projectId of selectedProjects) {
            try {
              const result = await AdminAPI.blockProject(projectId);
              results.push({ projectId, success: true, result });
            } catch (error) {
              console.error(`Failed to block project ${projectId}:`, error);
              results.push({ projectId, success: false, error: error.message });
            }
          }
          break;
        case "unblock":
          // Unblock each project individually
          for (const projectId of selectedProjects) {
            try {
              const result = await AdminAPI.unblockProject(projectId);
              results.push({ projectId, success: true, result });
            } catch (error) {
              console.error(`Failed to unblock project ${projectId}:`, error);
              results.push({ projectId, success: false, error: error.message });
            }
          }
          break;
        case "delete":
          // Delete each project individually
          for (const projectId of selectedProjects) {
            try {
              const result = await AdminAPI.deleteProject(projectId);
              results.push({ projectId, success: true, result });
            } catch (error) {
              console.error(`Failed to delete project ${projectId}:`, error);
              results.push({ projectId, success: false, error: error.message });
            }
          }
          break;
      }

      console.log(`Bulk ${action} results:`, results);

      // Check if any operations failed
      const failedOperations = results.filter((r) => !r.success);
      const successfulOperations = results.filter((r) => r.success);

      if (failedOperations.length > 0) {
        console.warn(`Some ${action} operations failed:`, failedOperations);
        setError(
          `${failedOperations.length} out of ${selectedProjects.length} projects failed to ${action}`
        );
      } else if (successfulOperations.length > 0) {
        setSuccess(
          `Successfully ${action}ed ${successfulOperations.length} projects`
        );
      }

      // Refresh projects list
      await fetchProjects();
          setSelectedProjects([]);
    } catch (error: any) {
      console.error(`Error in bulk ${action}:`, error);
      setError(error.message || `Failed to ${action} projects`);
      } finally {
        setIsBulkActionLoading(false);
      }
  };

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const selectAllProjects = () => {
    setSelectedProjects(projects.map((project) => project.id));
  };

  const deselectAllProjects = () => {
    setSelectedProjects([]);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsActionLoading(deleteTarget.id);
      setError("");
      setSuccess("");

      const result = await AdminAPI.deleteProject(deleteTarget.id);
      console.log("Delete project result:", result);
      setSuccess("Project deleted successfully");

      // Refresh projects list
      await fetchProjects();
    } catch (error: any) {
      console.error("Error deleting project:", error);
      setError(error.message || "Failed to delete project");
      } finally {
        setIsActionLoading(null);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  const getProjectStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        );
      case "blocked":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            Blocked
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Completed
          </Badge>
        );
      case "archived":
        return (
          <Badge variant="outline" className="text-gray-600">
            Archived
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading projects...</p>
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
            Project Management
          </h1>
          <p className="text-muted-foreground">
            View and manage all system projects
          </p>
        </div>
        <Button
          onClick={() => {
            fetchProjects();
            fetchMetrics();
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

      {/* Project Metrics */}
      {metrics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Projects
              </CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.totalProjects.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {metrics.projectsCreatedThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Projects
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {metrics.activeProjects.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>


        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No project statistics available
          </p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert variant="default" className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>Filter and search projects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSearch} disabled={isLoading}>
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedProjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Bulk Actions ({selectedProjects.length} selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("block")}
                disabled={isBulkActionLoading}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Block Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("unblock")}
                disabled={isBulkActionLoading}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Unblock Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("delete")}
                disabled={isBulkActionLoading}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Projects ({projects.length} total)</CardTitle>
          <CardDescription>
            Manage and monitor all system projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedProjects.length === projects.length &&
                        projects.length > 0
                      }
                      onCheckedChange={(checked) =>
                        checked ? selectAllProjects() : deselectAllProjects()
                      }
                    />
                  </TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProjects.includes(project.id)}
                        onCheckedChange={(checked) =>
                          checked
                            ? setSelectedProjects((prev) => [
                                ...prev,
                                project.id,
                              ])
                            : setSelectedProjects((prev) =>
                                prev.filter((id) => id !== project.id)
                              )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground">
                          ID: {project.id}
                          </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{project.user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getProjectStatusBadge(project.status || "active")}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-muted-foreground">
                          {new Date(project.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="text-muted-foreground">
                          {new Date(project.updatedAt).toLocaleTimeString()}
                        </div>
                      </div>
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
                            onClick={() =>
                              handleProjectAction(project.id, "view")
                            }
                            disabled={isActionLoading === project.id}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Project
                          </DropdownMenuItem>
                          {project.status === "active" ? (
                            <DropdownMenuItem
                              onClick={() =>
                                handleProjectAction(project.id, "block")
                              }
                              disabled={isActionLoading === project.id}
                            >
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Block Project
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() =>
                                handleProjectAction(project.id, "unblock")
                              }
                              disabled={isActionLoading === project.id}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Unblock Project
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              handleProjectAction(project.id, "delete")
                            }
                            disabled={isActionLoading === project.id}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Top Projects */}
      {metrics?.topProjects && metrics.topProjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Projects</CardTitle>
            <CardDescription>
              Projects with the most images and downloads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.topProjects.slice(0, 10).map((project, index) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground">
                        by {project.user.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{project.imageCount} images</div>
                    <div className="text-sm text-muted-foreground">
                      {project.downloadCount || 0} downloads
                    </div>
                  </div>
              </div>
              ))}
            </div>
        </CardContent>
      </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the project "{deleteTarget?.name}
              "? This action cannot be undone and will permanently remove the
              project and all its data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeleteTarget(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isActionLoading === deleteTarget?.id}
            >
              {isActionLoading === deleteTarget?.id ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Project
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
