import { useQuestions } from "@/hooks/use-questions";

const Theory = () => {
  const {isCorrect,questions,targetQuestion,isSubmitted,selectedId,setSelectedId,} = useQuestions('theory');
};

export default Theory;
