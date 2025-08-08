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
  Users,
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  UserMinus,
  Shield,
  ShieldOff,
  Crown,
  Trash2,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Ban,
  Unlock,
  UserCheck,
  UserX,
  Download,
  Upload,
} from "lucide-react";
import AdminAPI, { AdminUser } from "@/lib/admin-api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  const fetchUsers = async (
    page = 1,
    search = "",
    status = "all",
    role = "all"
  ) => {
    try {
      setIsLoading(true);
      setError("");

      const params: any = {
        page,
        limit: 20,
      };

      if (search) params.search = search;
      if (status !== "all") params.isActive = status === "active";
      if (role !== "all") params.isAdmin = role === "admin";

      const data = await AdminAPI.getUsers(params);
      console.log("Users data:", data);

      // Set users data with fallback
      if (data && data.users) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }

      // Set pagination with fallback
      if (data && data.pagination && data.pagination.pages) {
        setTotalPages(data.pagination.pages);
      } else {
        setTotalPages(1);
      }

      setCurrentPage(page);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setError(error.message || "Failed to fetch users");
      setUsers([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = () => {
    fetchUsers(1, searchTerm, statusFilter, roleFilter);
  };

  const handlePageChange = (page: number) => {
    fetchUsers(page, searchTerm, statusFilter, roleFilter);
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      setIsActionLoading(userId);
      switch (action) {
        case "block":
          await AdminAPI.blockUser(userId);
          break;
        case "unblock":
          await AdminAPI.unblockUser(userId);
          break;
        case "promote":
          await AdminAPI.promoteUser(userId);
          break;
        case "demote":
          await AdminAPI.demoteUser(userId);
          break;
        case "delete":
          await AdminAPI.deleteUser(userId);
          break;
      }

      // Refresh users list
      fetchUsers(currentPage, searchTerm, statusFilter, roleFilter);
    } catch (error: any) {
      setError(error.message || `Failed to ${action} user`);
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      setError("Please select users first");
      return;
    }

    try {
      setIsBulkActionLoading(true);
      switch (action) {
        case "block":
          await AdminAPI.bulkBlockUsers(selectedUsers);
          break;
        case "unblock":
          await AdminAPI.bulkUnblockUsers(selectedUsers);
          break;
        case "delete":
          await AdminAPI.bulkDeleteUsers(selectedUsers);
          break;
      }

      setSelectedUsers([]);
      fetchUsers(currentPage, searchTerm, statusFilter, roleFilter);
    } catch (error: any) {
      setError(error.message || `Failed to ${action} users`);
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(users.map((user) => user.id));
  };

  const deselectAllUsers = () => {
    setSelectedUsers([]);
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    }
    return (
      <Badge variant="destructive">
        <Ban className="w-3 h-3 mr-1" />
        Blocked
      </Badge>
    );
  };

  const getRoleBadge = (isAdmin: boolean) => {
    if (isAdmin) {
      return (
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          <Crown className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      );
    }
    return (
      <Badge variant="outline">
        <UserCheck className="w-3 h-3 mr-1" />
        User
      </Badge>
    );
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage system users and permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("Current users:", users);
              console.log("Current page:", currentPage);
              console.log("Total pages:", totalPages);
            }}
          >
            Debug Data
          </Button>
          <Button
            onClick={() =>
              fetchUsers(currentPage, searchTerm, statusFilter, roleFilter)
            }
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

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>Filter and search users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
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
                <SelectItem value="inactive">Blocked</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
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
      {selectedUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Bulk Actions ({selectedUsers.length} selected)
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
                <Ban className="w-4 h-4 mr-2" />
                Block Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("unblock")}
                disabled={isBulkActionLoading}
              >
                <Unlock className="w-4 h-4 mr-2" />
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

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length} total)</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
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
                        selectedUsers.length === users.length &&
                        users.length > 0
                      }
                      onCheckedChange={(checked) =>
                        checked ? selectAllUsers() : deselectAllUsers()
                      }
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) =>
                          checked
                            ? setSelectedUsers((prev) => [...prev, user.id])
                            : setSelectedUsers((prev) =>
                                prev.filter((id) => id !== user.id)
                              )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.isAdmin)}</TableCell>
                    <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-muted-foreground">
                          {new Date(user.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.lastLogin ? (
                        <div className="text-sm">
                          <div>
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </div>
                          <div className="text-muted-foreground">
                            {new Date(user.lastLogin).toLocaleTimeString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Never
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
                            onClick={() => handleUserAction(user.id, "block")}
                            disabled={isActionLoading === user.id}
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Block User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, "unblock")}
                            disabled={isActionLoading === user.id}
                          >
                            <Unlock className="w-4 h-4 mr-2" />
                            Unblock User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, "promote")}
                            disabled={isActionLoading === user.id}
                          >
                            <Crown className="w-4 h-4 mr-2" />
                            Promote to Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, "demote")}
                            disabled={isActionLoading === user.id}
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Demote to User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUserAction(user.id, "delete")}
                            disabled={isActionLoading === user.id}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
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
    </div>
  );
}
