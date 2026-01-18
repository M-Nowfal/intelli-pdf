import { create } from 'zustand';
import { IPDF } from '@/types/pdf';
import api from '@/lib/axios';

interface PdfState {
  pdfs: IPDF[];
  activePdfId: string | null;
  isPdfLoading: boolean;
  pdfError: string | null;

  fetchPdfs: () => Promise<void>;
  addPdf: (pdf: IPDF) => void;
  removePdf: (id: string) => void;
  selectPdf: (id: string) => void;
  getActivePdf: () => IPDF | undefined;
}

export const usePdfStore = create<PdfState>((set, get) => ({
  pdfs: [],
  activePdfId: null,
  isPdfLoading: false,
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
}));
