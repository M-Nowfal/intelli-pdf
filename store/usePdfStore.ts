import { create } from 'zustand';
import { IPDF } from '@/types/pdf';

interface PdfState {
  pdfs: IPDF[];
  activePdfId: string | null;

  setPdfs: (pdfs: IPDF[]) => void;
  addPdf: (pdf: IPDF) => void;
  removePdf: (id: string) => void;

  selectPdf: (id: string) => void;

  getActivePdf: () => IPDF | undefined;
}

export const usePdfStore = create<PdfState>((set, get) => ({
  pdfs: [],
  activePdfId: null,

  setPdfs: (pdfs) => set({ pdfs }),

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
    return pdfs.find((p) => p._id === activePdfId);
  }
}));
