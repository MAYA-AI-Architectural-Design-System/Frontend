// Authentication utilities for Maya AI backend integration

import { BACKEND_CONFIG, getBackendUrl } from "./config";

// Token management
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("maya_token") || localStorage.getItem("token");
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("maya_token", token);
    localStorage.setItem("token", token); // For backward compatibility
  }
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("maya_token");
    localStorage.removeItem("token"); // For backward compatibility
  }
};

// API request wrapper with authentication
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();
  
  const defaultHeaders: HeadersInit = {};

  // Only set Content-Type for JSON requests, not for FormData
  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(getBackendUrl(endpoint), {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  // Handle authentication errors
  if (response.status === 401) {
    removeToken();
    window.location.href = "/login";
    throw new Error("Authentication required");
  }

  return response;
};

// User profile management
export const getUserProfile = async () => {
  try {
    const response = await apiRequest(BACKEND_CONFIG.USERS.PROFILE);
    if (!response.ok) throw new Error("Failed to fetch profile");
    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// Authentication check
export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

// Logout function
export const logout = (): void => {
  removeToken();
  window.location.href = "/login";
}; 