import axios from "axios";
import { useEffect } from "react";
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Question {
  id: number | string;
  category?: string;
  question: string;
  image_url?: string;
  correct_ans?: string[];
  wrong_ans?: string[];
  hint?: string;
}

// State shape for a single endpoint/quiz type
interface QuizState {
  selectedId: number | string | null;
  questions: any[];
  targetQuestion: Question | null;
  isCorrect: boolean | null | undefined;
  isSubmitted: boolean;
  isLoading: boolean;
}

// Structure to support multiple distinct endpoints simultaneously
interface QuestionsStoreProps {
  quizStates: Record<string, QuizState>;
  // Global actions
  setSelectedId: (endpoint: string, id: number | string | null) => void;
  setIsCorrect: (endpoint: string, isCorrect: boolean | null | undefined) => void;
  setIsSubmitted: (endpoint: string, isSubmitted: boolean) => void;
  fetchQuestion: (endpoint: string, category?: string) => Promise<void>;
  handleSubmit: (endpoint: string, category?: string) => void;
}

// Initial default state template for any new endpoint
const initialQuizState: QuizState = {
  selectedId: null,
  questions: [],
  targetQuestion: null,
  isCorrect: false,
  isSubmitted: false,
  isLoading: false,
};

const useQuestionsStore = create<QuestionsStoreProps>()(
  devtools((set, get) => ({
    quizStates: {},

    setSelectedId: (endpoint, id) => set((state) => ({
      quizStates: {
        ...state.quizStates,
        [endpoint]: { ...(state.quizStates[endpoint] || initialQuizState), selectedId: id }
      }
    })),

    setIsCorrect: (endpoint, isCorrect) => set((state) => ({
      quizStates: {
        ...state.quizStates,
        [endpoint]: { ...(state.quizStates[endpoint] || initialQuizState), isCorrect }
      }
    })),

    setIsSubmitted: (endpoint, isSubmitted) => set((state) => ({
      quizStates: {
        ...state.quizStates,
        [endpoint]: { ...(state.quizStates[endpoint] || initialQuizState), isSubmitted }
      }
    })),

    fetchQuestion: async (endpoint: string, category?: string) => {
      // Set loading to true for this specific endpoint
      set((state) => ({
        quizStates: {
          ...state.quizStates,
          [endpoint]: { ...(state.quizStates[endpoint] || initialQuizState), isLoading: true }
        }
      }));

      try {
        const api = axios.create({
          baseURL: process.env.EXPO_PUBLIC_API_URL,
        });
        
        let url = `/quiz/${endpoint}`;
        if (category) {
          url += `?category=${encodeURIComponent(category)}`;
        }
        
        const response = await api.get(url);
        const fetchedSigns = response.data;

        if (endpoint === 'theory') {
          const question = fetchedSigns[0];
          const allOptions = [...(question?.correct_ans ?? []), ...(question?.wrong_ans ?? [])];
          const shuffledQuestions = allOptions.sort(() => Math.random() - 0.5);

          const mappedAnswers = shuffledQuestions.map((option) => ({
            id: option,
            question: option,
          }));

          set((state) => ({
            quizStates: {
              ...state.quizStates,
              [endpoint]: {
                ...(state.quizStates[endpoint] || initialQuizState),
                targetQuestion: question,
                questions: mappedAnswers,
                isLoading: false,
              }
            }
          }));
        } else {
          const randomTarget = fetchedSigns[Math.floor(Math.random() * fetchedSigns.length)];
          set((state) => ({
            quizStates: {
              ...state.quizStates,
              [endpoint]: {
                ...(state.quizStates[endpoint] || initialQuizState),
                targetQuestion: randomTarget,
                questions: fetchedSigns,
                isLoading: false,
              }
            }
          }));
        }
      } catch (error) {
        console.error("Error failed to get signs: ", error);
        set((state) => ({
          quizStates: {
            ...state.quizStates,
            [endpoint]: { ...(state.quizStates[endpoint] || initialQuizState), isLoading: false }
          }
        }));
      }
    },

    handleSubmit: (endpoint: string, category?: string) => {
      const currentQuiz = get().quizStates[endpoint] || initialQuizState;
      const { isSubmitted, targetQuestion, selectedId } = currentQuiz;
      const { setIsCorrect, setIsSubmitted, setSelectedId, fetchQuestion } = get();

      if (!isSubmitted) {
        if (endpoint === 'theory') {
          setIsCorrect(endpoint, targetQuestion?.correct_ans?.includes(selectedId as string));
        } else {
          setIsCorrect(endpoint, !!(targetQuestion && selectedId === targetQuestion.id));
        }
        setIsSubmitted(endpoint, true);
      } else {
        setIsSubmitted(endpoint, false);
        setSelectedId(endpoint, null);
        fetchQuestion(endpoint, category);
      }
    }
  }))
);

// This custom hook retains your EXACT component surface signature.
// Your UI components require ZERO modifications.
export const useQuestions = (endpoint: string, category?: string) => {
  const currentQuiz = useQuestionsStore((state) => state.quizStates[endpoint]) || initialQuizState;
  const fetchQuestionAction = useQuestionsStore((state) => state.fetchQuestion);
  const handleSubmitAction = useQuestionsStore((state) => state.handleSubmit);
  const setSelectedIdAction = useQuestionsStore((state) => state.setSelectedId);

  // 3. Keep your exact original useEffect to fetch state on screen mount
  useEffect(() => {
    fetchQuestionAction(endpoint, category);
  }, [endpoint, category]);

  // 4. Return the exact state properties your old local useState hook returned
  return {
    questions: currentQuiz.questions,
    targetQuestion: currentQuiz.targetQuestion,
    isCorrect: currentQuiz.isCorrect,
    isSubmitted: currentQuiz.isSubmitted,
    selectedId: currentQuiz.selectedId,
    setSelectedId: (id: number | string | null) => setSelectedIdAction(endpoint, id),
    fetchQuestion: () => fetchQuestionAction(endpoint, category),
    handleSubmit: () => handleSubmitAction(endpoint, category),
  };
};
