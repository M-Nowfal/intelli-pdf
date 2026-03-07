import { create } from "zustand";
import api from "@/lib/axios";
import { toast } from "sonner";
import { ChatItem, Message } from "@/types/chat";
import { sortChatList } from "@/helpers/chat.helper";

interface ChatState {
  chatList: ChatItem[];
  messages: Message[];
  chatId: string;

  isLoading: boolean;
  isPinLoading: boolean;
  isMessagesLoading: boolean;
  isStreaming: boolean;
  isPinned: boolean;
  isStrict: boolean;

  setMessages: (messages: Message[]) => void;
  setStreaming: (status: boolean) => void;
  setChatId: (id: string) => void;

  togglePin: () => void;
  setPinnedChat: (val: boolean) => void;

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
  isPinLoading: false,
  isMessagesLoading: false,
  isStreaming: false,
  isPinned: false,
  isStrict: true,

  setMessages: (messages) => set({ messages }),
  setStreaming: (status) => set({ isStreaming: status }),
  setChatId: (id) => set({ chatId: id }),

  togglePin: async () => {
    try {
      set({ isPinLoading: true });
      const { chatId, isPinned, chatList } = get();
      const res = await api.patch("/chat/action", { chatId });
      if (res.data.success) {
        set({
          isPinned: !isPinned,
          chatList: sortChatList(chatList.map(list => list._id === chatId ? { ...list, isPinned: !isPinned } : list))
        });
        toast.success(`Chat ${isPinned ? "unpinned" : "pinned"}.`);
      }
    } catch (err: unknown) {
      toast.warning("Failed to pin chat");
      console.error(err);
    } finally {
      set({ isPinLoading: false });
    }
  },
  setPinnedChat: (pin) => set({ isPinned: pin }),

  setIsStrict: (isStrict) => set({ isStrict }),

  fetchChatList: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get("/chat/list");
      set({ chatList: sortChatList(res.data as ChatItem[]) });
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

    return { chatList: sortChatList([chat, ...state.chatList]) };
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