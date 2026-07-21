import { sound } from "@/assets/audios/sound";
import LessonOutroScreen from "@/components/exercise/screens/exercise-outro";
import Questions from "@/components/question-section";
import SubmitAnswer from "@/components/submit-answer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { globalStyles } from "@/constants/globalStyles";
import { useTheme } from "@/context/theme";
import { useAudio } from "@/hooks/audio";
import { useQuestions } from "@/store/useQuestionsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Icon } from "@/components/icons";
import { router, useLocalSearchParams } from "expo-router";
import { PropsWithChildren, useEffect } from "react";
import { View, Pressable, Alert, Platform } from "react-native";
import { ArrowLeft } from "lucide-react-native";

type questionTypePorps = PropsWithChildren <{
  question_type: 'sign' | 'theory' | 'mtb';
  renderItem?: (qeustion: any) => React.ReactNode
}>

const QuestionScreen = ({question_type, renderItem}: questionTypePorps) => {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { isCorrect, questions, targetQuestion, isSubmitted, selectedId, setSelectedId, handleSubmit, answeredCount, totalQuestions, correctCount, startTime, endTime } = useQuestions(question_type, category);

  const { playSound: playCorrectSound } = useAudio({ source: sound.correct });
  const { playSound: playWrongSound } = useAudio({ source: sound.wrong });
  const { accent, foreground, mutedForeground } = useTheme();
  const { user } = useAuthStore();

  useEffect(() => {
    if (isSubmitted) {
      if (isCorrect) {
        playCorrectSound();
      } else {
        playWrongSound();
      }
    }
  }, [isSubmitted, isCorrect]);

  // Check if they finished the session (wait until they click "Continue" so they can see the final result first)
  const isFinished = totalQuestions > 0 && answeredCount >= totalQuestions && !isSubmitted;

  if (isFinished) {
    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    let durationString = "0:00";
    let speedText = "Average";

    if (startTime && endTime) {
      const diffInSeconds = Math.floor((endTime - startTime) / 1000);
      const minutes = Math.floor(diffInSeconds / 60);
      const seconds = diffInSeconds % 60;
      durationString = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      
      if (diffInSeconds < 60) {
        speedText = "Speedy";
      } else if (diffInSeconds <= 180) {
        speedText = "Average";
      } else {
        speedText = "Slow";
      }
    }

    return (
      <LessonOutroScreen
        xp={correctCount * 10}
        duration={durationString}
        target={`${scorePercentage}%`}
        speedText={speedText}
        increaseProgress={true}
      />
    );
  }

  if (questions.length === 0 || !targetQuestion) {
    return (
      <ThemedView>
        <ThemedText style={globalStyles.container}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  const progressPercentage = totalQuestions > 0 ? Math.min((answeredCount / totalQuestions) * 100, 100) : 0;

  return (
    <ThemedView style={globalStyles.questionScreenContainer}>
      <View style={{ flexDirection: "row", paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, width: "100%", alignItems: 'center', gap: 15 }}>
        <Pressable onPress={() => {
          if (Platform.OS === 'web') {
             const confirmed = window.confirm("Are you sure you want to end this session? Your progress won't be saved.");
             if (confirmed) {
               router.push('/learn');
             }
          } else {
            Alert.alert(
              "End Session?",
              "Are you sure you want to end this session? Your progress won't be saved.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "End Session", style: "destructive", onPress: () => router.push('/learn') }
              ]
            );
          }
        }}>
          <ArrowLeft color={mutedForeground} size={28} />
        </Pressable>
        <View style={{ flex: 1, height: 16, backgroundColor: accent, borderRadius: 16, position: 'relative' }}>
          <View style={{ position: 'absolute', width: `${progressPercentage}%`, height: '100%', backgroundColor: foreground, borderRadius: 16 }} />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Icon name="heart" />
          <ThemedText style={{ fontWeight: "800", fontSize: 18 }}>
             {user?.hearts ?? 5}
          </ThemedText>
        </View>
      </View>
      <ThemedView style={globalStyles.questionContainer}>
        <ThemedText style={globalStyles.targetText}>{targetQuestion.question}</ThemedText>
        <ThemedView style={question_type === "theory" ? { flexDirection: 'column', gap: 10, width: '100%', backgroundColor: 'transparent' } : globalStyles.grid}>
          {questions.map((question) => {
            const isSelected = selectedId === question.id;
            
            return (
              <Questions
              key={question.id}
              question_type={question_type}
              text={question_type === 'sign' ? undefined : question.question}
              textStyle={question_type === 'sign' ? undefined : globalStyles.theoryOptionText}
              isSelected={isSelected}
              onPress={() => {
                setSelectedId(question.id);
              }}
              >
                {renderItem && renderItem(question)}
              </Questions>
            );
          })}
        </ThemedView>
      </ThemedView>
      <SubmitAnswer
        selectedId={selectedId}
        isCorrect={isCorrect}
        isSubmitted={isSubmitted}
        onPress={() => {
          if (isSubmitted && !isCorrect && user?.hearts === 0) {
             Alert.alert("Out of Hearts", "You ran out of hearts! Take a break and try again later.", [
                { text: "OK", onPress: () => router.push('/learn') }
             ]);
             return;
          }
          handleSubmit();
        }}
        correctAnswer={question_type === "theory" ? targetQuestion.correct_ans?.[0] : targetQuestion.question}
      />
    </ThemedView>
  );
};

export default QuestionScreen;
