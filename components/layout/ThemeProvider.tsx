"use client";

import * as React from "react";
import { useDarkMode } from "@/lib/hooks";

interface Ctx {
  dark: boolean;
  toggle: () => void;
}

const ThemeContext = React.createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { dark, setDark } = useDarkMode();
  const toggle = React.useCallback(() => setDark((d) => !d), [setDark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx)
    return {
      dark: false,
      toggle: () => undefined,
    } as Ctx;
  return ctx;
}
