// Centralized configuration for all environment variables

// Backend API Configuration
export const BACKEND_CONFIG = {
  // Main backend URL
  BASE_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001",
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
  
  // Authentication endpoints
  AUTH: {
    SIGNUP: process.env.NEXT_PUBLIC_API_AUTH_SIGNUP || "/auth/signup",
    ADMIN_SIGNUP: process.env.NEXT_PUBLIC_API_AUTH_ADMIN_SIGNUP || "/auth/admin/signup",
    LOGIN: process.env.NEXT_PUBLIC_API_AUTH_LOGIN || "/auth/login",
    GOOGLE: process.env.NEXT_PUBLIC_API_AUTH_GOOGLE || "/auth/google",
    GITHUB: process.env.NEXT_PUBLIC_API_AUTH_GITHUB || "/auth/github",
    FORGOT_PASSWORD: process.env.NEXT_PUBLIC_API_AUTH_FORGOT_PASSWORD || "/auth/forgot-password",
    RESET_PASSWORD: process.env.NEXT_PUBLIC_API_AUTH_RESET_PASSWORD || "/auth/reset-password",
    LOGOUT: process.env.NEXT_PUBLIC_API_AUTH_LOGOUT || "/auth/logout",
  },
  
  // User management endpoints
  USERS: {
    PROFILE: process.env.NEXT_PUBLIC_API_USERS_PROFILE || "/users/profile",
    CHANGE_PASSWORD: process.env.NEXT_PUBLIC_API_USERS_CHANGE_PASSWORD || "/users/change-password",
  },
  
  // Chat endpoints
  CHAT: {
    LIST: process.env.NEXT_PUBLIC_API_CHAT_LIST || "/chats",
    CREATE: process.env.NEXT_PUBLIC_API_CHAT_CREATE || "/chats",
    GET: (id: string) => `${process.env.NEXT_PUBLIC_API_CHAT_GET || "/chats"}/${id}`,
    UPDATE: (id: string) => `${process.env.NEXT_PUBLIC_API_CHAT_UPDATE || "/chats"}/${id}/title`,
    DELETE: (id: string) => `${process.env.NEXT_PUBLIC_API_CHAT_DELETE || "/chats"}/${id}`,
    MESSAGE: (id: string) => `${process.env.NEXT_PUBLIC_API_CHAT_MESSAGE || "/chats"}/${id}/message`,
  },
  
  // Project endpoints
  PROJECTS: {
    CREATE: process.env.NEXT_PUBLIC_API_PROJECTS_CREATE || "/projects",
    LIST: process.env.NEXT_PUBLIC_API_PROJECTS_LIST || "/projects",
    IMAGES: (id: string) => `${process.env.NEXT_PUBLIC_API_PROJECTS_IMAGES || "/projects"}/${id}/images`,
    VIDEO: (id: string) => `${process.env.NEXT_PUBLIC_API_PROJECTS_VIDEO || "/projects"}/${id}/video`,
    DOCUMENTATION: (id: string) => `${process.env.NEXT_PUBLIC_API_PROJECTS_DOCUMENTATION || "/projects"}/${id}/documentation`,
  },
  
  // Interior endpoints
  INTERIOR: {
    CREATE: process.env.NEXT_PUBLIC_API_INTERIOR_CREATE || "/interior",
    GET_BY_PROJECT: (projectId: string) => `${process.env.NEXT_PUBLIC_API_INTERIOR_GET_BY_PROJECT || "/interior"}/${projectId}`,
  },
  
  // Exterior endpoints
  EXTERIOR: {
    CREATE: process.env.NEXT_PUBLIC_API_EXTERIOR_CREATE || "/exterior",
    GET_BY_PROJECT: (projectId: string) => `${process.env.NEXT_PUBLIC_API_EXTERIOR_GET_BY_PROJECT || "/exterior"}/${projectId}`,
  },
  
  // Download endpoints
  DOWNLOAD: {
    PROJECT: (projectId: string) => `${process.env.NEXT_PUBLIC_API_DOWNLOAD_PROJECT || "/download"}/${projectId}`,
  },
};

// Admin API Configuration
export const ADMIN_CONFIG = {
  // Admin authentication endpoints
  AUTH: {
    LOGIN: process.env.NEXT_PUBLIC_API_ADMIN_LOGIN || "/admin/auth/login",
    SIGNUP: process.env.NEXT_PUBLIC_API_ADMIN_SIGNUP || "/admin/auth/signup",
    FORGOT_PASSWORD: process.env.NEXT_PUBLIC_API_ADMIN_FORGOT_PASSWORD || "/admin/auth/forgot-password",
    RESET_PASSWORD: process.env.NEXT_PUBLIC_API_ADMIN_RESET_PASSWORD || "/admin/auth/reset-password",
    PROFILE: process.env.NEXT_PUBLIC_API_ADMIN_PROFILE || "/admin/auth/profile",
    VERIFY: process.env.NEXT_PUBLIC_API_ADMIN_VERIFY || "/admin/verify",
  },
  
  // Admin dashboard endpoints
  DASHBOARD: {
    STATS: process.env.NEXT_PUBLIC_API_ADMIN_DASHBOARD || "/admin/dashboard",
  },
  
  // Admin user management endpoints
  USERS: {
    LIST: process.env.NEXT_PUBLIC_API_ADMIN_USERS || "/admin/users",
    GET_BY_ID: (id: string) => `${process.env.NEXT_PUBLIC_API_ADMIN_USERS || "/admin/users"}/${id}`,
    UPDATE: (id: string) => `${process.env.NEXT_PUBLIC_API_ADMIN_USERS || "/admin/users"}/${id}`,
    DELETE: (id: string) => `${process.env.NEXT_PUBLIC_API_ADMIN_USERS || "/admin/users"}/${id}`,
    BLOCK: (id: string) => `${process.env.NEXT_PUBLIC_API_ADMIN_USERS || "/admin/users"}/${id}/block`,
    UNBLOCK: (id: string) => `${process.env.NEXT_PUBLIC_API_ADMIN_USERS || "/admin/users"}/${id}/unblock`,
    PROMOTE: (id: string) => `${process.env.NEXT_PUBLIC_API_ADMIN_USERS || "/admin/users"}/${id}/promote`,
    DEMOTE: (id: string) => `${process.env.NEXT_PUBLIC_API_ADMIN_USERS || "/admin/users"}/${id}/demote`,
    STATS: process.env.NEXT_PUBLIC_API_ADMIN_USERS_STATS || "/admin/users/statistics",
  },
  
  // Admin project management endpoints
  PROJECTS: {
    LIST: process.env.NEXT_PUBLIC_API_ADMIN_PROJECTS || "/admin/projects",
    METRICS: process.env.NEXT_PUBLIC_API_ADMIN_PROJECTS_METRICS || "/admin/metrics/projects",
  },
  
  // Admin chat management endpoints
  CHATS: {
    LIST: process.env.NEXT_PUBLIC_API_ADMIN_CHATS || "/admin/chats",
    GET_BY_ID: (id: string) => `${process.env.NEXT_PUBLIC_API_ADMIN_CHATS || "/admin/chats"}/${id}`,
    DELETE: (id: string) => `${process.env.NEXT_PUBLIC_API_ADMIN_CHATS || "/admin/chats"}/${id}`,
  },
  
  // Admin analytics endpoints
  ANALYTICS: {
    SECURITY: process.env.NEXT_PUBLIC_API_ADMIN_ANALYTICS_SECURITY || "/admin/metrics/security",
    ADVANCED: process.env.NEXT_PUBLIC_API_ADMIN_ANALYTICS_ADVANCED || "/admin/analytics/advanced",
  },

  // Admin security endpoints
  SECURITY: {
    METRICS: process.env.NEXT_PUBLIC_API_ADMIN_SECURITY_METRICS || "/admin/metrics/security",
  },

  // Admin settings endpoints
  SETTINGS: {
    GET: process.env.NEXT_PUBLIC_API_ADMIN_SETTINGS || "/admin/settings",
    UPDATE: process.env.NEXT_PUBLIC_API_ADMIN_SETTINGS || "/admin/settings",
  },

  // Admin broadcast endpoints
  BROADCAST: {
    EMAIL: process.env.NEXT_PUBLIC_API_ADMIN_BROADCAST_EMAIL || "/admin/broadcast/email",
  },
  
  // Admin system endpoints
  SYSTEM: {
    SETTINGS: process.env.NEXT_PUBLIC_API_ADMIN_SETTINGS || "/admin/settings",
    BROADCAST_EMAIL: process.env.NEXT_PUBLIC_API_ADMIN_BROADCAST_EMAIL || "/admin/broadcast/email",
    EXPORT: process.env.NEXT_PUBLIC_API_ADMIN_EXPORT || "/admin/export",
  },
  
  // Admin bulk operations
  BULK: {
    USERS_UPDATE: process.env.NEXT_PUBLIC_API_ADMIN_BULK_USERS_UPDATE || "/admin/users/bulk-update",
    USERS_DELETE: process.env.NEXT_PUBLIC_API_ADMIN_BULK_USERS_DELETE || "/admin/users/bulk-delete",
    USERS_BLOCK: process.env.NEXT_PUBLIC_API_ADMIN_BULK_USERS_BLOCK || "/admin/users/bulk-block",
    USERS_UNBLOCK: process.env.NEXT_PUBLIC_API_ADMIN_BULK_USERS_UNBLOCK || "/admin/users/bulk-unblock",
  },
  
  // Admin storage management
  STORAGE: {
    USAGE: process.env.NEXT_PUBLIC_API_ADMIN_STORAGE_USAGE || "/admin/storage/usage",
    CLEANUP: process.env.NEXT_PUBLIC_API_ADMIN_STORAGE_CLEANUP || "/admin/storage/cleanup",
  },
  
  // Admin API key management
  API_KEYS: {
    LIST: process.env.NEXT_PUBLIC_API_ADMIN_API_KEYS || "/admin/api/keys",
    CREATE: process.env.NEXT_PUBLIC_API_ADMIN_API_KEYS || "/admin/api/keys",
    DELETE: (id: string) => `${process.env.NEXT_PUBLIC_API_ADMIN_API_KEYS || "/admin/api/keys"}/${id}`,
  },
  
  // Admin backup management
  BACKUP: {
    CREATE: process.env.NEXT_PUBLIC_API_ADMIN_BACKUP_CREATE || "/admin/backup/create",
    LIST: process.env.NEXT_PUBLIC_API_ADMIN_BACKUP_LIST || "/admin/backup/list",
    RESTORE: (id: string) => `${process.env.NEXT_PUBLIC_API_ADMIN_BACKUP_RESTORE || "/admin/backup/restore"}/${id}`,
    STATS: process.env.NEXT_PUBLIC_API_ADMIN_BACKUP_STATS || "/admin/backup/stats",
    DELETE: (id: string) => `${process.env.NEXT_PUBLIC_API_ADMIN_BACKUP_DELETE || "/admin/backup/delete"}/${id}`,
  },

  // Admin export management
  EXPORT: {
    DATA: process.env.NEXT_PUBLIC_API_ADMIN_EXPORT || "/admin/export",
    JOBS: process.env.NEXT_PUBLIC_API_ADMIN_EXPORT_JOBS || "/admin/export/jobs",
    DOWNLOAD: (id: string) => `${process.env.NEXT_PUBLIC_API_ADMIN_EXPORT_DOWNLOAD || "/admin/export/download"}/${id}`,
  },
};

// AI Generation API Configuration
export const AI_CONFIG = {
  // AI Image Generation API
  BASE_URL: process.env.NEXT_PUBLIC_AI_API_BASE || "https://my.mayaai.online",
  
  // Generation endpoints
  GENERATE: {
    DIFFUSION: process.env.NEXT_PUBLIC_API_AI_GENERATE_DIFFUSION || "/generate/",
    IMAGE_TO_IMAGE: process.env.NEXT_PUBLIC_API_AI_GENERATE_IMAGE_TO_IMAGE || "/generate/",
  },
};

// ElevenLabs Configuration
export const ELEVENLABS_CONFIG = {
  AGENT_ID: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "agent_5101k196114cfwbt26y8npftf2zj",
  WIDGET_SCRIPT: "https://unpkg.com/@elevenlabs/convai-widget-embed",
};

// Feature flags
export const FEATURES = {
  AUTH_ENABLED: process.env.NEXT_PUBLIC_AUTH_ENABLED === "true",
  ELEVENLABS_ENABLED: process.env.NEXT_PUBLIC_ELEVENLABS_ENABLED === "true",
  ADMIN_PANEL_ENABLED: process.env.NEXT_PUBLIC_ADMIN_PANEL_ENABLED === "true",
  CHAT_ENABLED: process.env.NEXT_PUBLIC_CHAT_ENABLED === "true",
  PROJECT_EXPORT_ENABLED: process.env.NEXT_PUBLIC_PROJECT_EXPORT_ENABLED === "true",
};

// Security Configuration
export const SECURITY_CONFIG = {
  SESSION_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || "3600", 10),
  MAX_LOGIN_ATTEMPTS: parseInt(process.env.NEXT_PUBLIC_MAX_LOGIN_ATTEMPTS || "5", 10),
};

// Admin Panel Configuration
export const ADMIN_PANEL_CONFIG = {
  EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@mayaai.com",
  PASSWORD: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123",
};

// Environment detection
export const ENV = {
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_TEST: process.env.NODE_ENV === "test",
  DEBUG: process.env.NEXT_PUBLIC_DEBUG === "true",
};

// Helper functions
export const getBackendUrl = (endpoint: string): string => {
  return `${BACKEND_CONFIG.BASE_URL}${endpoint}`;
};

export const getAdminUrl = (endpoint: string): string => {
  return `${BACKEND_CONFIG.BASE_URL}${endpoint}`;
};

export const getAiUrl = (endpoint: string): string => {
  return `${AI_CONFIG.BASE_URL}${endpoint}`;
};

export const isLocalhost = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}; 