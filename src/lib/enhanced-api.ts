// Enhanced API service with proper error handling and data transformation
import { apiRequest } from "./auth";
import { BACKEND_CONFIG } from "./config";
import {
  transformUser,
  transformProject,
  transformChat,
  transformMessage,
  transformDashboardStats,
  transformPaginatedResponse,
  TransformedUser,
  TransformedProject,
  TransformedChat,
  TransformedMessage,
  TransformedDashboardStats,
} from "./data-transformers";

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface PaginatedApiResponse<T> {
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

// Enhanced API class with proper error handling
export class EnhancedAPI {
  // User API
  static async getUserProfile(): Promise<ApiResponse<TransformedUser>> {
    try {
      const response = await apiRequest(BACKEND_CONFIG.USERS.PROFILE);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      const rawData = await response.json();
      return {
        data: transformUser(rawData),
        error: null,
        loading: false,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch user profile',
        loading: false,
      };
    }
  }

  // Projects API
  static async getProjects(): Promise<ApiResponse<TransformedProject[]>> {
    try {
      const response = await apiRequest(BACKEND_CONFIG.PROJECTS.LIST);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      const rawData = await response.json();
      const transformedData = Array.isArray(rawData) 
        ? rawData.map(transformProject)
        : [];
      
      return {
        data: transformedData,
        error: null,
        loading: false,
      };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch projects',
        loading: false,
      };
    }
  }

  static async createProject(name: string): Promise<ApiResponse<TransformedProject>> {
    try {
      const response = await apiRequest(BACKEND_CONFIG.PROJECTS.CREATE, {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      const rawData = await response.json();
      return {
        data: transformProject(rawData),
        error: null,
        loading: false,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to create project',
        loading: false,
      };
    }
  }

  // Chat API
  static async getChats(): Promise<ApiResponse<TransformedChat[]>> {
    try {
      const response = await apiRequest(BACKEND_CONFIG.CHAT.LIST);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      const rawData = await response.json();
      const transformedData = Array.isArray(rawData) 
        ? rawData.map(transformChat)
        : [];
      
      return {
        data: transformedData,
        error: null,
        loading: false,
      };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch chats',
        loading: false,
      };
    }
  }

  static async getChat(chatId: string): Promise<ApiResponse<TransformedChat & { messages: TransformedMessage[] }>> {
    try {
      const response = await apiRequest(BACKEND_CONFIG.CHAT.GET(chatId));
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      const rawData = await response.json();
      const transformedChat = transformChat(rawData);
      const transformedMessages = Array.isArray(rawData.messages) 
        ? rawData.messages.map(transformMessage)
        : [];
      
      return {
        data: {
          ...transformedChat,
          messages: transformedMessages,
        },
        error: null,
        loading: false,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch chat',
        loading: false,
      };
    }
  }

  static async createChat(title: string): Promise<ApiResponse<TransformedChat>> {
    try {
      const response = await apiRequest(BACKEND_CONFIG.CHAT.CREATE, {
        method: 'POST',
        body: JSON.stringify({ title }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      const rawData = await response.json();
      return {
        data: transformChat(rawData),
        error: null,
        loading: false,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to create chat',
        loading: false,
      };
    }
  }

  static async sendMessage(
    chatId: string, 
    content: string, 
    image?: File
  ): Promise<ApiResponse<TransformedMessage>> {
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('input_image', image);
      }

      const response = await apiRequest(BACKEND_CONFIG.CHAT.MESSAGE(chatId), {
        method: 'POST',
        headers: {}, // Let browser set Content-Type for FormData
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const rawData = await response.json();
      return {
        data: transformMessage(rawData),
        error: null,
        loading: false,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to send message',
        loading: false,
      };
    }
  }

  // Dashboard API
  static async getDashboardStats(): Promise<ApiResponse<TransformedDashboardStats>> {
    try {
      // Since the backend doesn't have a dedicated dashboard endpoint yet,
      // we'll create a composite response from multiple endpoints
      const [projectsResponse, chatsResponse] = await Promise.all([
        this.getProjects(),
        this.getChats(),
      ]);

      const stats: TransformedDashboardStats = {
        totalProjects: projectsResponse.data?.length || 0,
        totalChats: chatsResponse.data?.length || 0,
        recentActivity: [],
        storageUsed: '0 MB',
        storageLimit: '1 GB',
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
  static createLoadingState<T>(): ApiResponse<T> {
    return {
      data: null,
      error: null,
      loading: true,
    };
  }
} 