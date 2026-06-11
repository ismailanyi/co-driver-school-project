import { CourseDetailsBar } from "@/components/course-details-bar";
import { Icon } from "@/components/icons";
import { MobileTabsBar } from "@/components/layouts/mobile-tabs-bar";
import { LessonItem } from "@/components/lesson-item";
import { Metadata } from "@/components/metadata";
import { Text, View } from "@/components/themed";
import { Button } from "@/components/ui/button";
import { courseConfig } from "@/config/course";
import { layouts } from "@/constants/layouts";
import { useBreakpoint } from "@/context/breakpoints";
import { useTheme } from "@/context/theme";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";

import { useCourse } from '@/store/useCourseStore';
import { useCourseCode } from '@/store/useLanguageStore';

import { useLessons } from '@/store/useLessonsStore';

const CAMP = 16;
const CIRCLE_RADUIS = 48;


const Learn = () => {
  const Lessons = [
    {id: 'theory', Label: 'Theory', description: 'Learn all Theory content', router: '/theory'},
    {id: 'signs', Label: 'Road Signs', description: 'Learn all Road Signs content', router: '/signs'},
/*     {id: 'mtb', Label: 'MTB (Model Town Board)', description: 'Practice the Model Town board', router: '/mtb'} */
  ] as const
  const breakpoint = useBreakpoint();
  const [headerHeight, setHeaderHeight] = useState(0);
  const {
    border: themeborder,
    accent,
    background,
    primary,
    primaryForeground,
    foreground,
    mutedForeground,
    muted,
  } = useTheme();

  const [popoverId, setPopoverId] = useState<string | null>(null)

  const [isVisiable, setIsVisiable] = useState(false);
  const openPopover = () => setIsVisiable(true);
  const closePopover = () => setPopoverId(null);
  
  const { CourseCode: languageCode } = useCourseCode();
  const { courseId, courseProgress } = useCourse();

  let isOdd = true;
  let translateX = 0;
  
  const { lessons, fetchLessons } = useLessons();

  useEffect(()=> {
    fetchLessons()
  }, [courseId])

  const renderCourseChapter = () => (
    <View
      style={{
        gap: layouts.padding * 4,
        paddingHorizontal: breakpoint === "sm" ? 0 : layouts.padding * 2,
      }}
    >
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: breakpoint === "md" ? "flex-start" : "space-between",
            padding: layouts.padding * 2,
            backgroundColor: accent,
            borderRadius: breakpoint === "sm" ? 0 : layouts.padding,
            alignItems: "center",
          },
          breakpoint === "sm" && {
            paddingHorizontal: layouts.padding,
          },
        ]}
      >
        <View
          style={{
            backgroundColor: accent,
            gap: layouts.padding,
            flex: 1,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Co-Driver
          </Text>
          <Text style={{ color: mutedForeground }}>
            Practice the 2 major aspects, the road signs and theory questions
          </Text>
        </View>
        <Button
          variant="ghost"
          viewStyle={{
            padding: layouts.padding * 0.5,
          }}
        >
          <Icon name="notebook" />
        </Button>
      </View>

      <View
        style={{
          gap: layouts.padding * 2,
          alignItems: "center",
        }}
      >
        {lessons.map((lesson, lessonIndex) => {
          if (translateX > CAMP || translateX < -CAMP) {
            isOdd = !isOdd;
          }

          if (lessonIndex !== 0) {
            translateX += isOdd ? CIRCLE_RADUIS : -CIRCLE_RADUIS;
          }

          const isCurrentLesson = courseProgress.lessonId === lessonIndex;
          const isFinishedLesson = ( lessonIndex < courseProgress.lessonId);

          return (
            <LessonItem
              key={lessonIndex}
              index={lessonIndex}
              lesson={lesson}
              circleRadius={CIRCLE_RADUIS}
              isCurrentLesson={isCurrentLesson}
              isFinishedLesson={isFinishedLesson}
              lessonDescription={lesson.description}
              style={{ transform: [{ translateX }] }}
              courseProgression={{
                ...courseProgress,
                lessonId: lessonIndex,
                exerciseId: isCurrentLesson ? courseProgress.exerciseId : 0,
              }}
            />
          );
        })}
      </View>
  </View>
  )


  return (
    <>
      <Metadata
        title="Learn"
        description="Learn a new lesson every day to keep your streak."
      />
      <View style={{ flex: 1, position: "relative" }}>
        <View
          style={{
            borderBottomWidth: layouts.borderWidth,
            borderBottomColor: themeborder,
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            zIndex: 9999,
            gap: layouts.padding * 2,
          }}
          onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
        >
          {(breakpoint === "sm" || breakpoint === "md") && (
            <CourseDetailsBar
              style={{
                paddingTop:
                  breakpoint === "sm" ? layouts.padding : layouts.padding * 3,
                paddingHorizontal:
                  breakpoint === "sm" ? layouts.padding : layouts.padding * 2,
              }}
            />
          )}
          <View
            style={{
              paddingBottom: layouts.padding,
              paddingTop:
                breakpoint === "sm"
                  ? 0
                  : breakpoint === "md"
                  ? layouts.padding * 2
                  : layouts.padding * 3,
            }}
          >
            <Text>
              
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: mutedForeground,
                textAlign: "center",
              }}
            >
              Co-Driver
            </Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingTop:
              breakpoint === "sm"
                ? headerHeight
                : headerHeight + layouts.padding * 2,
            paddingBottom: layouts.padding * 2,
            gap: layouts.padding * 4,
          }}
          showsVerticalScrollIndicator={false}
        >{
          renderCourseChapter()
        }
        </ScrollView>
      </View>
      {breakpoint === "sm" && (
        <MobileTabsBar navItems={courseConfig.mobileNavItems} />
      )}
    </>
  )
}

export default Learn;