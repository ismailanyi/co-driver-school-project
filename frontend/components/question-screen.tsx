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
import { useLocalSearchParams } from "expo-router";
import { PropsWithChildren, useEffect } from "react";
import { View } from "react-native";

type questionTypePorps = PropsWithChildren <{
  question_type: 'sign' | 'theory' | 'mtb';
  renderItem?: (qeustion: any) => React.ReactNode
}>

const QuestionScreen = ({question_type, renderItem}: questionTypePorps) => {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { isCorrect, questions, targetQuestion, isSubmitted, selectedId, setSelectedId, handleSubmit, answeredCount, totalQuestions, correctCount } = useQuestions(question_type, category);

  const { playSound: playCorrectSound } = useAudio({ source: sound.correct });
  const { playSound: playWrongSound } = useAudio({ source: sound.wrong });
  const { accent, foreground } = useTheme();

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

    return (
      <LessonOutroScreen
        xp={correctCount * 10}
        duration="2:30"
        target={`${scorePercentage}%`}
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
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, width: "100%" }}>
        <View style={{ height: 16, backgroundColor: accent, borderRadius: 16, position: 'relative' }}>
          <View style={{ position: 'absolute', width: `${progressPercentage}%`, height: '100%', backgroundColor: foreground, borderRadius: 16 }} />
        </View>
      </View>
      <ThemedView style={globalStyles.questionContainer}>
        <ThemedText style={globalStyles.promptText}>
          Select the correct {question_type}
        </ThemedText>
        <ThemedText style={globalStyles.targetText}>{targetQuestion.question}</ThemedText>
        <ThemedView style={question_type === "theory" ? globalStyles.theoryOptionCard : globalStyles.grid}>
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
        onPress={handleSubmit}
      />
    </ThemedView>
  );
};

export default QuestionScreen;
