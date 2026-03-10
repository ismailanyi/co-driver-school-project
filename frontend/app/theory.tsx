import { useQuestions } from "@/hooks/use-questions";
import QuestionScreen from "@/components/question-screen";

const Theory = () => {
  const {isCorrect,questions,targetQuestion,isSubmitted,selectedId,setSelectedId,} = useQuestions('theory');
  return (
    <QuestionScreen
      question_type="theory"
    />
  )
};

export default Theory;
