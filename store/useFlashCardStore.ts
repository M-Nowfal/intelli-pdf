import { create } from "zustand";
import { IFlashcard, IFlashcardItem } from "@/types/flashcard";
import { toast } from "sonner";
import api from "@/lib/axios";

interface FlashCardStore {
  flashCards: IFlashcardItem[];
  flashCardList: IFlashcard[];
  isLoading: boolean;
  isGenerating: boolean;

  fetchFlashCards: (pdfId: string) => Promise<void>;
  fetchFlashCardList: () => Promise<void>;
  generateFlashCards: (pdfId: string, count: number) => Promise<void>;
  deleteFlashCard: (pdfId: string, cardId: string) => Promise<void>;
}

export const useFlashCardStore = create<FlashCardStore>((set, get) => ({
  flashCards: [],
  flashCardList: [],
  isLoading: false,
  isGenerating: false,

  fetchFlashCards: async (pdfId: string) => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/flashcard/${pdfId}`);
      set({ flashCards: res.data });
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to load flashcards");
    } finally {
      set({ isLoading: false });
    }
  },
  fetchFlashCardList: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get("/flashcard");
      set({ flashCardList: res.data });
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to fetch your flashcard decks");
    } finally {
      set({ isLoading: false });
    }
  },

  generateFlashCards: async (pdfId: string, count: number) => {
    set({ isGenerating: true });
    try {
      const res = await api.post("/flashcard/generate", { pdfId, count });
      set({ flashCards: res.data.reverse() });
      toast.success("Generated 5 new flashcards!");
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to generate flashcards");
    } finally {
      set({ isGenerating: false });
    }
  },

  deleteFlashCard: async (pdfId: string, cardId: string) => {
    const originalList = get().flashCards;
    set((state) => ({ flashCards: state.flashCards.filter((c) => c._id !== cardId) }));

    try {
      await api.delete(`/flashcard/${pdfId}`, { data: { cardId } });
      toast.success("Flashcard deleted");
    } catch (err: unknown) {
      set({ flashCards: originalList });
      toast.error("Could not delete flashcard");
    }
  },
}));