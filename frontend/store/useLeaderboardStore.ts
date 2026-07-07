import { create } from 'zustand';
import api from '@/lib/api';

export interface LeaderboardUser {
  id: string;
  first_name: string;
  last_name: string;
  total_xp: number;
  profile_picture?: string;
}

interface LeaderboardState {
  users: LeaderboardUser[];
  isLoading: boolean;
  error: string | null;
  fetchLeaderboard: () => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  users: [],
  isLoading: false,
  error: null,
  fetchLeaderboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/auth/leaderboard');
      set({ users: res.data, isLoading: false });
    } catch (err: any) {
      console.error("Failed to fetch leaderboard", err);
      set({ error: err.message || "Failed to fetch leaderboard", isLoading: false });
    }
  },
}));
