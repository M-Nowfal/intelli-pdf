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
      closeButton
      toastOptions={{
        classNames: {
          closeButton: "!left-auto !right-0 !top-0 !transform-none translate-x-1/4 -translate-y-1/4 bg-background border border-border hover:bg-muted",
        },
      }}
    />
  );
}