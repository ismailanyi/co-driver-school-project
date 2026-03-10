import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Questions from "@/components/question-section";
import SubmitAnswer from "@/components/submit-answer";
import { globalStyles } from "@/constants/globalStyles";
import { useQuestions } from "@/hooks/use-questions";
import { Image } from "expo-image";

const QuestionScreen = ({question_type}: {question_type: string}) => {
  const { isCorrect, questions, targetQuestion, isSubmitted, selectedId, setSelectedId } = useQuestions(question_type);

  if (questions.length === 0 || !targetQuestion) {
    return (
      <ThemedView>
        <ThemedText style={globalStyles.container}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView>
      <ThemedText style={globalStyles.promptText}>
        Select the correct {question_type}
      </ThemedText>
      <ThemedText style={globalStyles.targetText}>{targetQuestion.question}</ThemedText>
      <ThemedView style={globalStyles.grid}>
        {questions.map((question) => {
          const isSelected = selectedId === question.id;

          return (
            <Questions
              key={question.id}
              quesion={question}
              isSelected={isSelected}
              onPress={() => {
                setSelectedId(question.id);
              }}
            >
              <Image
                source={{ uri: question.image_url }}
                style={globalStyles.questionImage}
                contentFit="contain"
              />
            </Questions>
          );
        })}
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
