// Enhanced Admin API service with proper error handling and data transformation
import { BACKEND_CONFIG, ADMIN_CONFIG } from "./config";
import {
  transformUser,
  transformProject,
  transformChat,
  TransformedUser,
  TransformedProject,
  TransformedChat,
} from "./data-transformers";

export interface AdminApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface AdminPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error: string | null;
  loading: boolean;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalProjects: number;
  totalChats: number;
  activeUsers: number;
  newUsersThisWeek: number;
  newProjectsThisWeek: number;
  systemHealth: {
    uptime: string;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
  };
}

export interface AdminUserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisWeek: number;
  adminUsers: number;
  userGrowth: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
}

export interface AdminProjectStats {
  totalProjects: number;
  activeProjects: number;
  newProjectsThisWeek: number;
  projectGrowth: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
}

export interface AdminSecurityStats {
  failedLogins: number;
  suspiciousIPs: string[];
  lastSecurityAlert: string;
  blockedUsers: number;
  recentLoginAttempts: Array<{
    userId: string;
    ip: string;
    timestamp: string;
    success: boolean;
  }>;
  securityAlerts: Array<{
    type: string;
    message: string;
    timestamp: string;
    severity: string;
  }>;
}

export interface AdminStorageStats {
  totalStorage: string;
  usedStorage: string;
  availableStorage: string;
  usagePercentage: number;
  storageByType: {
    images: string;
    projects: string;
    exports: string;
  };
}

export interface AdminSystemSettings {
  allowUserRegistration: boolean;
  allowOAuthLogin: boolean;
  allowEmailLogin: boolean;
  allowProjectCreation: boolean;
  allowChatFeatures: boolean;
  maxProjectsPerUser: number;
  maxFileUploadSize: number;
  apiRateLimit: number;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  showAnnouncement: boolean;
  systemAnnouncement: string;
}

// Enhanced Admin API class with proper error handling
export class EnhancedAdminAPI {
  private static getAuthHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // Dashboard API
  static async getDashboardStats(token: string): Promise<AdminApiResponse<AdminDashboardStats>> {
    try {
      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}${ADMIN_CONFIG.DASHBOARD.STATS}`, {
        headers: this.getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      
      // Transform the raw data to our expected format
      const stats: AdminDashboardStats = {
        totalUsers: rawData.totalUsers || 0,
        totalProjects: rawData.totalProjects || 0,
        totalChats: rawData.totalChats || 0,
        activeUsers: rawData.activeUsers || 0,
        newUsersThisWeek: rawData.newUsersThisWeek || 0,
        newProjectsThisWeek: rawData.newProjectsThisWeek || 0,
        systemHealth: rawData.systemHealth || {
          uptime: "99.9%",
          cpuUsage: 45,
          memoryUsage: 65,
          diskUsage: 25,
        },
      };

      return {
        data: stats,
        error: null,
        loading: false,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats',
        loading: false,
      };
    }
  }

  // User Statistics API
  static async getUserStatistics(token: string): Promise<AdminApiResponse<AdminUserStats>> {
    try {
      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}${ADMIN_CONFIG.USERS.STATS}`, {
        headers: this.getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      
      const stats: AdminUserStats = {
        totalUsers: rawData.totalUsers || 0,
        activeUsers: rawData.activeUsers || 0,
        newUsersThisWeek: rawData.newUsersThisWeek || 0,
        adminUsers: rawData.adminUsers || 0,
        userGrowth: rawData.userGrowth || {
          daily: [],
          weekly: [],
          monthly: [],
        },
      };

      return {
        data: stats,
        error: null,
        loading: false,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch user statistics',
        loading: false,
      };
    }
  }

  // Project Statistics API
  static async getProjectStatistics(token: string): Promise<AdminApiResponse<AdminProjectStats>> {
    try {
      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}${ADMIN_CONFIG.PROJECTS.METRICS}`, {
        headers: this.getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      
      const stats: AdminProjectStats = {
        totalProjects: rawData.totalProjects || 0,
        activeProjects: rawData.activeProjects || 0,
        newProjectsThisWeek: rawData.newProjectsThisWeek || 0,
        projectGrowth: rawData.projectGrowth || {
          daily: [],
          weekly: [],
          monthly: [],
        },
      };

      return {
        data: stats,
        error: null,
        loading: false,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch project statistics',
        loading: false,
      };
    }
  }

  // Security Statistics API
  static async getSecurityStatistics(token: string): Promise<AdminApiResponse<AdminSecurityStats>> {
    try {
      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}${ADMIN_CONFIG.ANALYTICS.SECURITY}`, {
        headers: this.getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      
      const stats: AdminSecurityStats = {
        failedLogins: rawData.failedLogins || 0,
        suspiciousIPs: rawData.suspiciousIPs || [],
        lastSecurityAlert: rawData.lastSecurityAlert || new Date().toISOString(),
        blockedUsers: rawData.blockedUsers || 0,
        recentLoginAttempts: rawData.recentLoginAttempts || [],
        securityAlerts: rawData.securityAlerts || [],
      };

      return {
        data: stats,
        error: null,
        loading: false,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch security statistics',
        loading: false,
      };
    }
  }

  // Storage Statistics API
  static async getStorageStatistics(token: string): Promise<AdminApiResponse<AdminStorageStats>> {
    try {
      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}${ADMIN_CONFIG.STORAGE.USAGE}`, {
        headers: this.getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      
      const stats: AdminStorageStats = {
        totalStorage: rawData.totalStorage || "0 GB",
        usedStorage: rawData.usedStorage || "0 GB",
        availableStorage: rawData.availableStorage || "0 GB",
        usagePercentage: rawData.usagePercentage || 0,
        storageByType: rawData.storageByType || {
          images: "0 GB",
          projects: "0 GB",
          exports: "0 GB",
        },
      };

      return {
        data: stats,
        error: null,
        loading: false,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch storage statistics',
        loading: false,
      };
    }
  }

  // System Settings API
  static async getSystemSettings(token: string): Promise<AdminApiResponse<AdminSystemSettings>> {
    try {
      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}${ADMIN_CONFIG.SYSTEM.SETTINGS}`, {
        headers: this.getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      
      const settings: AdminSystemSettings = {
        allowUserRegistration: rawData.allowUserRegistration ?? true,
        allowOAuthLogin: rawData.allowOAuthLogin ?? true,
        allowEmailLogin: rawData.allowEmailLogin ?? true,
        allowProjectCreation: rawData.allowProjectCreation ?? true,
        allowChatFeatures: rawData.allowChatFeatures ?? true,
        maxProjectsPerUser: rawData.maxProjectsPerUser || 50,
        maxFileUploadSize: rawData.maxFileUploadSize || 10,
        apiRateLimit: rawData.apiRateLimit || 100,
        maintenanceMode: rawData.maintenanceMode ?? false,
        maintenanceMessage: rawData.maintenanceMessage || "System is under maintenance. Please try again later.",
        showAnnouncement: rawData.showAnnouncement ?? false,
        systemAnnouncement: rawData.systemAnnouncement || "Welcome to Maya AI! New features coming soon.",
      };

      return {
        data: settings,
        error: null,
        loading: false,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch system settings',
        loading: false,
      };
    }
  }

  // Users List API
  static async getUsers(token: string, params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    role?: string;
  } = {}): Promise<AdminPaginatedResponse<TransformedUser>> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const response = await fetch(
        `${BACKEND_CONFIG.BASE_URL}${ADMIN_CONFIG.USERS.LIST}?${queryParams}`,
        {
          headers: this.getAuthHeaders(token),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      
      const transformedUsers = Array.isArray(rawData.users) 
        ? rawData.users.map(transformUser)
        : [];

      return {
        data: transformedUsers,
        pagination: {
          page: rawData.page || 1,
          limit: rawData.limit || 10,
          total: rawData.total || 0,
          totalPages: rawData.totalPages || 1,
        },
        error: null,
        loading: false,
      };
    } catch (error) {
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        },
        error: error instanceof Error ? error.message : 'Failed to fetch users',
        loading: false,
      };
    }
  }

  // Projects List API
  static async getProjects(token: string, params: {
    page?: number;
    limit?: number;
    search?: string;
    userId?: string;
  } = {}): Promise<AdminPaginatedResponse<TransformedProject>> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const response = await fetch(
        `${BACKEND_CONFIG.BASE_URL}${ADMIN_CONFIG.PROJECTS.LIST}?${queryParams}`,
        {
          headers: this.getAuthHeaders(token),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      
      const transformedProjects = Array.isArray(rawData.projects) 
        ? rawData.projects.map(transformProject)
        : [];

      return {
        data: transformedProjects,
        pagination: {
          page: rawData.page || 1,
          limit: rawData.limit || 10,
          total: rawData.total || 0,
          totalPages: rawData.totalPages || 1,
        },
        error: null,
        loading: false,
      };
    } catch (error) {
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        },
        error: error instanceof Error ? error.message : 'Failed to fetch projects',
        loading: false,
      };
    }
  }

  // Utility function to handle API errors consistently
  static handleApiError(error: any): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    if (error?.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }

  // Utility function to create loading state
  static createLoadingState<T>(): AdminApiResponse<T> {
    return {
      data: null,
      error: null,
      loading: true,
    };
  }
} 