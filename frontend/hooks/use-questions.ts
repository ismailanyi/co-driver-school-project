import axios from "axios";
import { useEffect, useState } from "react";

interface Question {
  id: number;
  category?: string;
  question: string;
  image_url?: string;
}

export const useQuestions = (endpoint: string) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [questions, setQuestion] = useState<Question[]>([]);
  const [targetQuestion, setTargetQuestion] = useState<Question | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchQuestion = async (endpoint: string) => {
    try {
      const api = axios.create({
        baseURL: process.env.EXPO_PUBLIC_API_URL,
      });
      const response = await api.get(`/quiz/${endpoint}`);
      const fetchedSigns = response.data;
      setQuestion(fetchedSigns);
      const randomTarget =
        fetchedSigns[Math.floor(Math.random() * fetchedSigns.length)];
      setTargetQuestion(randomTarget);
    } catch (error) {
      console.error("Error failed to get signs: ", error);
    }
  };

  useEffect(() => {
    fetchQuestion(endpoint);
  }, []);

  const handleSubmit = () => {
    if (!isSubmitted) {
      setIsCorrect(targetQuestion && selectedId === targetQuestion.id);
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
