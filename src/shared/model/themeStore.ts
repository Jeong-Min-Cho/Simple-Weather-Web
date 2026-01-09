"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  resolvedTheme: "light" | "dark";
}

interface ThemeActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const resolveTheme = (theme: Theme): "light" | "dark" => {
  return theme === "system" ? getSystemTheme() : theme;
};

const applyThemeToDOM = (resolvedTheme: "light" | "dark") => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(resolvedTheme);
};

export const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    (set, get) => ({
      theme: "system",
      resolvedTheme: "light",

      setTheme: (theme) => {
        const resolved = resolveTheme(theme);
        applyThemeToDOM(resolved);
        set({ theme, resolvedTheme: resolved });
      },

      toggleTheme: () => {
        const current = get().resolvedTheme;
        const next = current === "light" ? "dark" : "light";
        applyThemeToDOM(next);
        set({ theme: next, resolvedTheme: next });
      },

      initializeTheme: () => {
        const { theme } = get();
        const resolved = resolveTheme(theme);
        applyThemeToDOM(resolved);
        set({ resolvedTheme: resolved });
      },
    }),
    {
      name: "weather-theme",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const resolved = resolveTheme(state.theme);
          state.resolvedTheme = resolved;
          applyThemeToDOM(resolved);
        }
      },
    }
  )
);
