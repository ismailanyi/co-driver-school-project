import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Questions from "@/components/question-section";
import SubmitAnswer from "@/components/submit-answer";
import { globalStyles } from "@/constants/globalStyles";
import { useQuestions } from "@/hooks/use-questions";
import { PropsWithChildren } from "react";

type questionTypePorps = PropsWithChildren <{
  question_type: 'sign' | 'theory' | 'mtb';
  renderItem?: (qeustion: any) => React.ReactNode
}>

const QuestionScreen = ({question_type, renderItem}: questionTypePorps) => {
  const { isCorrect, questions, targetQuestion, isSubmitted, selectedId, setSelectedId, handleSubmit } = useQuestions(question_type);

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
