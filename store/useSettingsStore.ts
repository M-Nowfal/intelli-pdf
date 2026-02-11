import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";
import { toast } from "sonner";

interface SettingsStore {
  haptics: boolean;
  mobileNav: boolean;
  isKeyboardActive: boolean;
  isMobile: () => boolean;

  setHaptics: (value: boolean) => void;
  setMobileNav: (value: boolean) => void;
  setIsKeyboardActive: (value: boolean) => void;
  deleteAccount: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      haptics: true,
      mobileNav: false,
      isKeyboardActive: false,

      isMobile: () => {
        if (typeof navigator === "undefined") return false;

        const ua = navigator.userAgent.toLowerCase();

        return /android|iphone|ipad|ipod|mobile/i.test(ua);
      },

      setHaptics: (value: boolean) => set({ haptics: value }),
      setMobileNav: (value: boolean) => set({ mobileNav: value }),
      setIsKeyboardActive: (value: boolean) => set({ isKeyboardActive: value }),

      deleteAccount: async () => {
        try {
          await api.delete("/auth/delete");
          toast.success("Account deleted successfully");
        } catch (err: unknown) {
          console.error(err);
          toast.error("Failed to delete account");
        }
      },
    }),
    {
      name: 'user-settings',
      partialize: (state) => ({
        haptics: state.haptics,
        mobileNav: state.mobileNav
      }),
    }
  )
);