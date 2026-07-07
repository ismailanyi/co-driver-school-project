import { create } from 'zustand';
import api from '@/lib/api';
import { useAuthStore } from './useAuthStore';
import * as SecureStore from 'expo-secure-store';
import { Platform, Alert } from 'react-native';

interface ProfileState {
  isLoading: boolean;
  error: string | null;
  xpHistory: { date: string; total_xp: string }[];
  fetchUserData: () => Promise<void>;
  fetchXpHistory: () => Promise<void>;
  updateProfile: (data: { first_name: string; last_name: string; username?: string; email: string; phone_number: string; profile_picture?: string }) => Promise<boolean>;
  uploadProfilePicture: (uri: string, currentData: { first_name: string; last_name: string; username?: string; email: string; phone_number: string }) => Promise<boolean>;
  removeInstructor: () => Promise<boolean>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  isLoading: false,
  error: null,
  xpHistory: [],
  fetchUserData: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await useAuthStore.getState().getToken();
      if (!token) throw new Error("No token");

      const response = await api.get('/auth/me');
      useAuthStore.getState().setUser(response.data);
      set({ isLoading: false });
    } catch (err: any) {
      console.error("Error fetching user data:", err);
      set({ error: err.message, isLoading: false });
    }
  },
  fetchXpHistory: async () => {
    try {
      const res = await api.get('/auth/xp-history');
      set({ xpHistory: res.data });
    } catch (err: any) {
      console.error("Error fetching XP history:", err);
    }
  },
  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.patch('/auth/me', data);
      useAuthStore.getState().setUser(res.data.user);
      set({ isLoading: false });
      return true;
    } catch (err: any) {
      console.log("Profile update rejected (expected):", err.message);
      let errorMsg = "Could not update profile";
      if (err.response?.status === 409) {
          errorMsg = "Username or email is already taken. Please try another one.";
      } else if (err.response?.data?.message) {
          errorMsg = err.response.data.message;
      }
      
      // We use setTimeout so the alert pops up reliably after navigating back
      setTimeout(() => {
        Alert.alert('Update Failed', errorMsg);
      }, 500);

      set({ error: err.message, isLoading: false });
      return false;
    }
  },
  uploadProfilePicture: async (uri, currentData) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      if (Platform.OS === 'web') {
        const res = await fetch(uri);
        const blob = await res.blob();
        formData.append('image', blob, 'profile.jpg');
      } else {
        const filename = uri.split('/').pop() || 'profile.jpg';
        const match = /\\.(\\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        formData.append('image', { uri, name: filename, type } as any);
      }

      const token = await useAuthStore.getState().getToken();
      const uploadRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // No Content-Type header; fetch generates the boundary automatically
        },
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Upload failed with status " + uploadRes.status);
      }

      const responseData = await uploadRes.json();

      if (responseData.imageUrl) {
        const updateRes = await api.patch('/auth/me', {
          ...currentData,
          profile_picture: responseData.imageUrl,
        });
        useAuthStore.getState().setUser(updateRes.data.user);
        set({ isLoading: false });
        return true;
      }
      throw new Error("Upload failed to return URL");
    } catch (err: any) {
      console.log("Error uploading image:", err.message);
      
      setTimeout(() => {
        Alert.alert('Upload Failed', 'Could not upload your profile picture. Please try again.');
      }, 500);

      set({ error: err.message, isLoading: false });
      return false;
    }
  },
  removeInstructor: async () => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/remove-school-code', {});
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({ ...currentUser, school_code: null });
      }
      set({ isLoading: false });
      return true;
    } catch (err: any) {
      console.error("Error removing instructor:", err);
      set({ error: err.message, isLoading: false });
      return false;
    }
  },
}));
