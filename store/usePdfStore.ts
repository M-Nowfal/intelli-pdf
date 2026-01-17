import { create } from 'zustand';
import { IPDF } from '@/types/pdf';
import api from '@/lib/axios';

interface PdfState {
  pdfs: IPDF[];
  activePdfId: string | null;
  isPdfLoading: boolean;

  summary: { title: string, content: string } | null;
  summaryList: { id: string, title: string }[];
  isSummaryLoading: boolean;

  summaryError: string | null;
  pdfError: string | null;

  fetchPdfs: () => Promise<void>;
  addPdf: (pdf: IPDF) => void;
  removePdf: (id: string) => void;
  selectPdf: (id: string) => void;
  getActivePdf: () => IPDF | undefined;

  fetchSummary: (pdfId: string) => Promise<void>;
  fetchSummaryList: () => Promise<void>;
  removeSummary: (id: string) => void;
  deleteSummary: (id: string, onSuccess: () => void) => void;
}

export const usePdfStore = create<PdfState>((set, get) => ({
  pdfs: [],
  activePdfId: null,
  isPdfLoading: false,

  summary: null,
  summaryList: [],
  isSummaryLoading: false,

  summaryError: null,
  pdfError: null,

  fetchPdfs: async () => {
    if (get().pdfs.length > 0) return;

    set({ isPdfLoading: true, pdfError: null });

    try {
      const response = await api.get<IPDF[]>('/pdf');

      set({ pdfs: response.data });
    } catch (error: any) {
      console.error("Failed to fetch PDFs:", error);
      set({
        pdfError: error.response?.data?.message || "Failed to load documents"
      });
    } finally {
      set({ isPdfLoading: false });
    }
  },

  addPdf: (pdf) => set((state) => ({
    pdfs: [pdf, ...state.pdfs]
  })),

  removePdf: (id) => set((state) => ({
    pdfs: state.pdfs.filter((pdf) => pdf._id !== id),
    activePdfId: state.activePdfId === id ? null : state.activePdfId
  })),

  selectPdf: (id) => set({ activePdfId: id }),

  getActivePdf: () => {
    const { pdfs, activePdfId } = get();
    return pdfs.find((pdf) => pdf._id === activePdfId);
  },

  fetchSummary: async (pdfId: string) => {
    set({ isSummaryLoading: true, summaryError: null, summary: null });

    try {
      const res = await api.post(`/summary/${pdfId}`);

      if (res.status !== 200) {
        throw new Error("Failed to fetch summary");
      }

      set({
        summary: {
          title: res.data.pdfTitle,
          content: res.data.summary
        }
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
