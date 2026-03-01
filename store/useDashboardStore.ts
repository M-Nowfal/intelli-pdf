import api from '@/lib/axios';
import { create } from 'zustand';

interface DashboardStore {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;

  fetchStats: (refetch?: boolean) => Promise<void>;
  decrementCredits: (amount: number) => void;
  refetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchStats: async (refetch = false) => {
    if (get().stats && !refetch) return;

    set({ isLoading: true, error: null });

    try {
      const response = await api.get("/dashboard/stats");

      if (response.status !== 200)
        throw new Error(response.data.message || "Failed to fetch stats");

      set({
        stats: response.data.stats,
        error: null
      });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  decrementCredits: (amount) => set((state) => ({
    stats: state.stats ? {
      ...state.stats,
      aiCredits: Math.max(0, state.stats.aiCredits - amount)
    } : null
  })),
  refetchStats: () => get().fetchStats(true)
}));