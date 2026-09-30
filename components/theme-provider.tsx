"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "loop-workspace-theme";
const themeListeners = new Set<() => void>();

function getThemeSnapshot(): Theme {
  return window.localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

function subscribeToTheme(listener: () => void) {
  themeListeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) listener();
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    themeListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  function setTheme(nextTheme: Theme) {
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    themeListeners.forEach((listener) => listener());
  }

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark")
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
