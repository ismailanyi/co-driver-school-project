import React from "react";
import { router } from "expo-router";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Container } from "@/components/container";
import { Icon } from "@/components/icons";
import { Shell } from "@/components/shell";
import { Text, View } from "@/components/themed";
import { ThemedButton } from "@/components/themed-button";
import { layouts } from "@/constants/layouts";
import { nextProgress } from "@/content/courses/data";
import { useBreakpoint } from "@/context/breakpoints";
import { useTheme } from "@/context/theme";
import { useCourse } from "@/store/useCourseStore";
import { useLessons } from '@/store/useLessonsStore';
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { IconName } from "@/types";

interface Props {
  xp: number;
  duration: string;
  target: string;
  increaseProgress: boolean;
  speedText?: string;
  attempts?: any[];
}

export default function LessonOutrolayout(props: Props) {
  const { foreground, background } = useTheme();
  const breakpoint = useBreakpoint();
  const layout = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { courseProgress, setCourseProgress, courseId } = useCourse();
  const { lessons } = useLessons();
  const { user, setUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = React.useState(true);

  React.useEffect(() => {
    async function submitResults() {
      try {
        const correctCount = props.attempts?.filter(a => a.is_correct).length || 0;
        const totalQuestions = props.attempts?.length || 0;
        
        // Sum the time_taken_seconds
        const timeSeconds = props.attempts?.reduce((acc, curr) => acc + curr.time_taken_seconds, 0) || 0;

        const res = await api.post('/quiz/results', {
          quiz_type: courseId || 'theory',
          category: 'lesson',
          correct_count: correctCount,
          total_questions: totalQuestions,
          time_seconds: timeSeconds,
          attempts: props.attempts || []
        });

        // Update the user's XP and streak locally
        if (user) {
          setUser({ ...user, total_xp: res.data.total_xp, streak_count: res.data.streak_count });
        }
      } catch (e) {
        console.error("Failed to submit results", e);
      } finally {
        setIsSubmitting(false);
      }
    }
    
    submitResults();
  }, []);

  const exerciseResults: {
    icon: IconName;
    type: keyof Pick<Props, "xp" | "duration" | "target">;
    title: string;
  }[] = [
    {
      icon: "bolt",
      type: "xp",
      title: "Total xp",
    },
    {
      icon: "clockCircle",
      type: "duration",
      title: props.speedText || "Speedy",
    },
    {
      icon: "targetCircle",
      type: "target",
      title: "Good",
    },
  ];

  const onContinue = () => {
    if (props.increaseProgress) {
      const nextCourseProgress = nextProgress(courseProgress, lessons);
      if (nextCourseProgress) {
        setCourseProgress(nextCourseProgress);
      }
    }
    router.push("/learn");
  };

  return (
    <Shell style={{ flex: 1, minHeight: '100%' }}>
      <Container style={{ padding: layouts.padding, paddingBottom: Math.max(insets.bottom + layouts.padding, layouts.padding * 3) }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: layouts.padding * 4,
          }}
        >
          <Text style={{ fontSize: 32, fontWeight: "bold" }}>
            Practice complete!
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: layouts.padding,
              flexWrap: "wrap",
            }}
          >
            {exerciseResults.map((result, index) => (
              <View
                key={index}
                style={{
                  padding: layouts.borderWidth,
                  borderRadius: layouts.padding,
                  backgroundColor: foreground,
                  width:
                    breakpoint === "sm"
                      ? layout.width / exerciseResults.length -
                        layouts.padding *
                          ((exerciseResults.length + 1) /
                            exerciseResults.length)
                      : 128,
                  height: 100,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    textTransform: "uppercase",
                    color: background,
                    fontSize: 12,
                    fontFamily: "Nunito-Black",
                    padding: layouts.padding / 4,
                  }}
                >
                  {result.title}
                </Text>
                <View
                  style={{
                    flex: 1,
                    borderRadius: layouts.padding - layouts.borderWidth,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: layouts.padding / 2,
                      alignItems: "center",
                    }}
                  >
                    <Icon name={result.icon} color={foreground} />
                    <Text
                      style={{
                        color: foreground,
                        fontSize: 18,
                        fontFamily: "Nunito-Black",
                      }}
                    >
                      {props[result.type]}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <ThemedButton
            text="CLAIM XP"
            onPress={onContinue}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={{
              paddingVertical: 15,
              borderRadius: 15,
              width: '100%',
              backgroundColor: '#1cb0f6',
              borderBottomWidth: 4,
              borderBottomColor: '#1899d6',
            }}
            textStyle={{
              fontSize: 16,
              color: 'white',
              letterSpacing: 1,
              fontFamily: 'Nunito-Black',
            }}
          />
        </View>
      </Container>
    </Shell>
  );
}
