// Authentication utility functions
export interface TokenData {
  token: string;
  expiresAt?: number;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export const AUTH_TOKEN_KEY = "maya_token";
export const AUTH_TOKEN_BACKUP_KEY = "token"; // For compatibility



// Get token data
export const getTokenData = (): TokenData | null => {
  if (typeof window === "undefined") return null;
  
  const token = localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_BACKUP_KEY);
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < currentTime) {
      // Token is expired, remove it
      console.log("Token expired, removing from storage");
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_TOKEN_BACKUP_KEY);
      return null;
    }
    
    return {
      token,
      expiresAt: payload.exp,
      user: {
        id: payload.sub || payload.id,
        email: payload.email,
        name: payload.name,
      },
    };
  } catch (error) {
    // Invalid token format, remove it
    console.log("Invalid token format, removing from storage");
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_TOKEN_BACKUP_KEY);
    return null;
  }
};

// Save token to localStorage
export const saveToken = (token: string): void => {
  if (typeof window === "undefined") return;
  
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_TOKEN_BACKUP_KEY, token); // For compatibility
};

// Remove token from localStorage
export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_TOKEN_BACKUP_KEY);
};

// Logout function
export const logout = (): void => {
  if (typeof window === "undefined") return;
  
  // Remove tokens
  removeToken();
  
  // Redirect to login page
  window.location.href = "/login";
};

// Get redirect path based on authentication status
export const getRedirectPath = (isAuthenticated: boolean): string => {
  if (isAuthenticated) {
    return "/dashboard"; // Redirect to dashboard if authenticated
  } else {
    return "/login";
  }
};

// Check if user is authenticated and redirect if needed
export const checkAuthAndRedirect = (): boolean => {
  const tokenData = getTokenData();
  if (!tokenData) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return false;
  }
  return true;
};

// Validate token with server
export const validateTokenWithServer = async (): Promise<boolean> => {
  const tokenData = getTokenData();
  if (!tokenData) return false;
  
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"}/users/profile`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    if (response.ok) {
      return true;
    } else {
      // Token is invalid, remove it
      removeToken();
      return false;
    }
  } catch (error) {
    console.error("Error validating token:", error);
    removeToken();
    return false;
  }
};





 