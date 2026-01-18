"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export function ToasterProvider() {
  const { theme } = useTheme();
  return (
    <Toaster 
      position="top-center"
      swipeDirections={["left", "right", "top"]}
      duration={5000}
      theme={theme as "light" | "dark" | "system" | undefined}
    />
  );
}