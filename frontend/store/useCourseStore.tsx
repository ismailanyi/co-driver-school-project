import { validLanguages } from "@/config/language";
import { DEFAULT_COURSE_PROGRESS } from "@/constants/default";
import {
  COURSE_PROGRESS_STORAGE_KEY,
  CURRENT_COURSE_ID_STORAGE_KEY,
} from "@/constants/storage-key";
import { getLocalData, setLocalData } from "@/lib/local-storage";
import { SupportedLessonCode } from "@/types";
import { CourseProgression } from "@/types/course";
import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

// --- Validation Helpers (Internal Store Utilities) ---
const isValidCourseProgress = (parsed: any): parsed is CourseProgression => {
  return !!(
    parsed &&
    typeof parsed === "object" &&
    "sectionId" in parsed &&
    "chapterId" in parsed &&
    "lessonId" in parsed &&
    "exerciseId" in parsed &&
    typeof parsed.sectionId === "number" &&
    typeof parsed.chapterId === "number" &&
    typeof parsed.lessonId === "number" &&
    typeof parsed.exerciseId === "number"
  );
};

const isValidCourseProgressIds = (progress: CourseProgression) => {
  return true;
};

// --- Store Interfaces ---
interface CourseState {
  courseId: SupportedLessonCode | null;
  courseProgress: CourseProgression;
  isInitialized: boolean;
  
  // Actions
  setCourseId: (id: SupportedLessonCode | null) => Promise<void>;
  setCourseProgress: (progress: CourseProgression) => Promise<void>;
  initializeCourse: () => Promise<void>;
  handleCourseProgress: (courseId: SupportedLessonCode) => Promise<void>;
}

// --- Zustand Store ---
export const useCourseStore = create<CourseState>((set, get) => ({
  courseId: null,
  courseProgress: DEFAULT_COURSE_PROGRESS,
  isInitialized: false,

  setCourseId: async (id) => {
    const { isInitialized } = get();
    set({ courseId: id });

    if (isInitialized && id !== null) {
      try {
        await setLocalData(CURRENT_COURSE_ID_STORAGE_KEY, id);
        // Sync course progress tracking for the newly selected course
        await get().handleCourseProgress(id);
      } catch (error) {
        console.error("Error setting course ID:", error);
      }
    }
  },

  setCourseProgress: async (progress) => {
    const { courseId, isInitialized } = get();
    set({ courseProgress: progress });

    if (isInitialized && courseId !== null) {
      try {
        const user = useAuthStore.getState().user;
        if (user) {
          await api.patch('/auth/progress', { course_progress: progress });
          useAuthStore.getState().setUser({ ...user, course_progress: progress } as any);
        } else {
          const courseProgressKey = COURSE_PROGRESS_STORAGE_KEY(courseId);
          await setLocalData(courseProgressKey, JSON.stringify(progress));
        }
      } catch (error) {
        console.error("Error saving course progress:", error);
      }
    }
  },

  handleCourseProgress: async (courseId: SupportedLessonCode) => {
    const courseProgressKey = COURSE_PROGRESS_STORAGE_KEY(courseId);
    
    try {
      const user = useAuthStore.getState().user;
      if (user && user.course_progress) {
         if (isValidCourseProgress(user.course_progress) && isValidCourseProgressIds(user.course_progress)) {
            set({ courseProgress: user.course_progress });
            return;
         }
      }

      const storedCourseProgress = await getLocalData(courseProgressKey);

      if (storedCourseProgress) {
        const parsedCourseProgress = JSON.parse(storedCourseProgress);
        
        if (isValidCourseProgress(parsedCourseProgress) && isValidCourseProgressIds(parsedCourseProgress)) {
          set({ courseProgress: parsedCourseProgress });
          return;
        }
      }
      
      // Fallback if missing or invalid
      set({ courseProgress: DEFAULT_COURSE_PROGRESS });
      await setLocalData(courseProgressKey, JSON.stringify(DEFAULT_COURSE_PROGRESS));
    } catch (error) {
      console.error("Error parsing stored course progress data:", error);
      set({ courseProgress: DEFAULT_COURSE_PROGRESS });
    }
  },

  initializeCourse: async () => {
    try {
      const storedCourseId = await getLocalData(CURRENT_COURSE_ID_STORAGE_KEY);

      if (storedCourseId && validLanguages.includes(storedCourseId as SupportedLessonCode)) {
        const targetCourseId = storedCourseId as SupportedLessonCode;
        set({ courseId: targetCourseId });
        await get().handleCourseProgress(targetCourseId);
      } else {
        const targetCourseId = validLanguages[0];
        set({ courseId: targetCourseId });
        await get().handleCourseProgress(targetCourseId);
      }
    } catch (error) {
      console.error("Error fetching course ID:", error);
      set({ courseId: validLanguages[0] });
    } finally {
      set({ isInitialized: true });
    }
  },
}));

// --- Exported Custom Hook ---
export const useCourse = () => {
  return useCourseStore(
    useShallow((state) => ({
      courseId: state.courseId,
      setCourseId: state.setCourseId,
      courseProgress: state.courseProgress,
      setCourseProgress: state.setCourseProgress,
      initializeCourse: state.initializeCourse,
      isInitialized: state.isInitialized
      
    }))
  );
};
