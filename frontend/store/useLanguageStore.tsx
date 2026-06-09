import { validLanguages } from "@/config/language";
import { DEFAULT_LANGUAGE_CODE } from "@/constants/default";
import { LANGUAGE_ID_STORAGE_KEY } from "@/constants/storage-key";
import { getLocalData, setLocalData } from "@/lib/local-storage";
import { SupportedLessonCode } from "@/types";
import { create } from "zustand";
import { useShallow } from "zustand/shallow";

interface LanguageState {
  CourseCode: SupportedLessonCode;
  isInitialized: boolean;
  setLanguageCode: (code: SupportedLessonCode) => Promise<void>;
  initializeLanguage: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  CourseCode: DEFAULT_LANGUAGE_CODE,
  isInitialized: false,

  setLanguageCode: async (code) => {
    try {
      await setLocalData(LANGUAGE_ID_STORAGE_KEY, code);
      set({ CourseCode: code });
    } catch (error) {
      console.error("Error saving language:", error);
    }
  },

  initializeLanguage: async () => {
    try {
      const languageKey = await getLocalData(LANGUAGE_ID_STORAGE_KEY);

      if (languageKey && validLanguages.includes(languageKey as SupportedLessonCode)) {
        set({ CourseCode: languageKey as SupportedLessonCode, isInitialized: true });
      } else {
        set({ CourseCode: DEFAULT_LANGUAGE_CODE, isInitialized: true });
        await setLocalData(LANGUAGE_ID_STORAGE_KEY, DEFAULT_LANGUAGE_CODE);
      }
    } catch (error) {
      console.error("Error fetching language:", error);
      set({ isInitialized: true }); // Prevent app stalling on failure
    }
  },
}));


export const useCourseCode = () => {
  return useLanguageStore(
    useShallow((state) => ({
        CourseCode: state.CourseCode,
        setLanguageCode: state.setLanguageCode,
        initializeLanguage: state.initializeLanguage,
        isInitialized: state.isInitialized
    }))
  )
};