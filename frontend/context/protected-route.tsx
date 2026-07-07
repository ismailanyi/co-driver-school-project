import { router, useSegments } from "expo-router";
import { useEffect } from "react";

import { useCourse } from "@/store/useCourseStore";

interface Props {
  children: React.ReactNode;
}

export function ProtectedRouteProvider({ children }: Props) {
  const segments = useSegments();
  const { courseId } = useCourse();

  const inCourseGroup = segments[0] === "(course)";
  const inLessonGroup = segments[0] === "(lesson)";

  useEffect(() => {
    if (!courseId && (inCourseGroup || inLessonGroup)) {
      router.replace("/register");
    } else if (courseId && !(inCourseGroup || inLessonGroup)) {
      router.replace("/learn");
    }
    console.log("run case of: segments");
  }, [segments]);

  return <>{children}</>;
}
