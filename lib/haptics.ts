import { useSettingsStore } from "@/store/useSettingsStore";

export function vibrate(duration: number = 60): void {
  const { haptics } = useSettingsStore.getState();

  if (haptics && typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate?.(duration);
  }
}
