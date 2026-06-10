import { Course, CourseProgression, ExerciseSet } from "@/types/course";
import { useLessons } from '@/store/useLessonsStore'
import { characters } from "./characters";

export const courseContent: Course = {
  characters: characters,
};

export function nextProgress(
  current: CourseProgression,
  lessons: any[]
): CourseProgression | null {
  const { lessonId } = current;

  if (lessonId < lessons.length - 1) {
    return { ...current, lessonId: lessonId + 1 };
  } return {
    ...current,
    lessonId: 0,
  };
}