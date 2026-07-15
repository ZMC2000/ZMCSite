"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import arabicUi from "../data/ar/ui.json";

export type Language = "en" | "ar";

type LanguageContextValue = {
  language: Language;
  isArabic: boolean;
  setLanguage: (language: Language) => void;
  t: (value: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function createUiTranslations(value: unknown, entries: Record<string, string>) {
  if (!value || typeof value !== "object") return entries;

  if (
    "en" in value &&
    "ar" in value &&
    typeof value.en === "string" &&
    typeof value.ar === "string"
  ) {
    entries[value.en] = value.ar;
    return entries;
  }

  Object.values(value).forEach((child) => createUiTranslations(child, entries));
  return entries;
}

const uiTranslations = createUiTranslations(arabicUi, {});

function translateString(value: string, language: Language) {
  return language === "ar" ? (uiTranslations[value] ?? value) : value;
}

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: React.ReactNode;
  initialLanguage: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  function setLanguage(nextLanguage: Language) {
    document.cookie = `zmc-language=${nextLanguage}; path=/; max-age=31536000; samesite=lax`;
    setLanguageState(nextLanguage);
  }

  useEffect(() => {
    const documentLanguage = isAdmin ? "en" : language;
    document.documentElement.lang = documentLanguage;
    document.documentElement.dir = documentLanguage === "ar" ? "rtl" : "ltr";
  }, [isAdmin, language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      isArabic: language === "ar",
      setLanguage,
      t: (text) => translateString(text, language),
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }

  return context;
}

export function useLocalizedData<T>(data: T, arabicData: T): T {
  const { language } = useLanguage();

  return useMemo(
    () => (language === "ar" ? arabicData : data),
    [arabicData, data, language],
  );
}
