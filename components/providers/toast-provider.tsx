"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";

export function ToastProvider() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      theme={theme as "light" | "dark" | "system"}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        className: "glass-card border text-foreground rounded-2xl shadow-2xl text-xs font-semibold p-4 backdrop-blur-xl",
      }}
    />
  );
}
