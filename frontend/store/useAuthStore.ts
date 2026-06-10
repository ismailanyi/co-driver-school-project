import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  school_code: string | null;
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
    let token = null;
    if (Platform.OS === 'web') {
      token = localStorage.getItem('userToken');
    } else {
      token = await SecureStore.getItemAsync('userToken');
    }
    set({ token });
    return token;
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
}));
