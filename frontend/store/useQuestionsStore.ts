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
  answeredCount: number;
  totalQuestions: number;
  correctCount: number;
  startTime: number | null;
  endTime: number | null;
  currentCategory?: string;
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
  startTimer: (endpoint: string) => void;
  stopTimer: (endpoint: string) => void;
}

// Initial default state template for any new endpoint
const initialQuizState: QuizState = {
  selectedId: null,
  questions: [],
  targetQuestion: null,
  isCorrect: false,
  isSubmitted: false,
  isLoading: false,
  answeredCount: 0,
  totalQuestions: 0,
  correctCount: 0,
  startTime: null,
  endTime: null,
  currentCategory: undefined,
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

    startTimer: (endpoint) => set((state) => {
      const currentState = state.quizStates[endpoint] || initialQuizState;
      if (currentState.startTime) return state; // Already started
      return {
        quizStates: {
          ...state.quizStates,
          [endpoint]: { ...currentState, startTime: Date.now() }
        }
      }
    }),

    stopTimer: (endpoint) => set((state) => ({
      quizStates: {
        ...state.quizStates,
        [endpoint]: { ...(state.quizStates[endpoint] || initialQuizState), endTime: Date.now() }
      }
    })),

    fetchQuestion: async (endpoint: string, category?: string) => {
      const currentQuizState = get().quizStates[endpoint] || initialQuizState;
      const isNewCategory = currentQuizState.currentCategory !== category || (currentQuizState.answeredCount >= currentQuizState.totalQuestions && currentQuizState.totalQuestions > 0);
      
      // Set loading to true for this specific endpoint
      set((state) => ({
        quizStates: {
          ...state.quizStates,
          [endpoint]: { 
            ...(state.quizStates[endpoint] || initialQuizState), 
            isLoading: true, 
            ...(isNewCategory ? { 
                answeredCount: 0, 
                totalQuestions: 0, 
                correctCount: 0, 
                startTime: Date.now(), 
                endTime: null, 
                currentCategory: category 
            } : {}) 
          }
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

        // Fetch total questions count if it's a new category or we don't have it
        let totalQuestions = isNewCategory ? 0 : currentQuizState.totalQuestions;
        if (totalQuestions === 0) {
          try {
            let countUrl = `/quiz/count?type=${endpoint}`;
            if (category) {
              countUrl += `&category=${encodeURIComponent(category)}`;
            }
            const countRes = await api.get(countUrl);
            // Limit the total questions per session to a maximum of 10
            totalQuestions = Math.min(countRes.data.count, 10);
          } catch (err) {
            console.error("Error fetching count: ", err);
          }
        }

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
                totalQuestions,
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
                totalQuestions,
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
      const { isSubmitted, targetQuestion, selectedId, answeredCount, totalQuestions, correctCount } = currentQuiz;
      const { setIsCorrect, setIsSubmitted, setSelectedId, fetchQuestion, stopTimer } = get();

      if (!isSubmitted) {
        let isAnswerCorrect = false;
        if (endpoint === 'theory') {
          isAnswerCorrect = !!targetQuestion?.correct_ans?.includes(selectedId as string);
        } else {
          isAnswerCorrect = !!(targetQuestion && selectedId === targetQuestion.id);
        }
        
        setIsCorrect(endpoint, isAnswerCorrect);
        setIsSubmitted(endpoint, true);
        
        const newAnsweredCount = answeredCount + 1;
        const newCorrectCount = isAnswerCorrect ? correctCount + 1 : correctCount;

        set((state) => ({
          quizStates: {
            ...state.quizStates,
            [endpoint]: { 
                ...(state.quizStates[endpoint] || initialQuizState), 
                answeredCount: newAnsweredCount,
                correctCount: newCorrectCount
            }
          }
        }));

        if (newAnsweredCount >= totalQuestions) {
           stopTimer(endpoint);
        }
      } else {
        setIsSubmitted(endpoint, false);
        setSelectedId(endpoint, null);
        if (answeredCount < totalQuestions) {
          fetchQuestion(endpoint, category);
        }
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
    answeredCount: currentQuiz.answeredCount,
    totalQuestions: currentQuiz.totalQuestions,
    correctCount: currentQuiz.correctCount,
    startTime: currentQuiz.startTime,
    endTime: currentQuiz.endTime,
    setSelectedId: (id: number | string | null) => setSelectedIdAction(endpoint, id),
    fetchQuestion: () => fetchQuestionAction(endpoint, category),
    handleSubmit: () => handleSubmitAction(endpoint, category),
  };
};
