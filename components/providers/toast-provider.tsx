"use client";

import { Toaster as SonnerToaster } from "sonner";

export function ToastProvider() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(229, 231, 235, 0.8)",
          color: "hsl(var(--foreground))",
          borderRadius: "1rem",
        },
      }}
    />
  );
}
