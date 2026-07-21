import { router } from "expo-router";
import React, { useMemo, useState } from "react";

import { sound } from "@/assets/audios/sound";
import { Container } from "@/components/container";
import ExerciseItems from "@/components/exercise/items/exercise-items";
import LessonOutroScreen from "@/components/exercise/screens/exercise-outro";
import { Icon } from "@/components/icons";
import { SelectLanguage } from "@/components/select-language";
import { Shell } from "@/components/shell";
import { Text, View } from "@/components/themed";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { layouts } from "@/constants/layouts";
import { useBreakpoint } from "@/context/breakpoints";
import { useTheme } from "@/context/theme";
import { useAudio } from "@/hooks/audio";
import { calculatePrecentage, shuffleArray } from "@/lib/utils";
import { useCourse } from "@/store/useCourseStore";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { ExerciseSet } from "@/types/course";

interface Props {
  exercise: ExerciseSet;
  increaseProgress: boolean;
}

export default function ExerciseScreen({ exercise, increaseProgress }: Props) {
  const shuffledExerciseItems = useMemo(
    () => shuffleArray(exercise.items),
    [exercise.items]
  );
  const totalExerciseItems = shuffledExerciseItems.length;

  const { courseId, courseProgress, setCourseProgress } = useCourse();
  const { user, setUser } = useAuthStore();
  const { accent, foreground, mutedForeground, sucessForeground } = useTheme();
  const breakpoint = useBreakpoint();

  const { playSound: playCorrectSound } = useAudio({ source: sound.correct });
  const { playSound: playWrongSound } = useAudio({ source: sound.wrong });

  const [currentIndex, setCurrentIndex] = useState(courseProgress.currentQuestionIndex || 0);
  const [finishedCount, setFinishedCount] = useState(courseProgress.currentQuestionIndex || 0);
  const [isFinished, setIsFinished] = useState(false);
  const [attempts, setAttempts] = useState<{question_id: number, is_correct: boolean, time_taken_seconds: number}[]>([]);
  
  const questionStartTimeRef = React.useRef(Date.now());

  // Set time when current index changes
  React.useEffect(() => {
    questionStartTimeRef.current = Date.now();
  }, [currentIndex]);

  const onResult = async (success: boolean) => {
    if (finishedCount < totalExerciseItems) {
      setFinishedCount(finishedCount + 1);
      
      const timeTaken = Math.floor((Date.now() - questionStartTimeRef.current) / 1000);
      const currentItem = shuffledExerciseItems[currentIndex];
      setAttempts(prev => [...prev, { question_id: currentItem.id, is_correct: success, time_taken_seconds: timeTaken }]);

      if (success) {
        playCorrectSound();
      } else {
        playWrongSound();
        if (user && user.role === 'student') {
           try {
             const res = await api.post('/quiz/deduct-heart');
             const currentUser = useAuthStore.getState().user;
             if (currentUser && res.data.hearts != null) {
               setUser({ ...currentUser, hearts: res.data.hearts });
             }
           } catch (e) {
             console.error("Failed to deduct heart", e);
           }
        }
      }
    }
  };

  const onContinue = () => {
    const currentHearts = useAuthStore.getState().user?.hearts ?? 5;
    
    if (currentHearts <= 0) {
       // Abort lesson if out of hearts, save mid lesson state
       setCourseProgress({ ...courseProgress, currentQuestionIndex: currentIndex });
       setIsFinished(true);
       return;
    }

    if (currentIndex < totalExerciseItems - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Finished lesson completely
      setCourseProgress({ ...courseProgress, currentQuestionIndex: undefined });
      setIsFinished(true);
    }
  };

  if (!courseId) return null;

  if (isFinished) {
    return (
      <LessonOutroScreen
        xp={exercise.xp}
        duration="2:30"
        target="80%"
        increaseProgress={increaseProgress}
        attempts={attempts}
      />
    );
  }

  return (
    <Shell>
      <Container style={{ gap: layouts.padding * 2 }}>
        <View
          style={{
            flexDirection: "row",
            gap: layouts.padding * 2,
            paddingHorizontal: layouts.padding,
            paddingTop:
              breakpoint === "sm" ? layouts.padding : layouts.padding * 2,
          }}
        >
          <Dialog
            trigger={<Icon name="setting" />}
            title="Settings"
            contentContainerStyle={{ gap: layouts.padding }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: mutedForeground,
                  textTransform: "uppercase",
                }}
              >
                Language:
              </Text>
              <SelectLanguage excludes={[courseId]} />
            </View>
            <Button variant="outline" onPress={() => router.push("/learn")}>
              End Session
            </Button>
          </Dialog>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <View
              style={{
                height: 16,
                backgroundColor: accent,
                borderRadius: 16,
                position: "relative",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  width: `${calculatePrecentage(
                    finishedCount,
                    totalExerciseItems
                  )}%`,
                  height: "100%",
                  backgroundColor: sucessForeground,
                  borderRadius: 16,
                }}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: layouts.padding * 0.5,
            }}
          >
            <Icon name="heart" color="#ff4b4b" />
            <Text style={{ fontWeight: "800", color: "#ff4b4b" }}>{user?.hearts ?? 5}</Text>
          </View>
        </View>
        <ExerciseItems
          exerciseItem={shuffledExerciseItems[currentIndex]}
          onContinue={onContinue}
          onResult={onResult}
        />
      </Container>
    </Shell>
  );
}
