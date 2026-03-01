import { create } from 'zustand';
import api from '@/lib/axios';

interface SummaryState {
  summary: { title: string, content: string } | null;
  summaryList: { id: string, title: string }[];
  isSummaryLoading: boolean;
  summaryError: string | null;
  source: "database" | "generated" | null;

  fetchSummary: (pdfId: string) => Promise<void>;
  fetchSummaryList: () => Promise<void>;
  removeSummary: (id: string) => void;
  deleteSummary: (id: string, onSuccess: () => void) => void;
}

export const useSummaryStore = create<SummaryState>((set, get) => ({
  summary: null,
  summaryList: [],
  isSummaryLoading: false,
  summaryError: null,
  source: null,

  fetchSummary: async (pdfId: string) => {
    if (get().summary) return;
    
    set({ isSummaryLoading: true, summaryError: null, summary: null });

    try {
      const res = await api.post(`/summary/${pdfId}`);

      if (res.status !== 200) {
        throw new Error("Failed to fetch summary");
      }

      const { pdfTitle, summary, source } = res.data;

      set((state) => {
        const exists = state.summaryList.some((item) => item.id === pdfId);
        
        let newSummaryList = state.summaryList;
        if (!exists) {
           newSummaryList = [{ id: pdfId, title: pdfTitle }, ...state.summaryList];
        }

        return {
          summary: { title: pdfTitle, content: summary },
          summaryList: newSummaryList,
          source
        };
      });
    } catch (err: unknown) {
      console.error(err);
      set({ summaryError: "Could not generate summary. Please try again later." });
    } finally {
      set({ isSummaryLoading: false });
    }
  },
  fetchSummaryList: async () => {
    try {
      if (get().summaryList.length > 0) return;

      set({ isSummaryLoading: true, summaryError: null });

      const res = await api.get(`/summary`);

      if (res.status !== 200) {
        throw new Error("Failed to fetch summary list");
      }

      set({ summaryList: res.data });
    } catch (err: unknown) {
      console.error(err);
      set({ summaryError: "Could not get summary list. Please try again later." });
    } finally {
      set({ isSummaryLoading: false });
    }
  },
  removeSummary: (id) => set(state => {
    return { summaryList: state.summaryList.filter(list => list.id !== id) };
  }),
  deleteSummary: async (id, onSuccess) => {
    try {
      set({ isSummaryLoading: true, summaryError: null });

      const res = await api.delete(`/summary?pdfId=${id}`);

      if (res.status !== 200) {
        throw new Error("Failed to delete summary");
      }

      set({ summaryList: get().summaryList.filter(list => list.id !== id) });

      if (onSuccess) {
        onSuccess();
      }

    } catch (err: unknown) {
      console.error(err);
      set({ summaryError: "Deletion failed, please try again later." });
    } finally {
      set({ isSummaryLoading: false });
    }
  },
}));
