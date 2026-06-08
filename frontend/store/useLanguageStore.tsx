import { validLanguages } from "@/config/language";
import { DEFAULT_LANGUAGE_CODE } from "@/constants/default";
import { LANGUAGE_ID_STORAGE_KEY } from "@/constants/storage-key";
import { getLocalData, setLocalData } from "@/lib/local-storage";
import { SupportedLanguageCode } from "@/types";
import { create } from "zustand";
import { useShallow } from "zustand/shallow";

interface LanguageState {
  languageCode: SupportedLanguageCode;
  isInitialized: boolean;
  setLanguageCode: (code: SupportedLanguageCode) => Promise<void>;
  initializeLanguage: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  languageCode: DEFAULT_LANGUAGE_CODE,
  isInitialized: false,

  setLanguageCode: async (code) => {
    try {
      await setLocalData(LANGUAGE_ID_STORAGE_KEY, code);
      set({ languageCode: code });
    } catch (error) {
      console.error("Error saving language:", error);
    }
  },

  initializeLanguage: async () => {
    try {
      const languageKey = await getLocalData(LANGUAGE_ID_STORAGE_KEY);

      if (languageKey && validLanguages.includes(languageKey as SupportedLanguageCode)) {
        set({ languageCode: languageKey as SupportedLanguageCode, isInitialized: true });
      } else {
        set({ languageCode: DEFAULT_LANGUAGE_CODE, isInitialized: true });
        await setLocalData(LANGUAGE_ID_STORAGE_KEY, DEFAULT_LANGUAGE_CODE);
      }
    } catch (error) {
      console.error("Error fetching language:", error);
      set({ isInitialized: true }); // Prevent app stalling on failure
    }
  },
}));


export const useLanguageCode = () => {
  return useLanguageStore(
    useShallow((state) => ({
        languageCode: state.languageCode,
        setLanguageCode: state.setLanguageCode,
        initializeLanguage: state.initializeLanguage,
        isInitialized: state.isInitialized
    }))
  )
};