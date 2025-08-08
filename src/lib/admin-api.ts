import { BACKEND_CONFIG, ADMIN_CONFIG } from "./config";
import AdminAuthService from "./admin-auth";

// Types for admin API responses
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  emailVerified: boolean;
  googleId?: string;
  githubId?: string;
  createdAt: string;
  lastLogin?: string;
  updatedAt: string;
}

export interface AdminProject {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface UsersResponse {
  users: AdminUser[];
  pagination: PaginationResponse;
}

export interface ProjectsResponse {
  projects: AdminProject[];
  pagination: PaginationResponse;
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  adminUsers: number;
  newUsersThisMonth: number;
  usersByMonth: Array<{
    month: string;
    count: number;
    active: number;
    blocked: number;
  }>;
  topUsers: Array<{
    id: string;
    name: string;
    projectCount: number;
    lastLogin: string;
  }>;
  oauthStats: {
    google: number;
    github: number;
    email: number;
  };
}

export interface ProjectStatistics {
  totalProjects: number;
  projectsCreatedToday: number;
  projectsCreatedThisWeek: number;
  projectsCreatedThisMonth: number;
  activeProjects: number;
  completedProjects: number;
  projectsByUser: Array<{
    userId: string;
    userName: string;
    count: number;
    lastProject: string;
  }>;
  projectsByType: {
    interior: number;
    exterior: number;
    both: number;
  };
  recentProjects: Array<{
    id: string;
    name: string;
    userId: string;
    userName: string;
    type: string;
    createdAt: string;
    status: string;
  }>;
  projectGrowth: {
    daily: number[];
  };
  averageCompletionRate: number;
}

// Advanced Analytics Interfaces
export interface AdvancedAnalytics {
  userStats: {
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
    adminUsers: number;
    oauthUsers: number;
    emailUsers: number;
    recentRegistrations: number;
  };
  projectStats: {
    totalProjects: number;
    projectsCreatedToday: number;
    projectsCreatedThisWeek: number;
    projectsCreatedThisMonth: number;
    activeProjects: number;
    completedProjects: number;
    projectsByUser: Array<{
      count: number;
    }>;
  };
}

// System Settings Interfaces
export interface SystemSettings {
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  maxProjectsPerUser: number;
  maxChatsPerUser: number;
  fileUploadLimit: string;
  sessionTimeout: number;
  emailNotifications: {
    welcome: boolean;
    projectUpdates: boolean;
    securityAlerts: boolean;
  };
  security: {
    passwordMinLength: number;
    requireTwoFactor: boolean;
    maxLoginAttempts: number;
    lockoutDuration: number;
  };
}

// Security Metrics Interfaces
export interface SecurityMetrics {
  failedLogins: number;
  successfulLogins: number;
  blockedUsers: number;
  totalAlerts: number;
  securityScore: number;
  recentIncidents: Array<{
    id: string;
    type: string;
    severity: string;
    description: string;
    timestamp: string;
    resolved: boolean;
  }>;
  threatLevel: string;
  lastSecurityScan: string;
}

// Chat Management Interfaces
export interface AdminChat {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  title: string;
  messageCount: number;
  lastMessageAt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatDetail extends AdminChat {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  totalMessages: number;
  messages: Array<{
    id: string;
    content: string;
    role: string;
    timestamp: string;
  }>;
}

export interface ChatMetrics {
  totalChats: number;
  activeChats: number;
  completedChats: number;
  totalMessages: number;
  averageMessagesPerChat: number;
  topUsers: Array<{
    userId: string;
    name: string;
    email: string;
    chatCount: number;
    messageCount: number;
  }>;
  chatGrowth: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
}

export interface ChatsResponse {
  chats: AdminChat[];
  total: number;
  active: number;
  completed: number;
}

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  return AdminAuthService.getAuthHeaders();
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  // Check if response is ok first
  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        // Clear any stored auth data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
      }
      throw new Error('Unauthorized - Please log in again');
    }
    
    // For other errors, try to get error message
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const text = await response.text();
      if (text && text.trim()) {
        const errorData = JSON.parse(text);
        errorMessage = errorData?.message || errorMessage;
      }
    } catch (parseError) {
      // If we can't parse the error response, use the default message
      console.error('Error parsing error response:', parseError);
    }
    
    throw new Error(errorMessage);
  }
  
  // For successful responses, try to parse JSON
  try {
    const text = await response.text();
    if (!text || !text.trim()) {
      return {};
    }
    
    return JSON.parse(text);
  } catch (parseError) {
    console.error('Error parsing response:', parseError);
    return {};
  }
};

// Helper function to wrap API calls with error handling
const safeApiCall = async <T>(apiCall: () => Promise<T>): Promise<{ error: string | null; data: T | null }> => {
  try {
    const result = await apiCall();
    return { error: null, data: result };
  } catch (error: any) {
    return { error: error.message || 'An error occurred', data: null };
  }
};

// User Management API
export const AdminAPI = {
  // Get all users
  getUsers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    role?: string;
  } = {}): Promise<UsersResponse> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/users?${searchParams}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Get single user
  getUser: async (userId: string) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/users/${userId}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Update user
  updateUser: async (userId: string, updates: {
    name?: string;
    email?: string;
    isAdmin?: boolean;
    isActive?: boolean;
  }) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/users/${userId}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      }
    );

    return handleResponse(response);
  },

  // Delete user
  deleteUser: async (userId: string) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/users/${userId}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Block user
  blockUser: async (userId: string) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/users/${userId}/block`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Unblock user
  unblockUser: async (userId: string) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/users/${userId}/unblock`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Promote user to admin
  promoteUser: async (userId: string) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/users/${userId}/promote`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Demote admin to user
  demoteUser: async (userId: string) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/users/${userId}/demote`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Get user statistics
  getUserStatistics: async (params: {
    period?: string;
    userId?: string;
  } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/users/statistics?${searchParams}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Bulk operations for users
  bulkUpdateUsers: async (userIds: string[], updates: any) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/users/bulk-update`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userIds, updates }),
      }
    );

    return handleResponse(response);
  },

  bulkDeleteUsers: async (userIds: string[]) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/users/bulk-delete`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userIds }),
      }
    );

    return handleResponse(response);
  },

  bulkBlockUsers: async (userIds: string[]) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/users/bulk-block`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userIds }),
      }
    );

    return handleResponse(response);
  },

  bulkUnblockUsers: async (userIds: string[]) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/users/bulk-unblock`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userIds }),
      }
    );

    return handleResponse(response);
  },

  // Project Management API
  getProjects: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    userId?: string;
  } = {}): Promise<AdminProject[]> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/projects?${searchParams}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Get single project
  getProject: async (projectId: string) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/projects/${projectId}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Update project
  updateProject: async (projectId: string, updates: {
    name?: string;
    description?: string;
    status?: string;
    type?: string;
  }) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/projects/${projectId}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      }
    );

    return handleResponse(response);
  },

  // Delete project
  deleteProject: async (projectId: string) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/projects/${projectId}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Archive project
  archiveProject: async (projectId: string) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/projects/${projectId}/archive`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Restore project
  restoreProject: async (projectId: string) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/projects/${projectId}/restore`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Get project statistics
  getProjectStatistics: async (params: {
    period?: string;
    userId?: string;
  } = {}): Promise<ProjectStatistics> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/metrics/projects?${searchParams}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Block project
  blockProject: async (projectId: string) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/projects/${projectId}/block`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Unblock project
  unblockProject: async (projectId: string) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/projects/${projectId}/unblock`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Bulk operations for projects
  bulkUpdateProjects: async (projectIds: string[], updates: any) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/projects/bulk-update`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ projectIds, updates }),
      }
    );

    return handleResponse(response);
  },

  bulkDeleteProjects: async (projectIds: string[]) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/projects/bulk-delete`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ projectIds }),
      }
    );

    return handleResponse(response);
  },

  bulkArchiveProjects: async (projectIds: string[]) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/projects/bulk-archive`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ projectIds }),
      }
    );

    return handleResponse(response);
  },

  bulkRestoreProjects: async (projectIds: string[]) => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/projects/bulk-restore`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ projectIds }),
      }
    );

    return handleResponse(response);
  },

  // Dashboard API
  getDashboardStats: async () => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/dashboard`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Analytics API
  getAnalytics: async (params: {
    period?: string;
    type?: string;
  } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/analytics/advanced?${searchParams}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Security metrics
  getSecurityMetrics: async () => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/metrics/security`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Chat management
  getChats: async (params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<{ error: string | null; data: ChatsResponse | null }> => {
    return safeApiCall(async () => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(
        `${BACKEND_CONFIG.BASE_URL}/admin/chats?${searchParams}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      return handleResponse(response);
    });
  },

  getChat: async (chatId: string): Promise<{ error: string | null; data: ChatDetail | null }> => {
    return safeApiCall(async () => {
      const response = await fetch(
        `${BACKEND_CONFIG.BASE_URL}/admin/chats/${chatId}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      return handleResponse(response);
    });
  },

  deleteChat: async (chatId: string): Promise<{ error: string | null; data: any | null }> => {
    return safeApiCall(async () => {
      const response = await fetch(
        `${BACKEND_CONFIG.BASE_URL}/admin/chats/${chatId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        }
      );

      return handleResponse(response);
    });
  },

  getChatMetrics: async (): Promise<{ error: string | null; data: ChatMetrics | null }> => {
    return safeApiCall(async () => {
      const response = await fetch(
        `${BACKEND_CONFIG.BASE_URL}/admin/metrics/chats`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      return handleResponse(response);
    });
  },

  // System Settings API
  getSystemSettings: async (): Promise<{ error: string | null; data: SystemSettings | null }> => {
    return safeApiCall(async () => {
      const response = await fetch(
        `${BACKEND_CONFIG.BASE_URL}/admin/settings`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      return handleResponse(response);
    });
  },

  updateSystemSettings: async (settings: Partial<SystemSettings>): Promise<{ success: boolean; message: string; settings: SystemSettings }> => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/settings`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settings),
      }
    );

    return handleResponse(response);
  },

  // Additional Settings Endpoints
  getMaintenanceStatus: async (): Promise<{ maintenanceMode: boolean; maintenanceMessage: string }> => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/settings/maintenance`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  getAnnouncementStatus: async (): Promise<{ show: boolean; message: string }> => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/settings/announcement`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  getFeatureFlags: async (): Promise<{
    allowUserRegistration: boolean;
    allowOAuthLogin: boolean;
    allowEmailLogin: boolean;
    allowProjectCreation: boolean;
    allowChatFeatures: boolean;
  }> => {
    const response = await fetch(
      `${BACKEND_CONFIG.BASE_URL}/admin/settings/features`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },

  // Advanced Analytics API
  getAdvancedAnalytics: async (params: {
    period?: string;
    type?: string;
  } = {}): Promise<{ error: string | null; data: AdvancedAnalytics | null }> => {
    return safeApiCall(async () => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(
        `${BACKEND_CONFIG.BASE_URL}/admin/analytics/advanced?${searchParams}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      return handleResponse(response);
    });
  },
};

export default AdminAPI; 