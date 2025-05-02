import axios from 'axios';

// Base API URL - idealnya diambil dari environment variable
const API_URL = 'http://localhost:5000/api/auth';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    [key: string]: any; // untuk properti tambahan jika ada
  };
}

// Fungsi untuk login
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/login`, data);
    // Simpan token di localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk registrasi
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/register`, data);
    // Simpan token di localStorage jika auto login setelah registrasi
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk logout
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Fungsi untuk cek apakah user sudah login
export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem('token');
};

// Fungsi untuk mendapatkan user yang sedang login
export const getCurrentUser = (): any => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Fungsi untuk mendapatkan token
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Setup axios interceptor untuk menambahkan token pada setiap request
export const setupAxiosInterceptors = (): void => {
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};