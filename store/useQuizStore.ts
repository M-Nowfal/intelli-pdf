import { create } from "zustand";
import api from "@/lib/axios";
import { toast } from "sonner";

export interface Question {
  _id?: string;
  question: string;
  options: string[];
  answer: string;
}

export interface QuizItem {
  _id: string;
  pdfId: {
    _id: string;
    title: string;
  };
  questions: Question[];
  score: number;
  createdAt: string;
}

interface QuizState {
  quizzes: QuizItem[];
  currentQuiz: QuizItem | null;
  isLoading: boolean;

  fetchQuizzes: () => Promise<void>;
  loadQuiz: (id: string) => Promise<void>;
  generateQuiz: (pdfId: string, amount: number) => Promise<string | null>; // Returns quizId
  submitScore: (quizId: string, score: number) => Promise<void>;
  deleteQuiz: (quizId: string) => Promise<void>;
  resetCurrentQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  quizzes: [],
  currentQuiz: null,
  isLoading: false,

  fetchQuizzes: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get("/quiz");
      set({ quizzes: res.data });
    } catch (error) {
      console.error("Failed to fetch quizzes", error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadQuiz: async (id) => {
    const current = get().currentQuiz;
    if (current && current._id === id) return;

    const existing = get().quizzes.find((q) => q._id === id);
    if (existing) {
      set({ currentQuiz: existing });
      return;
    }

    set({ isLoading: true });
    try {
      const res = await api.get(`/quiz/${id}`);
      set({ currentQuiz: res.data });
    } catch (error) {
      toast.error("Failed to load quiz");
    } finally {
      set({ isLoading: false });
    }
  },

  generateQuiz: async (pdfId, amount) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/quiz/generate", { pdfId, amount });

      set({ currentQuiz: res.data });

      const list = get().quizzes;
      if (!list.find((q) => q._id === res.data._id)) {
        set({ quizzes: [res.data, ...list] });
      }

      return res.data._id;
    } catch (error) {
      toast.error("Failed to generate quiz");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  submitScore: async (quizId, score) => {
    try {
      await api.post("/quiz/submit", { quizId, score });

      set((state) => ({
        currentQuiz: state.currentQuiz ? { ...state.currentQuiz, score } : null,
        quizzes: state.quizzes.map((q) =>
          q._id === quizId ? { ...q, score } : q
        )
      }));
    } catch (error) {
      console.error("Error submitting score", error);
    }
  },

  deleteQuiz: async (quizId) => {
    set({ isLoading: true });
    try {
      await api.delete(`/quiz/${quizId}`);
      set((state) => ({
        quizzes: state.quizzes.filter((q) => q.pdfId._id !== quizId),
        currentQuiz: state.currentQuiz?._id === quizId ? null : state.currentQuiz
      }));
      toast.success("Quiz deleted successfully");
    } catch (error) {
      toast.error("Failed to delete quiz");
    } finally {
      set({ isLoading: false });
    }
  },

  resetCurrentQuiz: () => set({ currentQuiz: null })
}));