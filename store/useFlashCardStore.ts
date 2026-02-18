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
  generateFlashCards: (pdfId: string, count: number) => Promise<boolean>;
  deleteFlashCard: (pdfId: string, cardId: string) => Promise<void>;
  deleteFlashCards: (deckId: string) => Promise<void>;
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

  generateFlashCards: async (pdfId: string, count: number): Promise<boolean> => {
    set({ isGenerating: true });
    let isSuccess = false;
    try {
      const res = await api.post("/flashcard/generate", { pdfId, count });
      set({ flashCards: res.data.reverse() });
      toast.success(`Generated ${count || 5} new flashcards!`);
      isSuccess = true;
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to generate flashcards");
    } finally {
      set({ isGenerating: false });
    }
    return isSuccess;
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

  deleteFlashCards: async (deckId: string) => {
    const originalList = get().flashCardList;

    set((state) => ({
      flashCardList: state.flashCardList.filter((deck) => deck._id !== deckId)
    }));

    try {
      const res = await api.delete(`/flashcard?flashCardId=${deckId}`);

      if (res.status !== 200) {
        throw new Error("Failed to delete");
      }

      toast.success("Deck deleted successfully");
    } catch (err: unknown) {
      console.error(err);
      set({ flashCardList: originalList });
      toast.error("Failed to delete deck");
    }
  }
}));