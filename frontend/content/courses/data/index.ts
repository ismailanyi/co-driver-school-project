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
  const { lessonId, exerciseId = 0 } = current;
  const currentLesson = lessons[lessonId];
  
  if (!currentLesson) return null;

  const totalSegments = Math.max(1, Math.ceil((currentLesson.total_questions || 1) / 10));

  if (exerciseId < totalSegments - 1) {
    return { ...current, exerciseId: exerciseId + 1 };
  } else if (lessonId < lessons.length - 1) {
    return { ...current, lessonId: lessonId + 1, exerciseId: 0 };
  }

  return {
    ...current,
    lessonId: 0,
    exerciseId: 0,
  };
}