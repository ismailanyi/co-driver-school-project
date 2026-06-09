import { SupportedLessonCode } from "@/types";
import { CourseProgression } from "@/types/course";

export const DEFAULT_COURSE_PROGRESS: CourseProgression = {
  sectionId: 0,
  chapterId: 0,
  lessonId: 0,
  exerciseId: 0,
};

export const DEFAULT_COURSE_ID: SupportedLessonCode = "rs";
export const DEFAULT_LANGUAGE_CODE: SupportedLessonCode = "rs";
