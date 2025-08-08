import { BACKEND_CONFIG } from './config';

export interface AdminLoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    isAdmin?: boolean;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  isAdmin?: boolean; // Optional since backend might not include it
}

class AdminAuthService {
  // Admin login
  static async login(email: string, password: string): Promise<AdminLoginResponse> {
    try {
      console.log('Attempting login to:', `${BACKEND_CONFIG.BASE_URL}/admin/auth/login`);
      
      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        // Try to parse error response, but handle empty responses gracefully
        let errorData: any = {};
        try {
          const text = await response.text();
          if (text && text.trim()) {
            errorData = JSON.parse(text);
          }
        } catch (parseError) {
          // Silently handle parse errors
        }
        console.log('Login error data:', errorData);
        throw new Error(errorData?.message || `Login failed: ${response.status}`);
      }

      // Check if response has content before trying to parse JSON
      let text = '';
      try {
        text = await response.text();
      } catch (textError) {
        throw new Error('Failed to read response from server');
      }
      
      if (!text || !text.trim()) {
        throw new Error('Empty response from server');
      }
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        throw new Error('Invalid response format from server');
      }
      console.log('Login response data:', data);
      
      // Backend returns token and admin user data
      if (data.token && data.admin) {
        console.log('Token and admin data received from backend');
        
        // Store token
        localStorage.setItem('adminToken', data.token);
        
        // Verify admin data
        const adminData = data.admin;
        console.log('Admin data:', adminData);
        
        // Check if admin is active
        if (adminData.isActive === false) {
          this.clearAuthData();
          throw new Error('Account is deactivated');
        }
        
        // Store admin user data
        localStorage.setItem('adminUser', JSON.stringify(adminData));
        
        return {
          token: data.token,
          user: adminData,
        };
      } else if (data.token) {
        // Fallback: Backend returns only token, fetch profile
        console.log('Only token received, fetching user profile...');
        localStorage.setItem('adminToken', data.token);
        
        try {
          const userResponse = await fetch(`${BACKEND_CONFIG.BASE_URL}/admin/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${data.token}`,
              'Content-Type': 'application/json',
            },
          });

          console.log('Profile response status:', userResponse.status);

          if (!userResponse.ok) {
            // Try to parse error response, but handle empty responses gracefully
            let profileError: any = {};
            try {
              const text = await userResponse.text();
              if (text && text.trim()) {
                profileError = JSON.parse(text);
              }
            } catch (parseError) {
              // Silently handle parse errors
            }
            console.log('Profile error:', profileError);
            throw new Error(`Failed to fetch user profile: ${userResponse.status}`);
          }

          // Check if response has content before trying to parse JSON
          let profileText = '';
          try {
            profileText = await userResponse.text();
          } catch (textError) {
            throw new Error('Failed to read profile response from server');
          }
          
          if (!profileText || !profileText.trim()) {
            throw new Error('Empty profile response from server');
          }
          
          let userData;
          try {
            userData = JSON.parse(profileText);
          } catch (parseError) {
            throw new Error('Invalid profile response format from server');
          }
          console.log('User profile data:', userData);
          
          // Check if isAdmin field exists
          if (userData.isAdmin === undefined) {
            console.log('Warning: isAdmin field not found in user profile');
            if (process.env.NODE_ENV === 'development') {
              console.log('Development mode: Allowing login without isAdmin check');
              userData.isAdmin = true;
            } else {
              this.clearAuthData();
              throw new Error('User profile does not contain admin information');
            }
          }
          
          if (!userData.isAdmin) {
            this.clearAuthData();
            throw new Error('Access denied: Admin privileges required');
          }

          if (userData.isActive === false) {
            this.clearAuthData();
            throw new Error('Account is deactivated');
          }

          localStorage.setItem('adminUser', JSON.stringify(userData));

          return {
            token: data.token,
            user: userData,
          };
        } catch (profileError) {
          console.log('Profile fetch error:', profileError);
          this.clearAuthData();
          throw profileError;
        }
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      // Clear any stored data on error
      console.log('Login error:', error);
      this.clearAuthData();
      throw error;
    }
  }

  // Admin signup
  static async signup(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<AdminLoginResponse> {
    try {
      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}/auth/admin/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Signup failed');
      }

      const responseData = await response.json();
      
      if (responseData.token && responseData.user) {
        localStorage.setItem('adminToken', responseData.token);
        localStorage.setItem('adminUser', JSON.stringify(responseData.user));
        return responseData;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }

  // Get current admin user
  static getCurrentUser(): AdminUser | null {
    try {
      const userData = localStorage.getItem('adminUser');
      console.log("=== getCurrentUser() DEBUG ===");
      console.log("Raw userData:", userData);
      
      if (userData) {
        const user = JSON.parse(userData);
        console.log("Parsed user:", user);
        console.log("User isActive:", user.isActive);
        
        // Return user if active (isAdmin check is optional since backend provides admin data)
        const result = user.isActive ? user : null;
        console.log("getCurrentUser result:", result);
        console.log("=== getCurrentUser() END ===");
        return result;
      }
      
      console.log("No userData found");
      console.log("=== getCurrentUser() END ===");
      return null;
    } catch (error) {
      console.error("Error in getCurrentUser:", error);
      console.log("=== getCurrentUser() END ===");
      return null;
    }
  }

  // Get auth token
  static getToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  // Check if user is authenticated and is admin
  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    
    console.log("=== isAuthenticated() DEBUG ===");
    console.log("Token exists:", !!token);
    console.log("User exists:", !!user);
    console.log("User data:", user);
    console.log("User isActive:", user?.isActive);
    
    // If user exists and is active, consider authenticated (isAdmin check is optional)
    const result = !!(token && user && user.isActive);
    console.log("Authentication result:", result);
    console.log("=== isAuthenticated() END ===");
    
    return result;
  }

  // Get auth headers for API requests
  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // Verify token validity
  static async verifyToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}/admin/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        this.clearAuthData();
        return false;
      }

      // Check if response has content before trying to parse JSON
      let text = '';
      try {
        text = await response.text();
      } catch (textError) {
        this.clearAuthData();
        return false;
      }
      
      if (!text || !text.trim()) {
        this.clearAuthData();
        return false;
      }
      
      let userData;
      try {
        userData = JSON.parse(text);
      } catch (parseError) {
        this.clearAuthData();
        return false;
      }
      
      // Update stored user data
      localStorage.setItem('adminUser', JSON.stringify(userData));
      
      // Return true if user is active (isAdmin check is optional)
      return userData.isActive;
    } catch (error) {
      this.clearAuthData();
      return false;
    }
  }

  // Logout
  static logout(): void {
    this.clearAuthData();
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
  }

  // Clear all auth data
  static clearAuthData(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  }

  // Handle token expiration
  static handleTokenExpiration(): void {
    this.clearAuthData();
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
  }
}

export default AdminAuthService; 
