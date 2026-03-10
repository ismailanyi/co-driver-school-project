import QuestionScreen from "@/components/question-screen"
import { useQuestions } from "@/hooks/use-questions"

/* interface Sign {
  id: number;
  name: string;
  category: string;
  image_url: string;
}
 */
const Sign = () => {
    const {isCorrect,questions,targetQuestion,isSubmitted,selectedId,setSelectedId,} = useQuestions('theory')
    
    return (
        <QuestionScreen
            question_type="signs"
        />
    )
}

export default Sign