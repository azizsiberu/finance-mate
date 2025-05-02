import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { 
  login as loginService, 
  logout as logoutService,
  register as registerService,
  isLoggedIn,
  getCurrentUser,
  setupAxiosInterceptors
} from '../services/authService';

// Tipe untuk user
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  [key: string]: any;
}

// Tipe untuk response autentikasi
interface AuthResponse {
  token: string;
  user: User;
}

// Tipe untuk context value
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthResponse | undefined>;
  register: (firstName: string, email: string, password: string, lastName?: string) => Promise<AuthResponse | undefined>;
  logout: () => void;
  clearError: () => void;
}

// Default value untuk context (digunakan saat context belum tersedia)
const defaultContextValue: AuthContextType = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  login: async () => undefined,
  register: async () => undefined,
  logout: () => {},
  clearError: () => {}
};

// Membuat context dengan nilai default
const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Props untuk AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Context provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Setup axios interceptor dan cek autentikasi saat aplikasi dimuat
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        setupAxiosInterceptors();
        
        // Cek apakah user sudah login berdasarkan token di localStorage
        if (isLoggedIn()) {
          const currentUser = getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Jika user data tidak valid, lakukan logout
            logoutService();
          }
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        // Jika terjadi error, pastikan user dalam keadaan logged out
        logoutService();
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Fungsi login
  const login = async (email: string, password: string): Promise<AuthResponse | undefined> => {
    try {
      setLoading(true);
      setError(null);
      const response = await loginService({ email, password });
      setUser(response.user);
      return response;
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fungsi register
  const register = async (firstName: string, email: string, password: string, lastName?: string): Promise<AuthResponse | undefined> => {
    try {
      setLoading(true);
      setError(null);
      const response = await registerService({ 
        firstName, 
        lastName: lastName || '', 
        email, 
        password 
      });
      setUser(response.user);
      return response;
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.response?.data?.error || 'Failed to register. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fungsi logout
  const logout = () => {
    logoutService();
    setUser(null);
  };

  // Fungsi untuk clear error
  const clearError = () => {
    setError(null);
  };

  // Value yang akan diberikan ke consumer
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook untuk menggunakan auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;