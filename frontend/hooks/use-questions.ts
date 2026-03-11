import axios from "axios";
import { useEffect, useState } from "react";

interface Question {
  id: number | string;
  category?: string;
  question: string;
  image_url?: string;
  correct_ans?: string[];
  wrong_ans?: string[];
  hint?: string;
}

export const useQuestions = (endpoint: string) => {
  const [ selectedId, setSelectedId ] = useState<number | string | null>(null);
  const [ questions, setQuestions ] = useState<Question[]>([]);
  const [ targetQuestion, setTargetQuestion ] = useState<Question | null>(null);
  const [ isCorrect, setIsCorrect ] = useState<boolean | null | undefined>(false);
  const [ isSubmitted, setIsSubmitted ] = useState(false);

  const fetchQuestion = async (endpoint: string) => {
    try {
      const api = axios.create({
        baseURL: process.env.EXPO_PUBLIC_API_URL,
      });
      const response = await api.get(`/quiz/${endpoint}`);
      const fetchedSigns = response.data;
      setQuestions(fetchedSigns);
      
      if(endpoint === 'theory') {
        const question = fetchedSigns[0]
        setTargetQuestion(question);

        const allOptions = [ ...question?.correct_ans, ...question?.wrong_ans];
        const shuffledQuestions = allOptions.sort(()=> (Math.random() - 0.5))

        const mappedAnswers = shuffledQuestions.map((option) => ({
          id: option,
          question: option,
        }));
        
        setQuestions(mappedAnswers)
        
      } else {
        const randomTarget =
        fetchedSigns[Math.floor(Math.random() * fetchedSigns.length)];
        setTargetQuestion(randomTarget);
        
      }
    } catch (error) {
      console.error("Error failed to get signs: ", error);
    }
  };

  useEffect(() => {
    fetchQuestion(endpoint);
  }, []);

  const handleSubmit = () => {
    if (!isSubmitted) {
      if (endpoint === 'theory') {
        setIsCorrect(targetQuestion?.correct_ans?.includes(selectedId as string))
      }else {
        setIsCorrect(targetQuestion && selectedId === targetQuestion.id);
      }
      setIsSubmitted(true);
    } else {
      setIsSubmitted(false);
      setSelectedId(null);
      fetchQuestion(endpoint);
    }
  };

  return {
    questions,
    targetQuestion,
    isCorrect,
    isSubmitted,
    selectedId,
    setSelectedId,
    fetchQuestion,
    handleSubmit,
  };
};
