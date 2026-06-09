import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { useCourseStore } from '@/store/useCourseStore'
import { useShallow } from 'zustand/shallow';

import axios from "axios";

interface useLessonsStoreProp {
    isLoading: boolean, 
    lessons: any[],
    fetchLessons: () => Promise<void>;
};

export const useLessonsStore = create<useLessonsStoreProp>()(
    devtools((set) => ({
        isLoading: false,
        lessons: [],
        fetchLessons: async () => {
            const { courseId } = useCourseStore.getState();
            try {
                const api = axios.create({
                    baseURL: process.env.EXPO_PUBLIC_API_URL,
                });
                const endpoint = courseId === 'rs' ? 'road_signs_lessons' : 'theory_lessons'
                const response = await api.get(`/quiz/${endpoint}`);
                const fetchedLessons = response.data;
                set({lessons: fetchedLessons});
            } catch (error) {
                console.error("Error failed to get lessons: ", error);
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