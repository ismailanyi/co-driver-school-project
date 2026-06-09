import Questions from "@/components/question-section";
import SubmitAnswer from "@/components/submit-answer";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { globalStyles } from "@/constants/globalStyles";
import { useQuestions } from "@/store/useQuestionsStore";
import { useLocalSearchParams } from "expo-router";
import { PropsWithChildren, useEffect } from "react";
import { useAudio } from "@/hooks/audio";
import { sound } from "@/assets/audios/sound";

type questionTypePorps = PropsWithChildren <{
  question_type: 'sign' | 'theory' | 'mtb';
  renderItem?: (qeustion: any) => React.ReactNode
}>

const QuestionScreen = ({question_type, renderItem}: questionTypePorps) => {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { isCorrect, questions, targetQuestion, isSubmitted, selectedId, setSelectedId, handleSubmit } = useQuestions(question_type, category);

  const { playSound: playCorrectSound } = useAudio({ source: sound.correct });
  const { playSound: playWrongSound } = useAudio({ source: sound.wrong });

  useEffect(() => {
    if (isSubmitted) {
      if (isCorrect) {
        playCorrectSound();
      } else {
        playWrongSound();
      }
    }
  }, [isSubmitted, isCorrect]);

  if (questions.length === 0 || !targetQuestion) {
    return (
      <ThemedView>
        <ThemedText style={globalStyles.container}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={globalStyles.questionScreenContainer}>
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
