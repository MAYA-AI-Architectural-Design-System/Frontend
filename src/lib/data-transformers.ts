// Data transformation utilities for Maya AI frontend
// This ensures consistent data formatting across the application

export interface TransformedUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
}

export interface TransformedProject {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'archived' | 'deleted';
  imageCount: number;
  roomCount: number;
  thumbnail?: string;
}

export interface TransformedChat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage?: {
    content: string;
    timestamp: string;
    type: 'user' | 'assistant';
  };
}

export interface TransformedMessage {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: string;
  aiImageUrl?: string;
  uploadedImageUrl?: string;
  isProcessing?: boolean;
}

export interface TransformedDashboardStats {
  totalProjects: number;
  totalChats: number;
  recentActivity: Array<{
    type: 'project' | 'chat' | 'login';
    title: string;
    timestamp: string;
  }>;
  storageUsed: string;
  storageLimit: string;
}

// Transform user data from backend response
export const transformUser = (rawUser: any): TransformedUser => {
  return {
    id: rawUser.id || rawUser._id,
    name: rawUser.name || 'Unknown User',
    email: rawUser.email || '',
    isAdmin: Boolean(rawUser.isAdmin),
    isActive: Boolean(rawUser.isActive),
    createdAt: rawUser.createdAt || new Date().toISOString(),
    lastLogin: rawUser.lastLogin,
    avatar: rawUser.avatar || rawUser.profileImage,
  };
};

// Transform project data from backend response
export const transformProject = (rawProject: any): TransformedProject => {
  return {
    id: rawProject.id || rawProject._id,
    name: rawProject.name || 'Untitled Project',
    description: rawProject.description,
    createdAt: rawProject.createdAt || new Date().toISOString(),
    updatedAt: rawProject.updatedAt || rawProject.createdAt || new Date().toISOString(),
    status: rawProject.status || 'active',
    imageCount: rawProject.imageCount || 0,
    roomCount: rawProject.roomCount || 0,
    thumbnail: rawProject.thumbnail || rawProject.previewImage,
  };
};

// Transform chat data from backend response
export const transformChat = (rawChat: any): TransformedChat => {
  const messages = Array.isArray(rawChat.messages) ? rawChat.messages : [];
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  return {
    id: rawChat.id || rawChat._id,
    title: rawChat.title || 'New Chat',
    createdAt: rawChat.createdAt || new Date().toISOString(),
    updatedAt: rawChat.updatedAt || rawChat.createdAt || new Date().toISOString(),
    messageCount: messages.length,
    lastMessage: lastMessage ? {
      content: lastMessage.content || '',
      timestamp: lastMessage.timestamp || new Date().toISOString(),
      type: lastMessage.type || 'user',
    } : undefined,
  };
};

// Transform message data from backend response
export const transformMessage = (rawMessage: any): TransformedMessage => {
  return {
    id: rawMessage.id || rawMessage._id,
    content: rawMessage.content || '',
    type: rawMessage.type || 'user',
    timestamp: rawMessage.timestamp || new Date().toISOString(),
    aiImageUrl: rawMessage.aiImageUrl,
    uploadedImageUrl: rawMessage.uploadedImageUrl,
    isProcessing: Boolean(rawMessage.isProcessing),
  };
};

// Transform dashboard stats from backend response
export const transformDashboardStats = (rawStats: any): TransformedDashboardStats => {
  return {
    totalProjects: rawStats.totalProjects || 0,
    totalChats: rawStats.totalChats || 0,
    recentActivity: Array.isArray(rawStats.recentActivity) 
      ? rawStats.recentActivity.map((activity: any) => ({
          type: activity.type || 'project',
          title: activity.title || 'Unknown Activity',
          timestamp: activity.timestamp || new Date().toISOString(),
        }))
      : [],
    storageUsed: rawStats.storageUsed || '0 MB',
    storageLimit: rawStats.storageLimit || '1 GB',
  };
};

// Transform paginated response
export const transformPaginatedResponse = <T>(
  rawResponse: any,
  transformer: (item: any) => T
): {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} => {
  const data = Array.isArray(rawResponse.data || rawResponse.items || rawResponse)
    ? (rawResponse.data || rawResponse.items || rawResponse).map(transformer)
    : [];

  return {
    data,
    pagination: {
      page: rawResponse.page || 1,
      limit: rawResponse.limit || 10,
      total: rawResponse.total || data.length,
      totalPages: rawResponse.totalPages || Math.ceil((rawResponse.total || data.length) / (rawResponse.limit || 10)),
    },
  };
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format storage usage percentage
export const formatStorageUsage = (used: string, limit: string): number => {
  const usedBytes = parseFloat(used.replace(/[^\d.]/g, ''));
  const limitBytes = parseFloat(limit.replace(/[^\d.]/g, ''));
  return Math.round((usedBytes / limitBytes) * 100);
}; 