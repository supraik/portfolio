"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Mode = "engineer" | "recruiter";
type Theme = "dark" | "light" | "system";

interface ModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("engineer");
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedMode = localStorage.getItem("portfolio_mode") as Mode | null;
      if (savedMode === "engineer" || savedMode === "recruiter") {
        setModeState(savedMode);
      }
      const savedTheme = localStorage.getItem("portfolio_theme") as Theme | null;
      if (savedTheme === "dark" || savedTheme === "light" || savedTheme === "system") {
        setThemeState(savedTheme);
      }
    } catch {
      // LocalStorage access restricted (e.g. incognito/sandboxed)
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }
    }
  }, [theme, mounted]);

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    try {
      localStorage.setItem("portfolio_mode", newMode);
    } catch {}
  };

  const toggleMode = () => {
    setMode(mode === "engineer" ? "recruiter" : "engineer");
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("portfolio_theme", newTheme);
    } catch {}
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode, theme, setTheme, toggleTheme }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used within ModeProvider");
  return ctx;
}
