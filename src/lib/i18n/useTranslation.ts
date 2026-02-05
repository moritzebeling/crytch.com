"use client";

import { useState, useEffect, useCallback } from "react";
import en from "./translations/en.json";
import de from "./translations/de.json";
import nl from "./translations/nl.json";

export type Language = "en" | "de" | "nl";

const translations: Record<Language, typeof en> = {
  en,
  de,
  nl,
};

const STORAGE_KEY = "crytch_language";
const DEFAULT_LANGUAGE: Language = "en";
const AVAILABLE_LANGUAGES: Language[] = ["en", "de", "nl"];

/**
 * Get nested value from translation object using dot notation
 */
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // Return path if not found
    }
  }

  return typeof current === "string" ? current : path;
}

/**
 * Detect browser language
 */
function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  const browserLang = navigator.language.substring(0, 2).toLowerCase();
  if (AVAILABLE_LANGUAGES.includes(browserLang as Language)) {
    return browserLang as Language;
  }
  return DEFAULT_LANGUAGE;
}

/**
 * Hook for internationalization
 */
export function useTranslation() {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize language from storage or browser
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored && AVAILABLE_LANGUAGES.includes(stored)) {
      setLanguageState(stored);
    } else {
      const detected = detectBrowserLanguage();
      setLanguageState(detected);
    }
    setIsInitialized(true);
  }, []);

  // Update storage when language changes
  const setLanguage = useCallback((newLanguage: Language) => {
    if (AVAILABLE_LANGUAGES.includes(newLanguage)) {
      setLanguageState(newLanguage);
      localStorage.setItem(STORAGE_KEY, newLanguage);
    }
  }, []);

  // Translation function
  const t = useCallback(
    (key: string): string => {
      return getNestedValue(translations[language] as unknown as Record<string, unknown>, key);
    },
    [language]
  );

  return {
    language,
    setLanguage,
    t,
    isInitialized,
    availableLanguages: AVAILABLE_LANGUAGES,
  };
}

/**
 * Get translation for SSR/static content
 */
export function getTranslation(language: Language, key: string): string {
  return getNestedValue(translations[language] as unknown as Record<string, unknown>, key);
}
