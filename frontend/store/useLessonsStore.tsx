import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { useCourseStore } from '@/store/useCourseStore'
import { useShallow } from 'zustand/shallow';

import api from "@/lib/api";

export interface Lesson {
    id: number;
    category: string;
    description: string;
    total_questions: number;
}

interface useLessonsStoreProp {
    isLoading: boolean, 
    lessons: Lesson[],
    cache: Record<string, Lesson[]>,
    fetchLessons: () => Promise<void>;
};

export const useLessonsStore = create<useLessonsStoreProp>()(
    devtools((set, get) => ({
        isLoading: false,
        lessons: [],
        cache: {},
        fetchLessons: async () => {
            const { courseId } = useCourseStore.getState();
            if (!courseId) return;

            const { cache } = get();
            if (cache[courseId]) {
                // If we already have the exact same array for this course, don't update state to avoid re-renders!
                if (get().lessons !== cache[courseId]) {
                    set({ lessons: cache[courseId] });
                }
                return;
            }

            set({ isLoading: true });
            try {
                const endpoint = courseId === 'rs' ? 'road_signs_lessons' : 'theory_lessons'
                const response = await api.get(`/quiz/${endpoint}`);
                const fetchedLessons = response.data;
                set((state) => ({
                    lessons: fetchedLessons,
                    cache: { ...state.cache, [courseId]: fetchedLessons },
                    isLoading: false
                }));
            } catch (error) {
                console.error("Error failed to get lessons: ", error);
                set({ isLoading: false });
            }
        },
    }))
)

export const useLessons = () => 
    useLessonsStore(
        useShallow((state) => ({
            isLoading: state.isLoading,
            lessons: state.lessons,
            fetchLessons: state.fetchLessons
        }))
    )