import axios from 'axios';
import { useEffect, useState } from 'react';

interface Question {
  id: number;
  category?: string;
  question: string,
}

export const useQuestions =  (endpoint: string) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [questions, setQuestion ] = useState([]);
    const [targetQuestion, setTargetQuestion] = useState<Question | null>(null)
    const [isCorrect, setIsCorrect] = useState<boolean | null>(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const fetchQuestion = async (endpoint: string) => {
        try {
            const api = axios.create({
                baseURL: process.env.EXPO_PUBLIC_API_URL
            })
            const response = await api.get(`/quiz/${endpoint}`)
            const fetchedSigns = response.data;
            const randomTarget = fetchedSigns[Math.floor(Math.random() * fetchedSigns.length)];
            setTargetQuestion(randomTarget);
            setQuestion(fetchedSigns)
        } catch (error) {
            console.error("Error failed to get signs: ", error);
        }
    }
    
    useEffect(() => {
        fetchQuestion(endpoint);
    }, [])

    const handleSubmit = () => {
        if (!isSubmitted) {
            setIsCorrect(targetQuestion && selectedId === targetQuestion.id);
            setIsSubmitted(true)
        } else {
            setIsSubmitted(false)
            setSelectedId(null)
            fetchQuestion(endpoint);
        }
    }

    return {
        questions,
        targetQuestion,
        isCorrect,
        isSubmitted,
        selectedId,
        setSelectedId,
        fetchQuestion,
        handleSubmit
    }
}
