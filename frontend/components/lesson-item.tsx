import { Icon } from "@/components/icons";
import { Text, View } from "@/components/themed";
import { Button } from "@/components/ui/button";
import { layouts } from "@/constants/layouts";
import { useTheme } from "@/context/theme";
import { useCourse } from "@/store/useCourseStore";
import { CourseProgression } from "@/types/course";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, PressableProps } from "react-native";
import Popover from "react-native-popover-view/dist/Popover";
import Svg, { Path } from "react-native-svg";

const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: cx + (r * Math.cos(angleInRadians)),
    y: cy + (r * Math.sin(angleInRadians))
  };
};

const calculateArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y,
    "A", r, r, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
};

interface Props extends PressableProps {
  circleRadius: number;
  isCurrentLesson: boolean;
  lesson: any;
  isFinishedLesson: boolean;
  index: number;
  lessonDescription: string;
  courseProgression: CourseProgression;
}

export function LessonItem({
  isCurrentLesson,
  isFinishedLesson,
  lesson,
  circleRadius,
  index,
  lessonDescription,
  courseProgression,
  ...props
}: Props) {
  const {
    border,
    background,
    primary,
    primaryForeground,
    foreground,
    mutedForeground,
    muted,
  } = useTheme();
  const { courseId } = useCourse();
  const isNotFinishedLesson = !isFinishedLesson && !isCurrentLesson;
  const [isVisiable, setIsVisiable] = useState(false);
  const openPopover = () => setIsVisiable(true);
  const closePopover = () => setIsVisiable(false);

  const {
    lessonId: lessonId,
    exerciseId: exerciseId,
  } = courseProgression;

  const totalSegments = Math.max(1, Math.ceil((lesson.total_questions || 1) / 10));
  let completedSegments = 0;
  if (isFinishedLesson) {
    completedSegments = totalSegments;
  } else if (isCurrentLesson) {
    completedSegments = exerciseId || 0;
  }

  const svgSize = circleRadius * 2 + 24;
  const strokeWidth = 8;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const radius = svgSize / 2 - strokeWidth / 2;
  const gapAngle = totalSegments > 1 ? 16 : 0;
  const segmentAngle = totalSegments > 0 ? (360 / totalSegments) - gapAngle : 0;

  return (
    <Popover
      isVisible={isVisiable}
      onRequestClose={closePopover}
      popoverStyle={{
        borderRadius: layouts.padding,
        backgroundColor: border,
      }}
      backgroundStyle={{
        backgroundColor: background,
        opacity: 0.5,
      }}
      from={
        <Pressable onPress={openPopover} {...props}>
          <View
            style={{
              width: svgSize,
              height: svgSize,
              justifyContent: "center",
              alignItems: "center",
              position: "relative"
            }}
          >
            <Svg 
               style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
               width={svgSize}
               height={svgSize}
            >
              {Array.from({ length: totalSegments }).map((_, i) => {
                const isCompleted = i < completedSegments;
                const startAngle = i * (segmentAngle + gapAngle);
                let endAngle = startAngle + segmentAngle;
                if (totalSegments === 1) endAngle = 359.9;
                return (
                  <Path
                    key={i}
                    d={calculateArc(cx, cy, radius, startAngle, endAngle)}
                    stroke={isCompleted ? primary : muted}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                  />
                );
              })}
            </Svg>
            <View
              style={{
                width: circleRadius * 2,
                aspectRatio: 1,
                borderRadius: 9999,
                backgroundColor:
                  isCurrentLesson || isFinishedLesson || index === 0
                    ? primary
                    : mutedForeground,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isCurrentLesson ? (
                <Icon name="star" size={32} color={primaryForeground} />
              ) : isFinishedLesson ? (
                <Icon name="check" size={32} color={primaryForeground} />
              ) : index === 0 ? (
                <Icon name="skip" size={32} color={primaryForeground} />
              ) : (
                <Icon name="lock" size={32} color={muted} />
              )}
            </View>
          </View>
        </Pressable>
      }
    >
      <View
        style={{
          padding: layouts.padding,
          borderRadius: layouts.padding,
          width: 300,
          borderWidth: layouts.borderWidth,
          borderColor: border,
          gap: layouts.padding,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: layouts.padding,
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: isNotFinishedLesson ? mutedForeground : foreground,
            }}
          >
            {lessonDescription}
          </Text>
          {isCurrentLesson && (
            <View
              style={{
                paddingVertical: layouts.padding / 2,
                paddingHorizontal: layouts.padding,
                borderRadius: layouts.padding / 2,
                backgroundColor: muted,
              }}
            >
              <Text
                style={{
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  color: mutedForeground,
                }}
              >
                Easy
              </Text>
            </View>
          )}
        </View>
        <Text style={{ color: mutedForeground }}>
          {isFinishedLesson
            ? "Prove your proficiency with Legendary"
            : isNotFinishedLesson
              ? "Complete all levels above to unlock this!"
              : `Exercise`}
        </Text>
        <Button
          disabled={isNotFinishedLesson}
          onPress={() => {
            closePopover();
            if (lesson.router) {
              router.push(lesson.router as any);
            } else {
              router.push({
                pathname: courseId === "rs" ? "/signs" : "/theory",
                params: { category: lessonDescription }
              } as any);
            }
          }}
        >
            Start
        </Button>
      </View>
    </Popover>
  );
}
