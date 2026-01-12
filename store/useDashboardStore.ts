import api from '@/lib/axios';
import { create } from 'zustand';

interface DashboardStore {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  decrementCredits: (amount: number) => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchStats: async () => {
    if (get().stats) return;

    set({ isLoading: true, error: null });

    try {
      const response = await api.get("/dashboard/stats");

      if (response.status !== 200)
        throw new Error(response.data.message || "Failed to fetch stats");

      const statsData = response.data.stats;

      set({
        stats: {
          totalDocuments: statsData.totalDocuments,
          flashcardsMastered: statsData.flashcardsMastered,
          studyStreak: statsData.studyStreak,
          aiCredits: statsData.aiCredits
        },
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
      totalDocuments: state.stats.totalDocuments,
      flashcardsMastered: state.stats.flashcardsMastered,
      studyStreak: state.stats.studyStreak,
      aiCredits: Math.max(0, state.stats.aiCredits - amount)
    } : null
  }))
}));