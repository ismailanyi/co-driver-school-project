import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import api from '@/lib/api';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  username?: string;
  email: string;
  phone_number: string;
  role: string;
  school_code: string | null;
  total_xp: number;
  streak_count?: number;
  hearts?: number;
  course_progress?: any;
  profile_picture?: string;
  last_heart_refill?: string;
  created_at?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  linkSchool: (code: string) => Promise<boolean>;
  getToken: () => Promise<string | null>;
  signIn: (credentials: any) => Promise<{ success: boolean; requiresPasswordChange?: boolean; message?: string }>;
  signUp: (credentials: any) => Promise<{ success: boolean; temporaryPassword?: string; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (data: any) => Promise<{ success: boolean; message?: string }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    set({ token });
    if (token) {
      if (Platform.OS === 'web') {
        localStorage.setItem('userToken', token);
      } else {
        SecureStore.setItemAsync('userToken', token);
      }
    } else {
      if (Platform.OS === 'web') {
        localStorage.removeItem('userToken');
      } else {
        SecureStore.deleteItemAsync('userToken');
      }
    }
  },
  getToken: async () => {
    try {
      let token = null;
      if (Platform.OS === 'web') {
        token = localStorage.getItem('userToken');
      } else {
        token = await SecureStore.getItemAsync('userToken');
      }
      set({ token });
      return token;
    } catch (error) {
      console.error("Error fetching token:", error);
      return null;
    }
  },
  linkSchool: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      const token = await get().getToken();
      if (!token) throw new Error("No token found");

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/verify-school-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to link school.");
      }

      set({ user: data.user, isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message || "An error occurred", isLoading: false });
      return false;
    }
  },
  signIn: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/signin', credentials);
      get().setToken(res.data.token);
      
      // Fetch full user data immediately to ensure streaks and xp are populated
      try {
        const userRes = await api.get('/auth/me');
        set({ user: userRes.data });
      } catch (meError) {
        console.error("Failed to fetch full user on sign in:", meError);
      }

      set({ isLoading: false });
      return { success: true, requiresPasswordChange: res.data.requires_password_change, message: res.data.message };
    } catch (err: any) {
      set({ isLoading: false, error: err.response?.data?.message || "Sign in failed" });
      return { success: false, message: err.response?.data?.message || "Sign in failed" };
    }
  },
  signUp: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/signup', credentials);
      set({ isLoading: false });
      return { success: true, temporaryPassword: res.data.temporary_password, message: res.data.message };
    } catch (err: any) {
      set({ isLoading: false, error: err.response?.data?.message || "Sign up failed" });
      return { success: false, message: err.response?.data?.message || "Sign up failed" };
    }
  },
  forgotPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/forgot', { email });
      set({ isLoading: false });
      return { success: true, message: res.data.message };
    } catch (err: any) {
      set({ isLoading: false, error: err.response?.data?.message || "Request failed" });
      return { success: false, message: err.response?.data?.message || "Request failed" };
    }
  },
  resetPassword: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/reset', data);
      set({ isLoading: false });
      return { success: true, message: res.data.message };
    } catch (err: any) {
      set({ isLoading: false, error: err.response?.data?.message || "Reset failed" });
      return { success: false, message: err.response?.data?.message || "Reset failed" };
    }
  },
}));
