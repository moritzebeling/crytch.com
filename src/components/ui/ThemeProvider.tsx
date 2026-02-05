"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { isDarkBackground, getGreyForTheme } from "@/lib/drawing";

interface ThemeContextType {
  background: string;
  color: string;
  strokeWidth: number;
  isDark: boolean;
  grey: string;
  setBackground: (color: string) => void;
  setColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultBackground?: string;
  defaultColor?: string;
  defaultStrokeWidth?: number;
}

export function ThemeProvider({
  children,
  defaultBackground = "#ffffff",
  defaultColor = "#000000",
  defaultStrokeWidth = 2,
}: ThemeProviderProps) {
  const [background, setBackgroundState] = useState(defaultBackground);
  const [color, setColorState] = useState(defaultColor);
  const [strokeWidth, setStrokeWidthState] = useState(defaultStrokeWidth);

  const isDark = isDarkBackground(background);
  const grey = getGreyForTheme(isDark);

  const setBackground = useCallback((newColor: string) => {
    setBackgroundState(newColor);
  }, []);

  const setColor = useCallback((newColor: string) => {
    setColorState(newColor);
  }, []);

  const setStrokeWidth = useCallback((width: number) => {
    const clamped = Math.min(Math.max(width, 1), 99);
    setStrokeWidthState(clamped);
  }, []);

  // Apply CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty("--bg-color", background);
    document.documentElement.style.setProperty("--text-color", isDark ? "#ffffff" : "#000000");
    document.documentElement.style.setProperty("--grey-color", grey);
    document.body.style.backgroundColor = background;
    document.body.style.color = isDark ? "#ffffff" : "#000000";
  }, [background, isDark, grey]);

  return (
    <ThemeContext.Provider
      value={{
        background,
        color,
        strokeWidth,
        isDark,
        grey,
        setBackground,
        setColor,
        setStrokeWidth,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
