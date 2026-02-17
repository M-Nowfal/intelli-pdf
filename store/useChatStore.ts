import { create } from "zustand";
import api from "@/lib/axios";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: number[];
}

interface ChatItem {
  _id: string;
  pdfId: {
    _id: string;
    title: string;
  };
}

interface ChatState {
  chatList: ChatItem[];
  messages: Message[];
  chatId: string;

  isLoading: boolean;
  isMessagesLoading: boolean;
  isStreaming: boolean;
  isStrict: boolean;

  setMessages: (messages: Message[]) => void;
  setStreaming: (status: boolean) => void;
  setChatId: (id: string) => void;

  setIsStrict: (isStrict: boolean) => void;

  fetchChatList: () => Promise<void>;
  fetchMessages: (pdfId: string) => Promise<void>;

  addMessage: (message: Message) => void;
  updateMessageContent: (id: string, content: string) => void;

  addChat: (newChat: ChatItem) => void;
  clearChat: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string, onSuccess?: () => void) => Promise<void>;

  removeChatFromList: (pdfId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chatList: [],
  messages: [],
  chatId: "",
  isLoading: false,
  isMessagesLoading: false,
  isStreaming: false,
  isStrict: true,

  setMessages: (messages) => set({ messages }),
  setStreaming: (status) => set({ isStreaming: status }),
  setChatId: (id) => set({ chatId: id }),

  setIsStrict: (isStrict) => set({ isStrict }),

  fetchChatList: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get("/chat/list");
      set({ chatList: res.data });
    } catch (err: unknown) {
      console.error("Failed to fetch chats", err);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMessages: async (pdfId) => {
    set({ isMessagesLoading: true, messages: [] });
    try {
      const res = await api.get(`/chat?pdfId=${pdfId}`);
      const formattedMessages: Message[] = res.data?.messages?.map((msg: any) => ({
        id: msg._id,
        role: msg.role,
        content: msg.content,
        sources: msg.sources || []
      }));
      set({ messages: formattedMessages || [], chatId: res.data?._id });
    } catch (err: unknown) {
      console.error("Failed to fetch history", err);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateMessageContent: (id, content) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content } : msg
      )
    })),

  addChat: (chat) => set((state) => {
    const exists = state.chatList.some((c) => c._id === chat._id);
    if (exists) return state;

    return { chatList: [chat, ...state.chatList] };
  }),

  clearChat: async (chatId) => {
    try {
      await api.put("/chat/action", { chatId });
      set({ messages: [] });
    } catch (err: unknown) {
      console.error("Failed to clear chat", err);
    }
  },

  deleteChat: async (chatId, onSuccess) => {
    try {
      await api.delete(`/chat/action?chatId=${chatId}`);
      set({ chatList: get().chatList.filter(chat => chat._id !== chatId) });
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      set({ chatList: get().chatList });
      console.error("Failed to delete chat", err);
    }
  },

  removeChatFromList: (pdfId) => set((state) => {
    const filteredChats = state.chatList.filter(chats => chats.pdfId._id !== pdfId);
    return { chatList: filteredChats };
  })
}));